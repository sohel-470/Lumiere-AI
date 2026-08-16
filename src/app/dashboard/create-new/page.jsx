'use client'
import React, { useContext, useState, useEffect } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import axios from 'axios'
import CustomLoading from './_components/CustomLoading'
import { v4 as uuidv4 } from 'uuid';
import { VideoDataContext } from '@/app/_context/VideoDataContext'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs/db'
import { VideoTable } from '@/configs/schema'


//   ============== TESTING DATA ==============
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
];
//   ============== TESTING DATA ==============


const CreateNew = () => {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [videoScript, setVideoScript] = useState()
  const [audioFileUrl, setAudioFileUrl] = useState()
  const [captions, setCaptions] = useState()
  const [imageList, setImageList] = useState()
  const { videoData, setVideoData } = useContext(VideoDataContext)
  const { user } = useUser()


  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue)
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
  };

  const onClickCreateHandler = () => {
    GetVideoScript()
    // GenerateAudioFile(scriptString)
    // GenerateAudioCaption(FILEURL)
    // GenerateImage()
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
        'videoScript': scriptData
      }))

      setVideoScript(scriptData);

      // LOGGING THE RAW SCRIPT ARRAY
      console.log("1. RAW SCRIPT DATA RECEIVED:", scriptData);
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

    // LOGGING THE EXACT TEXT BEING SENT TO GOOGLE/ELEVENLABS
    console.log("2A. COMBINED SCRIPT TEXT:", script);

    try {
      const resp = await axios.post('/api/generate-audio', {
        text: script,
        id: id
      });

      setVideoData(prev => ({
        ...prev,
        'audioFileUrl': resp.data.result
      }))

      setAudioFileUrl(resp.data.result);

      // LOGGING THE AUDIO MP3 URL
      console.log("2B. AUDIO FILE URL RECEIVED:", resp.data.result);

      if (resp.data.result) {
        GenerateAudioCaption(resp.data.result, scriptDataArray);
      } else {
        // FAIL-SAFE: Kill the spinner if the API returns undefined
        console.error("Audio API failed to return a URL. Stopping pipeline.");
        setLoading(false);
      }
    } catch (e) {
      console.error("Error generating audio:", e);
      setLoading(false);
    }
  }


  // 3. Generate audio Captions
  const GenerateAudioCaption = async (fileUrl, scriptDataArray) => {
    try {
      const resp = await axios.post('/api/generate-caption', {
        audioFileUrl: fileUrl
      });

      setVideoData(prev => ({
        ...prev,
        'captions': resp.data.result
      }))

      setCaptions(resp?.data?.result);

      // LOGGING THE ENTIRE CAPTIONS JSON/ARRAY
      console.log("3. CAPTIONS DATA RECEIVED:", resp?.data?.result);
      GenerateImage(scriptDataArray);
    } catch (e) {
      console.error("Error generating captions:", e);
      setLoading(false);
    }
  }


  // 4. Generate images
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const GenerateImage = async (scriptDataArray) => {
    let images = [];

    // The outer try/catch handles fatal pipeline errors
    try {
      for (const Element of scriptDataArray) {
        const promptText = Element?.imagePrompt || Element?.ImagePrompt;
        if (!promptText) continue;

        // ✅ NEW: Put a try/catch INSIDE the loop for each individual image!
        try {
          const resp = await axios.post('/api/generate-image', {
            prompt: promptText
          });

          console.log("IMAGE GENERATED:", resp.data.result);
          images.push(resp.data.result);

          await delay(3000);

        } catch (imageError) {
          // If ONE image fails (like a 500 error), it just logs it and moves to the next one!
          console.error("Skipped an image due to backend error:", promptText);
        }
      }

      console.log("4. FINAL PIPELINE SUCCESS! ALL IMAGES:", images);
      console.log("FINAL SCRIPT DATA USED:", scriptDataArray);

      setVideoData(prev => ({
        ...prev,
        'imageList': images
      }))

      setImageList(images);

    } catch (error) {
      console.error("Failed to execute image generation pipeline:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Safely check if all 4 required pieces of data have been generated and exist
    const isReadyToSave =
      videoData?.videoScript &&
      videoData?.audioFileUrl &&
      videoData?.captions &&
      videoData?.imageList;

    if (isReadyToSave) {
      saveVideoData();
    }
  }, [videoData])

  // Removed the 'videoData' parameter to prevent shadowing the context variable
  const saveVideoData = async () => {
    setLoading(true)

    try {
      // 1. Pass the imported SCHEMA TABLE to insert(), not the data object
      const result = await db.insert(VideoTable).values({
        script: videoData?.videoScript,
        audioFileUrl: videoData?.audioFileUrl,
        captions: videoData?.captions,
        imageList: videoData?.imageList,
        createdBy: user?.primaryEmailAddress?.emailAddress
      })
        // 2. Pass the SCHEMA COLUMN to returning(), not the state value
        .returning({ id: VideoTable.id });

      console.log("Save success:", result)
    } catch (error) {
      console.error("Failed to save to database:", error)
    } finally {
      setLoading(false)
    }
  }



  return (
    // Added pb-36 (padding-bottom) so the user can scroll past the floating button
    <div className='max-w-5xl mx-auto pb-36'>
      {/* <h2 className='font-bold text-4xl text-[#ec0f6b] text-center mt-4'>Create New</h2> */}

      <div className='mt-8 p-8 md:p-10 bg-[#121212] border border-neutral-900 rounded-2xl'>
        {/* Select Topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />

        {/* Select Style */}
        <SelectStyle onUserSelect={onHandleInputChange} />

        {/* Duration */}
        <SelectDuration onUserSelect={onHandleInputChange} />
      </div>



      {/* 👇 IMAGE PREVIEW WITH MANUAL DOWNLOAD BUTTON 👇 */}
      {imageList?.length > 0 && (
        <div className='mt-8 p-8 md:p-10 bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl'>
          <h3 className='text-xl font-bold text-white mb-6'>Generated Scenes</h3>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {imageList.map((url, index) => (
              <div key={index} className="flex flex-col gap-3">
                {/* The Image */}
                <img
                  src={url}
                  alt={`Generated frame ${index + 1}`}
                  className='w-full object-cover aspect-[9/16] rounded-xl border border-neutral-700 shadow-md'
                />

                {/* The 100% Manual Download Button */}
                <a
                  href={url}
                  download={`Generated_Scene_${index + 1}.png`}
                  className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-sm text-center font-bold rounded-lg border border-neutral-600 transition-colors"
                >
                  📥 Download Image
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 👆 =============================================== 👆 */}



      {/* Floating Action Button Container */}
      {/* fixed to viewport, centered, pointer-events-none ensures clicks pass through the invisible wrapper */}
      <div className='fixed bottom-10 left-0 md:left-64 right-0 flex justify-center z-50 pointer-events-none'>

        {/* The actual button - re-enabled pointer events, added glow shadow and layout styling */}
        <Button className='pointer-events-auto flex flex-col items-center justify-center gap-1 bg-[#ec0f6b] hover:bg-[#d00d5e] text-white py-8 px-16 md:px-32 rounded-2xl shadow-[0px_10px_40px_rgba(236,15,107,0.9)] hover:shadow-[0_15px_50px_rgba(236,15,107,0.6)] transition-all duration-300 hover:-translate-y-2' onClick={onClickCreateHandler}>

          <div className='flex items-center gap-2 text-xl font-bold'>
            <Sparkles size={22} />
            Generate Video
          </div>

          {/* Subtle sub-text to match your reference design */}
          <span className='text-xs font-normal text-white/70'>
            200 Credits to Generate Video
          </span>

        </Button>
      </div>
      <CustomLoading loading={loading} />
    </div>
  )
}
export default CreateNew