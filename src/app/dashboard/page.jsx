'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import EmptyState from './_components/EmptyState'
import Link from 'next/link'
import { db } from '@/configs/db'
import { VideoTable } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import VideoList from './_components/VideoList'

const Dashboard = () => {
  const {user} = useUser();
  const [videoList, setVideoList] = useState([])


  useEffect(() => {
    user && GetVideoList
  }, [user])
  

  //Get Current Users all-videos
  const GetVideoList = async()=>{
    const result = await db.select().from(VideoTable).where(eq(VideoTable?.createdBy, user?.primaryEmailAddress?.emailAddress))
    console.log(result)
    setVideoList(result)
  }


  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-3xl text-primary'>Dashboard</h2>
        <Link href={'/dashboard/create-new'}>
          <Button>+ Create New</Button>
        </Link>
      </div>

      {/* Empty State */}
      {videoList?.length == 0 && <div> <EmptyState /> </div>}

      {/* List of Videos */}
      <VideoList videoList={videoList}/>
    </div>
  )
}

export default Dashboard
