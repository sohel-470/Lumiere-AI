import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { Film, Sparkles } from 'lucide-react'

const EmptyState = () => {
    return (
        <div className='flex flex-col items-center justify-center p-8 py-24 mt-10 border border-dashed border-neutral-800/80 rounded-[28px] bg-[#121212]/30 backdrop-blur-sm transition-all hover:border-neutral-700 hover:bg-[#121212]/50'>
            
            {/* Glowing Icon Container */}
            <div className='w-20 h-20 mb-6 rounded-full bg-[#ec0f6b]/10 flex items-center justify-center border border-[#ec0f6b]/20 shadow-[0_0_30px_rgba(236,15,107,0.15)]'>
                <Film size={32} className='text-[#ec0f6b]' />
            </div>
            
            {/* Typography */}
            <h2 className='text-3xl font-bold text-white mb-3 tracking-tight'>No videos yet</h2>
            <p className='text-neutral-400 text-sm md:text-base max-w-md text-center mb-10 leading-relaxed'>
                Your creative workspace is empty. Start generating your first AI-powered video and bring your stories to life.
            </p>
            
            {/* Upgraded Button */}
            <Link href={'/dashboard/create-new'}>
                <Button className='bg-[#ec0f6b] hover:bg-[#d00d5e] text-white rounded-full px-8 py-6 shadow-[0_0_20px_rgba(236,15,107,0.3)] transition-all flex items-center gap-2 cursor-pointer font-semibold'>
                    <Sparkles size={18} />
                    Create New Video
                </Button>
            </Link>
            
        </div>
    )
}

export default EmptyState