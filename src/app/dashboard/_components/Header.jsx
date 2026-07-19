import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const Header = () => {
    return (
        // Changed to absolute fixed positioning with an exact height (65px)
        <div className='fixed top-0 left-0 w-full flex justify-between items-center p-3 px-8 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-neutral-900 z-50 h-[65px]'>
            <div className='hover:opacity-80 transition-opacity cursor-pointer'>
                <Image src={"/logo.svg"} width={140} height={40} alt='logo' /> 
            </div>
            <div className='flex items-center gap-6'>
                <Button className="bg-[#ec0f6b] hover:bg-[#d00d5e] text-white font-semibold transition-colors">
                    Dashboard
                </Button>
                <div className='border-2 border-neutral-800 rounded-full p-[2px]'>
                    <UserButton/>
                </div>
            </div>
        </div>
    )
}
export default Header