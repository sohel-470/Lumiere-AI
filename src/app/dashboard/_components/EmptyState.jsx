import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const EmptyState = () => {
    return (
        <div className='flex flex-col items-center p-5 py-24 mt-10 border-2 border-dashed'>
            <h2>Nothing to see here</h2>
            <Link href={'/dashboard/create-new'}>
                <Button>Create New Video</Button>
            </Link>
        </div>
    )
}

export default EmptyState
