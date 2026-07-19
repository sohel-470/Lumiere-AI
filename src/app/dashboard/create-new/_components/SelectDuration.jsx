import React from 'react'
import { Clock } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const SelectDuration = ({onUserSelect}) => {
    return (
        <div className='mt-7'>
            <h2 className='font-bold text-2xl text-primary flex items-center gap-2'> <Clock />Duration</h2>
            <p className='text-gray-400'>Set the duration of video:</p>

            <Select onValueChange={(value) => onUserSelect('duration', value)}>
                <SelectTrigger className="w-full mt-7 p-6 text-lg">
                    <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value='15 Seconds'>15 Seconds</SelectItem>
                        <SelectItem value='20 Seconds'>20 Seconds</SelectItem>
                        <SelectItem value='30 Seconds'>30 Seconds</SelectItem>
                        <SelectItem value='45 Seconds'>45 Seconds</SelectItem>
                        <SelectItem value='60 Seconds'>60 Seconds</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default SelectDuration
