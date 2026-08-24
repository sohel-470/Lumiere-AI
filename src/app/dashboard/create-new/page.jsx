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
import PlayerDialog from '../_components/PlayerDialog'
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { toast } from 'sonner'
import { saveVideoDataAction, UpdateUserCreditsAction } from '@/app/actions'



// ============== TESTING DATA ==============
const scriptString = "Think history is boring? Think again! Here are three historical facts that sound fake but are 100% true. First up: Ancient Romans used human urine as mouthwash! They believed the ammonia kept their teeth pearly white. In 1932, the Australian military declared war on Emus... and the birds actually won! Mind blown: Cleopatra lived closer to the invention of the iPhone than to the building of the Great Pyramid of Giza. And finally, the ancient Mayans didn't just eat turkeys; they worshipped them as symbols of power and prestige! History is wild! Hit that follow button for more mind-blowing facts every day! "
const FILEURL = 'https://firebasestorage.googleapis.com/v0/b/lumiere-ai-fe65e.firebasestorage.app/o/lumiere-ai-files%2Ffbb27256-c943-42b2-9a93-aa5a53a09513.mp3?alt=media&token=c1339400-8626-4f22-99de-8173dfcbf548'
const testVideoScript = [
  {
    "scene": 1,
    "imagePrompt": "A cinematic, ultra-wide shot looking out the window of a sleek, futuristic high-speed train. Outside, a beautiful bioluminescent forest glows with soft neon blue and purple lights. High-end sci-fi aesthetic, pristine and clean, highly detailed, 8k resolution, photorealistic.",
    "ContentText": "The evening hyper-loop journey was always my favorite part of the day."
  },
  {
    "scene": 2,
    "imagePrompt": "A close-up of a futuristic, floating holographic compass resting on a smooth metallic table. Clean, high-end sci-fi interface design with glowing cyan geometric lines. No glitch effects, perfectly smooth and pristine, cinematic lighting, photorealistic, 8k.",
    "ContentText": "But today, the navigation interface locked onto a set of coordinates that shouldn't exist."
  }
]
// ============== TESTING DATA ==============



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
      if (images.length === 0) {
        toast.error("Failed to generate visuals. The prompt might have triggered safety filters. Please try a different topic.");
        setLoading(false);
        return; 
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
    const isReadyToSave =
      videoData?.videoScript?.length > 0 &&
      videoData?.audioFileUrl &&
      videoData?.captions?.length > 0 &&
      videoData?.imageList?.length > 0;
    if (isReadyToSave) {
      saveVideoData();
    }
  }, [videoData]);


  // --- REFACTORED: Now uses Server Action to save video ---
  const saveVideoData = async () => {
    setLoading(true);
    try {
      const newVideoId = await saveVideoDataAction(
        videoData, 
        user?.primaryEmailAddress?.emailAddress, 
        formData.aspectRatio
      );

      await UpdateUsercredits();
      setVideoId(newVideoId);
      setPlayVideo(Date.now());
    } catch (error) {
      console.error("Failed to save to database:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- REFACTORED: Now uses Server Action to update credits ---
  const UpdateUsercredits = async () => {
    const currentCredits = userDetail?.credits ?? 0;
    
    const newCredits = await UpdateUserCreditsAction(
      user?.primaryEmailAddress?.emailAddress, 
      currentCredits
    );

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
        <SelectTopic onUserSelect={onHandleInputChange} />
        <div className='w-full h-px bg-neutral-800/60 my-10'></div>
        <SelectStyle onUserSelect={onHandleInputChange} />
        <div className='w-full h-px bg-neutral-800/60 my-10'></div>
        <SelectAspectRatio onUserSelect={onHandleInputChange} />
        <div className='w-full h-px bg-neutral-800/60 my-10'></div>
        <SelectDuration onUserSelect={onHandleInputChange} />
      </div>

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