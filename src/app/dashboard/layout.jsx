'use client'
import React, { useState, useEffect } from 'react'
import Sidenav from './_components/Sidenav'
import { VideoDataContext } from '../_context/VideoDataContext'
import { UserDetailContext } from '../_context/UserDetailContext'
import { useUser } from '@clerk/nextjs'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

// 1. Import your Server Action (Removed db and schema imports)
import { getUserDetailAction } from '@/app/actions'

const Dashboardlayout = ({ children }) => {
    const [videoData, setVideoData] = useState([])
    const [userDetail, setUserDetail] = useState([])
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user } = useUser();
    const pathname = usePathname();

    useEffect(() => {
        user && getUserDetail()
    }, [user])

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    const getUserDetail = async () => {
        // 2. Fetch securely from the server action
        const result = await getUserDetailAction(user?.primaryEmailAddress.emailAddress);
        if (result) {
            setUserDetail(result);
        }
    }

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <VideoDataContext.Provider value={{ videoData, setVideoData }}>
                <div className='bg-[#0a0a0a] flex fixed inset-0 overflow-hidden text-white font-sans'>
                    <div className="md:hidden absolute top-0 left-0 w-full h-16 bg-[#121212]/80 backdrop-blur-xl border-b border-neutral-900 z-50 flex items-center justify-between pl-2 pr-5 shadow-md">
                        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <img src="/logo1.svg" alt="Lumiere AI Logo" className="h-13 object-contain" />
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(true)} className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                            <Menu size={28} />
                        </button>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden fixed inset-0 z-[60] flex">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
                            <div className="relative w-72 h-full bg-[#0f0f0f] border-r border-neutral-800 shadow-[0_0_40px_rgba(236,15,107,0.1)] flex flex-col z-[70] animate-in slide-in-from-left-8 duration-300 ease-out">
                                <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white bg-black/50 hover:bg-[#ec0f6b]/20 rounded-full transition-all">
                                    <X size={20} />
                                </button>
                                <Sidenav />
                            </div>
                        </div>
                    )}

                    <div className='hidden md:block w-64 h-full bg-[#121212] border-r border-neutral-900 shrink-0 z-40'>
                        <Sidenav />
                    </div>

                    <div className='flex-1 h-full overflow-y-auto overflow-x-hidden bg-[#0a0a0a] relative pt-20 md:pt-0'>
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