'use client'
import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from '@/components/ui/button'

const CreateNew = () => {
  
  const [formData, setFormData] = useState([])
  const onHandleInputChange = (fieldName, fieldValue) =>{
    // console.log(fieldName, fieldValue)

    setFormData(prev=>({
      ...prev,
      [fieldName]: fieldValue
    }))
    console.log(formData)
  }

  return (
    <div>
      <h2 className='font-bold text-4xl text-primary text-center'>Create New</h2>
      <div className='mt-5 p-10 shadow-md'>
        {/* Select Topic */}

          <SelectTopic onUserSelect={onHandleInputChange}/>

        {/* Select Style */}

        <SelectStyle onUserSelect={onHandleInputChange}/>
        {/* Duration */}

        <SelectDuration onUserSelect={onHandleInputChange}/>
        {/* Create Button */}

        <Button className='mt-10 w-full'>Create Video</Button>
      </div>
    </div>
  )
}

export default CreateNew
