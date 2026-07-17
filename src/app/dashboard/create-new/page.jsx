import React from 'react'
import SelectTopic from './_components/SelectTopic'

const CreateNew = () => {
  return (
    <div>
      <h2 className='font-bold text-4xl text-primary text-center'>Create New</h2>
      <div className='mt-10 p-10 shadow-md'>
        {/* Select Topic */}

          <SelectTopic/>

        {/* Select Style */}

        {/* Duration */}

        {/* Create Button */}
      </div>
    </div>
  )
}

export default CreateNew
