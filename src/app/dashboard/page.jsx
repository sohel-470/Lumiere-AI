'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import EmptyState from './_components/EmptyState'
import Link from 'next/link'
import { db } from '@/configs/db'
import { VideoTable } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import VideoList from './_components/VideoList'
import { eq } from 'drizzle-orm'

const Dashboard = () => {
  const { user } = useUser();
  const [videoList, setVideoList] = useState([])


  useEffect(() => {
    user && GetVideoList()
  }, [user])


  //Get Current Users all-videos
  const GetVideoList = async () => {
    const result = await db.select().from(VideoTable).where(eq(VideoTable?.createdBy, user?.primaryEmailAddress?.emailAddress))
    console.log(result)
    setVideoList(result)
  }


  return (
    <div>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10'>
        <div>
          <h2 className='font-bold text-4xl text-white tracking-tight'>Dashboard</h2>
          <p className='text-neutral-400 mt-1 text-sm'>Manage and generate your AI video assets.</p>
        </div>

        <div className='flex items-center gap-4'>
          {/* Clean stats pill */}
          <div className='flex items-center gap-3 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-full text-sm font-medium'>
            <span className='text-neutral-400'>Videos: <span className='text-white'>{videoList?.length || 0}</span></span>
            <div className='w-px h-4 bg-neutral-700'></div>
            <span className='text-[#ec0f6b]'>200 Credits</span>
          </div>

          <Link href={'/dashboard/create-new'}>
            <Button className='bg-[#ec0f6b] hover:bg-[#d00d5e] text-white rounded-full px-6 shadow-[0_0_20px_rgba(236,15,107,0.3)] transition-all'>
              + Create New
            </Button>
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {videoList?.length == 0 && <div> <EmptyState /> </div>}

      {/* List of Videos */}
      <VideoList videoList={videoList} />
    </div>
  )
}

export default Dashboard
