'use client'
import React, { useState } from 'react'
import Sidenav from './_components/Sidenav'
import { VideoDataContext } from '../_context/VideoDataContext'

const Dashboardlayout = ({ children }) => {
    const [videoData, setVideoData] = useState([])

    return (
        <VideoDataContext.Provider value={{ videoData, setVideoData }}>
            {/* 'fixed inset-0' glues the container to the very edges of the viewport */}
            <div className='bg-[#0a0a0a] flex fixed inset-0 overflow-hidden text-white font-sans'>
                
                {/* Sidenav - remains locked to the left */}
                <div className='hidden md:block w-64 h-full bg-[#121212] border-r border-neutral-900 shrink-0 z-40'>
                    <Sidenav />
                </div>
                
                {/* Main Content - handles its own scroll and fills the rest of the screen */}
                <div className='flex-1 h-full overflow-y-auto overflow-x-hidden bg-[#0a0a0a] relative'>
                    
                    {/* Ambient Sci-Fi Glow */}
                    <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#ec0f6b]/5 rounded-full blur-[150px] pointer-events-none" />
                    
                    <div className='p-8 md:p-12 relative z-10'>
                        {children}
                    </div>
                </div>

            </div>
        </VideoDataContext.Provider>
    )
}
export default Dashboardlayout