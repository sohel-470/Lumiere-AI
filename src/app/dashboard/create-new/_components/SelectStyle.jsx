'use client'
import { Palette } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

const SelectStyle = ({ onUserSelect }) => {
    const styleOptions = [
        { name: 'Realistic', image: '/realistic.jpg' },
        { name: 'Cartoon', image: '/cartoon.webp' },
        { name: 'Comic', image: '/comic.jpg' },
        { name: 'Water Colour', image: '/watercolour.jpg' },
        { name: 'GTA', image: '/gta.jpg' },
    ]
    const [selectedOption, setSelectedOption] = useState()

    return (
        <div className='mt-10'>
            <h2 className='font-bold text-2xl text-[#ec0f6b] flex items-center gap-2'> <Palette />Style</h2>
            <p className='text-gray-400'>Select video style:</p>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-7'>
                {styleOptions.map((item, index) => (
                    <div key={index}
                        className={`group relative hover:scale-105 transition-all duration-300 cursor-pointer rounded-xl overflow-hidden border-4 ${selectedOption === item.name ? 'border-[#ec0f6b]' : 'border-transparent'}`}
                        onClick={() => {
                            setSelectedOption(item.name)
                            onUserSelect('imageStyle', item.name)
                        }}>

                        <Image src={item.image} width={100} height={100} alt={item.name} className='h-48 object-cover rounded-lg w-full' />

                        {/* Mobile: Bottom colored blurred bar | Desktop: Full dark overlay on hover */}
                        <div className='absolute inset-x-0 bottom-0 h-10 bg-[#ec0f6b]/60 backdrop-blur-md md:inset-0 md:h-full md:bg-black/0 md:backdrop-blur-none md:group-hover:bg-black/60 md:group-hover:backdrop-blur-sm transition-all duration-300 z-10'></div>

                        {/* Mobile: Persistent text | Desktop: Text fades in on hover */}
                        <h2 className='absolute inset-x-0 bottom-0 h-10 flex items-center justify-center text-white md:inset-0 md:h-full md:text-[#fb056b] text-sm md:text-xl font-bold md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-20 text-center px-2'>
                            {item.name}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default SelectStyle