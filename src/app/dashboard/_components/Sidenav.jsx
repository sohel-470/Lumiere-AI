'use client'
import { CircleUser, FolderPlus, LayoutDashboard, Rocket } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidenav = () => {

    const MenuOption = [
        {
            id: 1,
            name: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard
        },
        {
            id: 2,
            name: 'Create New',
            path: '/dashboard/create-new',
            icon: FolderPlus
        },
        {
            id: 3,
            name: 'Upgrade',
            path: '/upgrade',
            icon: Rocket
        },
        {
            id: 4,
            name: 'Account',
            path: '/account',
            icon: CircleUser
        }
    ]

    const path = usePathname()
    console.log(path)

    return (
        <div className='w-64 h-screen shadow-md pl-3'>
            <div className='grid gap-4'>
                {MenuOption.map((item, index) => (
                    <Link key={item.id} href={item.path}>
                        <div className={`flex items-center gap-4 py-4 hover:bg-primary hover:text-white rounded-md cursor-pointer ${path == item.path && 'bg-primary text-white'}`}>
                            <item.icon />
                            <h2>{item.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Sidenav
