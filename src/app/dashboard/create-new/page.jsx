'use client'
import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import axios from 'axios'
import CustomLoading from './_components/CustomLoading'

const CreateNew = () => {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [videoScript, setVideoScript] = useState()

  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName,fieldValue)
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
  };

  //Get video script:
  const GetVideoScript = async()=> {
    setLoading(true);
    const result = await axios.post('/api/get-video-script',{
      topic: formData.topic,
      imageStyle: formData.imageStyle,
      duration: formData.duration
    }).then((resp)=>{
      console.log(resp.data)
      setVideoScript(resp.data.result);
      return resp.data
    }).catch((e)=>{
      console.log("Error generating script:", e)
    });
    setLoading(false);
  };

  const onClickCreateHandler = ()=>{
    GetVideoScript()
  };

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
            <Sparkles size={22}  />
            Generate Video
          </div>

          {/* Subtle sub-text to match your reference design */}
          <span className='text-xs font-normal text-white/70'>
            200 Credits to Generate Video
          </span>

        </Button>
      </div>
      <CustomLoading loading={loading}/>
    </div>
  )
}
export default CreateNew