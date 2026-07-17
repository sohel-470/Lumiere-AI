import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const Header = () => {
    return (
        <div className='flex justify-between p-2 shadow-md'>
            <div>
                <Image src={"/logo.svg"} width={180} height={100} alt='logo.svg' />
            </div>
            <div className='flex items-center gap-5 px-3'>
                <Button variant="destructive">Dashboard</Button>
                <UserButton/>
            </div>
        </div>
    )
}

export default Header
