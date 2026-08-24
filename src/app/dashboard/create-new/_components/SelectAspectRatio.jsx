'use client'
import React, { useState } from 'react'
import { Smartphone, Monitor, CheckCircle2 } from 'lucide-react'

const SelectAspectRatio = ({ onUserSelect }) => {
    const [selectedFormat, setSelectedFormat] = useState('9:16')

    const formatOptions = [
        {
            id: '9:16',
            title: 'Vertical (9:16)',
            desc: 'Instagram Reels, TikTok & YouTube Shorts',
            icon: Smartphone,
            aspectBadge: '9:16',
        },
        {
            id: '16:9',
            title: 'Horizontal (16:9)',
            desc: 'YouTube Videos, Desktop & Cinema Display',
            icon: Monitor,
            aspectBadge: '16:9',
        }
    ]

    const handleSelect = (formatId) => {
        setSelectedFormat(formatId)
        onUserSelect('aspectRatio', formatId)
    }

    return (
        <div className='mt-10'>
            <h2 className='font-bold text-2xl text-[#ec0f6b] flex items-center gap-2'>
                <Monitor className='text-[#ec0f6b]' size={24} /> Aspect Ratio & Format
            </h2>
            <p className='text-neutral-400 text-sm mt-1'>Choose the orientation for your generated video:</p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-6'>
                {formatOptions.map((item) => {
                    const isSelected = selectedFormat === item.id;
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.id}
                            onClick={() => handleSelect(item.id)}
                            className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center justify-between ${
                                isSelected
                                    ? 'bg-[#1a141e] border-[#ec0f6b] shadow-[0_0_25px_rgba(236,15,107,0.2)]'
                                    : 'bg-[#121212]/70 border-neutral-800 hover:border-neutral-700 hover:bg-[#161616]'
                            }`}
                        >
                            <div className='flex items-center gap-4'>
                                <div className={`p-3.5 rounded-xl border transition-colors ${
                                    isSelected
                                        ? 'bg-[#ec0f6b]/15 border-[#ec0f6b]/40 text-[#ec0f6b]'
                                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 group-hover:text-white'
                                }`}>
                                    <Icon size={26} />
                                </div>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <h3 className={`font-semibold text-base ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                                            {item.title}
                                        </h3>
                                        <span className='px-2 py-0.5 text-xs rounded-md bg-neutral-800 text-neutral-400 font-mono'>
                                            {item.aspectBadge}
                                        </span>
                                    </div>
                                    <p className='text-xs text-neutral-400 mt-0.5'>{item.desc}</p>
                                </div>
                            </div>

                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                isSelected ? 'text-[#ec0f6b]' : 'text-neutral-600'
                            }`}>
                                <CheckCircle2 size={20} className={isSelected ? 'fill-[#ec0f6b]/20 text-[#ec0f6b]' : 'text-neutral-700'} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SelectAspectRatio