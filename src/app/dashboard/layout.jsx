import React from 'react'
import Sidenav from './_components/Sidenav'

const Dashboardlayout = ({ children }) => {
    return (
        // 'fixed inset-0' glues the container to the very edges of the viewport
        <div className='bg-[#0a0a0a] flex fixed inset-0 overflow-hidden text-white font-sans'>
            
            {/* Sidenav - remains locked to the left */}
            <div className='hidden md:block w-64 h-full bg-[#121212] border-r border-neutral-900 shrink-0 z-40'>
                <Sidenav />
            </div>
            
            {/* Main Content - handles its own scroll and fills the rest of the screen */}
            <div className='flex-1 h-full overflow-y-auto bg-[#0a0a0a]'>
                <div className='p-8 md:p-12'>
                    {children}
                </div>
            </div>
            
        </div>
    )
}
export default Dashboardlayout