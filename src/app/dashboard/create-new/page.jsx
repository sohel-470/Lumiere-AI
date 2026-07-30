'use client'
import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import axios from 'axios'
import CustomLoading from './_components/CustomLoading'
import { v4 as uuidv4 } from 'uuid';


const scriptString = "Think history is boring? Think again! Here are three historical facts that sound fake but are 100% true. First up: Ancient Romans used human urine as mouthwash! They believed the ammonia kept their teeth pearly white. In 1932, the Australian military declared war on Emus... and the birds actually won! Mind blown: Cleopatra lived closer to the invention of the iPhone than to the building of the Great Pyramid of Giza. And finally, the ancient Mayans didn't just eat turkeys; they worshipped them as symbols of power and prestige! History is wild! Hit that follow button for more mind-blowing facts every day! "
const FILEURL = 'https://firebasestorage.googleapis.com/v0/b/lumiere-ai-fe65e.firebasestorage.app/o/lumiere-ai-files%2Ffbb27256-c943-42b2-9a93-aa5a53a09513.mp3?alt=media&token=c1339400-8626-4f22-99de-8173dfcbf548'

const CreateNew = () => {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [videoScript, setVideoScript] = useState()
  const [audioFileUrl, setAudioFileUrl] = useState()
  const [captions, setCaptions] = useState()

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
  };


  //Get video script:
  const GetVideoScript = async () => {
    setLoading(true);
    const result = await axios.post('/api/get-video-script', {
      topic: formData.topic,
      imageStyle: formData.imageStyle,
      duration: formData.duration
    }).then((resp) => {
      console.log(resp.data)

      const scriptData = resp.data.result; // Store the result in a variable

      setVideoScript(scriptData); // Update state (for later use)
      GenerateAudioFile(scriptData); // Pass the variable directly!

      return resp.data
    }).catch((e) => {
      console.log("Error generating script:", e)
    });
    setLoading(false);
  };


  // Generate Audio File
  const GenerateAudioFile = async (scriptString) => {
    let script = '';
    const id = uuidv4();

    // Add an optional chaining (?.) just in case the API returns something unexpected
    scriptData?.forEach(item => {
      const textChunk = item.contentText || item.ContentText || '';
      script = script + textChunk + ' ';
    })
    console.log(script)

    await axios.post('/api/generate-audio', {
      text: scriptString,
      id: id
    }).then(resp => {
      console.log(resp.data)
      setAudioFileUrl(resp.data.result)
      resp.data.result && GenerateAudioCaption(resp.data.result)
    })
  }

  //Generate audio Captions
  const GenerateAudioCaption = async (fileUrl) => {
    setLoading(true);

    await axios.post('/api/generate-caption', {
      audioFileUrl: fileUrl
    }).then(resp => {
      console.log(resp.data.result);
      setCaptions(resp?.data?.result);
    })

    

    console.log(videoScript,captions,audioFileUrl);
  }

  //Generate images
  const GenerateImage = () =>{

    videoScript.forEach(async(Element) =>{
      await axios.post('/api/generate-image',{
        prompt: Element?.imagePrompt || Element?.ImagePrompt
      }).then(resp =>{
        console.log(resp.data.result);
      })
    })

    setLoading(false);
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