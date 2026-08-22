'use client'
import { CircleUser, FolderPlus, LayoutDashboard, Rocket, Gem } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { Button } from '@/components/ui/button'

const Sidenav = () => {
    // Pull the user details from context to get the real credit count
    const { userDetail } = useContext(UserDetailContext);
    
    const MenuOption = [
        { id: 1, name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { id: 2, name: 'Create New', path: '/dashboard/create-new', icon: FolderPlus },
        { id: 3, name: 'Upgrade', path: '/upgrade', icon: Rocket },
        { id: 4, name: 'Account', path: '/account', icon: CircleUser }
    ]
    const path = usePathname()

    return (
        <div className='w-full h-full flex flex-col'>
            {/* Top: Logo */}
            <div className='p-2 mb-5 flex items-center justify-center'>
                <Image src={"/logo.svg"} width={250} height={250} alt='logo' className=' cursor-pointer hover:opacity-80 transition-opacity' />
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
                    <Button className='w-full bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl transition-all'>
                        Add Credits
                    </Button>
                </div>
            </div>

            {/* Bottom: User Account Section */}
            <div className='p-5 border-t border-neutral-900 flex items-center gap-3 bg-[#0f0f0f]'>
                <div className='border-2 border-neutral-800 rounded-full p-[2px] bg-black flex items-center justify-center shrink-0'>
                    <UserButton afterSignOutUrl="/"/>
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