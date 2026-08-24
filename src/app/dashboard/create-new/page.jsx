'use client'
import React, { useContext, useState, useEffect } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import SelectAspectRatio from './_components/SelectAspectRatio'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import axios from 'axios'
import CustomLoading from './_components/CustomLoading'
import { v4 as uuidv4 } from 'uuid'
import { VideoDataContext } from '@/app/_context/VideoDataContext'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs/db'
import { Users, VideoTable } from '@/configs/schema'
import PlayerDialog from '../_components/PlayerDialog'
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

const CreateNew = () => {
  const [formData, setFormData] = useState({ aspectRatio: '9:16' })
  const [loading, setLoading] = useState(false)
  const [videoScript, setVideoScript] = useState()
  const [audioFileUrl, setAudioFileUrl] = useState()
  const [captions, setCaptions] = useState()
  const [imageList, setImageList] = useState()
  const { videoData, setVideoData } = useContext(VideoDataContext)
  const { user } = useUser()
  const [playVideo, setPlayVideo] = useState(false)
  const [videoId, setVideoId] = useState(1)
  const { userDetail, setUserDetail } = useContext(UserDetailContext)

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
  };

  const onClickCreateHandler = () => {
    if ((userDetail?.credits ?? 0) < 100) {
      toast.error("Not enough credits to generate a video. Please add more credits.", { position: "top-right" });
      return;
    }
    GetVideoScript();
  };

  // 1. Get video script
  const GetVideoScript = async () => {
    setLoading(true);
    try {
      const resp = await axios.post('/api/get-video-script', {
        topic: formData.topic,
        imageStyle: formData.imageStyle,
        duration: formData.duration
      });
      const scriptData = resp.data.result;
      setVideoData(prev => ({
        ...prev,
        videoScript: scriptData
      }));
      setVideoScript(scriptData);
      GenerateAudioFile(scriptData);
    } catch (e) {
      console.error("Error generating script:", e);
      setLoading(false);
    }
  };

  // 2. Generate Audio File
  const GenerateAudioFile = async (scriptDataArray) => {
    let script = '';
    const id = uuidv4();
    scriptDataArray?.forEach(item => {
      const textChunk = item.contentText || item.ContentText || '';
      script = script + textChunk + ' ';
    });

    try {
      const resp = await axios.post('/api/generate-audio', {
        text: script,
        id: id
      });
      setVideoData(prev => ({
        ...prev,
        audioFileUrl: resp.data.result
      }));
      setAudioFileUrl(resp.data.result);
      if (resp.data.result) {
        GenerateAudioCaption(resp.data.result, scriptDataArray);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error("Error generating audio:", e);
      setLoading(false);
    }
  };

  // 3. Generate audio Captions
  const GenerateAudioCaption = async (fileUrl, scriptDataArray) => {
    try {
      const resp = await axios.post('/api/generate-caption', {
        audioFileUrl: fileUrl
      });
      setVideoData(prev => ({
        ...prev,
        captions: resp.data.result
      }));
      setCaptions(resp?.data?.result);
      GenerateImage(scriptDataArray);
    } catch (e) {
      console.error("Error generating captions:", e);
      setLoading(false);
    }
  };

  // 4. Generate images
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const GenerateImage = async (scriptDataArray) => {
    let images = [];
    try {
      for (const Element of scriptDataArray) {
        const promptText = Element?.imagePrompt || Element?.ImagePrompt;
        if (!promptText) continue;

        try {
          const resp = await axios.post('/api/generate-image', {
            prompt: promptText,
            aspectRatio: formData.aspectRatio || '9:16'
          });
          images.push(resp.data.result);
          await delay(3000);
        } catch (imageError) {
          console.error("Skipped an image due to backend error:", promptText);
        }
      }

      // --- SAFEGUARD ---
      if (images.length === 0) {
        toast.error("Failed to generate visuals. The prompt might have triggered safety filters. Please try a different topic.");
        setLoading(false);
        return; // Abort here! Do not update videoData.
      }

      setVideoData(prev => ({
        ...prev,
        imageList: images
      }));
      setImageList(images);
    } catch (error) {
      console.error("Failed image generation:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // STRICT CHECK: Ensure arrays actually have items in them
    const isReadyToSave =
      videoData?.videoScript?.length > 0 &&
      videoData?.audioFileUrl &&
      videoData?.captions?.length > 0 &&
      videoData?.imageList?.length > 0;

    if (isReadyToSave) {
      saveVideoData();
    }
  }, [videoData]);

  const saveVideoData = async () => {
    setLoading(true);
    try {
      const result = await db.insert(VideoTable).values({
        script: videoData?.videoScript,
        audioFileUrl: videoData?.audioFileUrl,
        captions: videoData?.captions,
        imageList: videoData?.imageList,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        format: formData.aspectRatio || '9:16'
      }).returning({ id: VideoTable.id });

      await UpdateUsercredits();
      setVideoId(result[0].id);
      setPlayVideo(Date.now());
    } catch (error) {
      console.error("Failed to save to database:", error);
    } finally {
      setLoading(false);
    }
  };

  const UpdateUsercredits = async () => {
    const currentCredits = userDetail?.credits ?? 0;
    const newCredits = Math.max(0, currentCredits - 100);
    await db
      .update(Users)
      .set({ credits: newCredits })
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

    setUserDetail((prev) => ({
      ...prev,
      credits: newCredits,
    }));
    setVideoData(null);
  };

  return (
    <div className='max-w-4xl mx-auto pb-48'>
      {/* Header */}
      <div className='mb-8'>
        <h2 className='font-bold text-4xl text-white tracking-tight'>Create New Story</h2>
        <p className='text-neutral-400 mt-1 text-sm md:text-base'>
          Configure your prompt, style, format, and let AI bring your narrative to life.
        </p>
      </div>

      {/* Main Form Container */}
      <div className='p-8 md:p-10 bg-[#121212]/70 backdrop-blur-xl border border-neutral-800/80 rounded-[28px] shadow-[0_0_50px_rgba(0,0,0,0.5)]'>
        {/* 1. Content / Prompt */}
        <SelectTopic onUserSelect={onHandleInputChange} />

        <div className='w-full h-px bg-neutral-800/60 my-10'></div>

        {/* 2. Visual Style */}
        <SelectStyle onUserSelect={onHandleInputChange} />

        <div className='w-full h-px bg-neutral-800/60 my-10'></div>

        {/* 3. Aspect Ratio & Format */}
        <SelectAspectRatio onUserSelect={onHandleInputChange} />

        <div className='w-full h-px bg-neutral-800/60 my-10'></div>

        {/* 4. Duration */}
        <SelectDuration onUserSelect={onHandleInputChange} />
      </div>

      {/* Bottom Docked Floating Action Bar */}
      {/* <div className='fixed bottom-6 left-0 md:left-64 right-0 flex justify-center z-40 pointer-events-none px-4'>
        <div className='pointer-events-auto bg-[#121212]/90 backdrop-blur-xl border border-neutral-800/90 rounded-2xl p-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)]'>
          <Button
            onClick={onClickCreateHandler}
            disabled={loading}
            className='flex items-center gap-3 bg-[#ec0f6b] hover:bg-[#d00d5e] text-white py-6 px-10 md:px-14 rounded-xl shadow-[0_0_25px_rgba(236,15,107,0.4)] hover:shadow-[0_0_35px_rgba(236,15,107,0.6)] transition-all cursor-pointer'
          >
            <Sparkles size={20} className='animate-pulse' />
            <div className='text-left'>
              <div className='font-bold text-base leading-none'>Generate Video</div>
              <span className='text-[11px] font-normal text-white/80 leading-tight'>100 Credits per generation</span>
            </div>
          </Button>
        </div>
      </div> */}

      {/* Floating Action Button Container */}
      {/* fixed to viewport, centered, pointer-events-none ensures clicks pass through the invisible wrapper */}
      <div className='fixed bottom-10 left-0 md:left-64 right-0 flex justify-center z-50 pointer-events-none'>
        <Button className='pointer-events-auto flex flex-col items-center justify-center gap-1 bg-[#ec0f6b] hover:bg-[#d00d5e] text-white py-8 px-16 md:px-32 rounded-2xl shadow-[0px_10px_40px_rgba(236,15,107,0.9)] hover:shadow-[0_15px_50px_rgba(236,15,107,0.6)] transition-all duration-300 hover:-translate-y-2' onClick={onClickCreateHandler}>
          <div className='flex items-center gap-2 text-xl font-bold'>
            <Sparkles size={22} />
            Generate Video
          </div>
          <span className='text-xs font-normal text-white/70'>
            100 Credits to Generate Video
          </span>
        </Button>
      </div>

      <CustomLoading loading={loading} />
      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </div>
  )
}

export default CreateNew