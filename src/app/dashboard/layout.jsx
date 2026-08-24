'use client'
import React, { useState, useEffect } from 'react'
import Sidenav from './_components/Sidenav'
import { VideoDataContext } from '../_context/VideoDataContext'
import { UserDetailContext } from '../_context/UserDetailContext'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs/db'
import { Users } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Dashboardlayout = ({ children }) => {
    const [videoData, setVideoData] = useState([])
    const [userDetail, setUserDetail] = useState([])
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const { user } = useUser();
    const pathname = usePathname();

    useEffect(() => {
        user && getUserDetail()
    }, [user])

    // Auto-close the mobile menu when a navigation route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    const getUserDetail = async () => {
        const result = await db.select().from(Users).where(eq(Users.email, user?.primaryEmailAddress.emailAddress))
        setUserDetail(result[0])
    }

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <VideoDataContext.Provider value={{ videoData, setVideoData }}>
                <div className='bg-[#0a0a0a] flex fixed inset-0 overflow-hidden text-white font-sans'>

                    {/* --- MOBILE HEADER --- */}
                    {/* CHANGED: Swapped px-6 for pl-3 pr-5 to pull the logo left */}
                    <div className="md:hidden absolute top-0 left-0 w-full h-16 bg-[#121212]/80 backdrop-blur-xl border-b border-neutral-900 z-50 flex items-center justify-between pl-2 pr-5 shadow-md">
                        
                        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <img src="/logo1.svg" alt="Lumiere AI Logo" className="h-13 object-contain" />
                        </Link>
                        
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <Menu size={28} />
                        </button>
                    </div>

                    {/* --- MOBILE MENU OVERLAY --- */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden fixed inset-0 z-[60] flex">
                            {/* Dark Blurred Backdrop */}
                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            {/* Sliding Sidenav Panel */}
                            <div className="relative w-72 h-full bg-[#0f0f0f] border-r border-neutral-800 shadow-[0_0_40px_rgba(236,15,107,0.1)] flex flex-col z-[70] animate-in slide-in-from-left-8 duration-300 ease-out">
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white bg-black/50 hover:bg-[#ec0f6b]/20 rounded-full transition-all"
                                >
                                    <X size={20} />
                                </button>
                                <Sidenav />
                            </div>
                        </div>
                    )}

                    {/* --- DESKTOP SIDENAV --- */}
                    <div className='hidden md:block w-64 h-full bg-[#121212] border-r border-neutral-900 shrink-0 z-40'>
                        <Sidenav />
                    </div>

                    {/* --- MAIN CONTENT --- */}
                    {/* Added pt-20 on mobile to push content below the new fixed header */}
                    <div className='flex-1 h-full overflow-y-auto overflow-x-hidden bg-[#0a0a0a] relative pt-20 md:pt-0'>
                        {/* Ambient Sci-Fi Glow */}
                        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#ec0f6b]/5 rounded-full blur-[150px] pointer-events-none" />
                        <div className='p-6 md:p-12 relative z-10'>
                            {children}
                        </div>
                    </div>

                </div>
            </VideoDataContext.Provider>
        </UserDetailContext.Provider>
    )
}

export default Dashboardlayout