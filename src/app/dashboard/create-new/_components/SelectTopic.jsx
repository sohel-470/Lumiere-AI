'use client'
import React, { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FileText } from 'lucide-react'

const SelectTopic = ({ onUserSelect }) => {
    const options = ['Custom Prompt', 'Random AI Story', 'Robotics', 'Historical Facts', 'Bed Time Story', 'Motivational', 'Fun Facts']

    const [selectedOption, setSelectedOption] = useState()

    return (
        <div>
            <h2 className='font-bold text-2xl text-primary flex items-center gap-2'> <FileText />Content</h2>
            <p className='text-gray-400'>What is the topic of your video?</p>

            <Select onValueChange={(value) => {
                setSelectedOption(value)
                value != 'Custom Prompt' && onUserSelect('topic', value)
            }}>
                <SelectTrigger className="w-full mt-7 p-6 text-lg">
                    <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options.map((item, index) => (
                            <SelectItem key={index} value={item}>{item}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {selectedOption == 'Custom Prompt' &&
                <Textarea className={'mt-3'}
                onChange = {(e)=> onUserSelect("topic", e.target.value)}
                placeholder="Enter your prompt" />
            }
        </div>
    )
}

export default SelectTopic
