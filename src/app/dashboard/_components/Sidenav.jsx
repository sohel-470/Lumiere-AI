'use client'
import { CircleUser, FolderPlus, LayoutDashboard, Rocket, Gem, Code, Globe, Mail, Laptop } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"

// Custom GitHub Icon since Lucide removed brand logos
const GithubIcon = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

const Sidenav = () => {
    // Pull the user details from context to get the real credit count
    const { userDetail } = useContext(UserDetailContext);

    const MenuOption = [
        { id: 1, name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { id: 2, name: 'Create New', path: '/dashboard/create-new', icon: FolderPlus },
        { id: 3, name: 'Community', path: '/dashboard/community', icon: Globe },
        { id: 4, name: 'Upgrade', path: '/dashboard/upgrade', icon: Rocket },
        { id: 5, name: 'Account', path: '/dashboard/account', icon: CircleUser }
    ]
    const path = usePathname()

    return (
        <div className='w-full h-full flex flex-col'>
            {/* Top: Logo */}
            <div className='p-2 mb-5 flex items-center justify-center'>
                <Link href={'/'} className='cursor-pointer hover:opacity-80 transition-opacity'>
                    <Image src={"/logo1.svg"} width={250} height={72} alt='logo' />
                </Link>
            </div>

            {/* Middle: Navigation */}
            <div className='flex-1 px-4 grid gap-2 auto-rows-max'>
                {MenuOption.map((item) => {
                    const isActive = path === item.path;
                    return (
                        <Link key={item.id} href={item.path}>
                            <div className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer font-medium
                                ${isActive
                                    ? 'bg-[#ec0f6b]/10 text-[#ec0f6b] border border-[#ec0f6b]/20 shadow-[0_0_15px_rgba(236,15,107,0.05)]'
                                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                                }`}>
                                <item.icon
                                    size={22}
                                    className={`transition-colors ${isActive ? 'text-[#ec0f6b]' : 'text-neutral-500'}`}
                                />
                                <h2 className='tracking-wide'>{item.name}</h2>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Bottom: Credits Section */}
            <div className='px-4 mb-4'>
                <div className='bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-4'>
                    <div className='flex items-center gap-2 mb-4'>
                        <Gem className='text-[#ec0f6b]' size={18} />
                        <span className='text-sm font-medium text-white'>
                            Remaining Credits: {userDetail?.credits || 0}
                        </span>
                    </div>
                    <Link href="/dashboard/upgrade">
                        <Button className='w-full bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl transition-all'>
                            Add Credits
                        </Button>
                    </Link>
                </div>
            </div>






            {/* --- DEVELOPER PROFILE BUTTON & POPUP --- */}
            <div className='px-4 mb-4'>
                <Dialog>
                    <DialogTrigger asChild>
                        {/* Upgraded Sidebar Button */}
                        <button className='w-full flex items-center gap-4 py-3 px-4 rounded-xl text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent transition-all duration-200 cursor-pointer group'>
                            <Laptop size={22} className="group-hover:text-[#ec0f6b] transition-colors" />
                            <h2 className='tracking-wide text-sm font-medium'>Meet the Developer</h2>
                        </button>
                    </DialogTrigger>

                    {/* The Popup Modal (Notice the [&>button]:text-white at the end of className) */}
                    <DialogContent
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        className="bg-[#121212]/95 backdrop-blur-2xl border border-neutral-800 shadow-[0_0_50px_rgba(236,15,107,0.15)] sm:max-w-[340px] rounded-[24px] p-6 outline-none [&>button]:text-white [&>button:hover]:text-[#ec0f6b] [&>button:hover]:bg-white/5 [&>button]:transition-all"
                    >
                        <DialogTitle className="sr-only">Developer Profile</DialogTitle>

                        <div className="flex flex-col items-center">
                            {/* Profile Picture */}
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#ec0f6b]/40 shadow-[0_0_25px_rgba(236,15,107,0.2)] mb-4 bg-black">
                                <img src="/my-profile-pic.jpeg" alt="Sohel Mondal" className="w-full h-full object-cover" />
                            </div>

                            {/* Identity */}
                            <h3 className="text-xl font-bold text-white tracking-tight mb-1">Sohel Mondal</h3>
                            <p className="text-sm text-[#ec0f6b] font-medium mb-1">Software Developer</p>
                            <p className="text-xs text-neutral-400 text-center mb-5 font-medium tracking-wide">
                                Electrical Engineering • Jadavpur University
                            </p>

                            {/* Tech Stack Tags */}
                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">Next.js</span>
                                <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">Tailwind CSS</span>
                                <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">JavaScript</span>
                                <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">GCP</span>
                            </div>

                            {/* Links */}
                            <div className="flex flex-col gap-3 w-full">
                                <a href="mailto:mondalsohel47025@gmail.com" className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-[#ec0f6b]/50 hover:bg-[#ec0f6b]/5 transition-all duration-300 group">
                                    <Mail size={16} className="text-neutral-500 group-hover:text-[#ec0f6b] transition-colors" />
                                    <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">Contact via Email</span>
                                </a>
                                {/* Make sure to paste your actual GitHub URL here! */}
                                <a href="https://github.com/sohel-470" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-[#ec0f6b]/50 hover:bg-[#ec0f6b]/5 transition-all duration-300 group">
                                    <GithubIcon size={16} className="text-neutral-500 group-hover:text-[#ec0f6b] transition-colors" />
                                    <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">View on GitHub</span>
                                </a>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>







            {/* Bottom: User Account Section */}
            <div className='p-5 border-t border-neutral-900 flex items-center gap-3 bg-[#0f0f0f]'>
                <div className='border-2 border-neutral-800 rounded-full p-[2px] bg-black flex items-center justify-center shrink-0'>
                    <UserButton afterSignOutUrl="/" />
                </div>
                <div className='flex flex-col overflow-hidden'>
                    <span className='text-sm font-semibold text-white truncate'>My Account</span>
                    <span className='text-xs text-neutral-500 truncate'>Manage settings</span>
                </div>
            </div>
        </div>
    )
}

export default Sidenav