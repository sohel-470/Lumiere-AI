'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState, useContext } from 'react' // Added useContext
import EmptyState from './_components/EmptyState'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import VideoList from './_components/VideoList'
import { UserDetailContext } from '../_context/UserDetailContext' // Imported context
import { GetVideoListAction } from '@/app/actions'

const Dashboard = () => {
  const { user } = useUser();
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { userDetail } = useContext(UserDetailContext);

  useEffect(() => {
    user && GetVideoList()
  }, [user])

  const GetVideoList = async () => {
    setIsLoading(true); 
    try {
      const result = await GetVideoListAction(user?.primaryEmailAddress?.emailAddress);
      setVideoList(result);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setIsLoading(false); 
    }
  }

  return (
    <div>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10'>
        <div>
          <h2 className='font-bold text-4xl text-white tracking-tight'>Dashboard</h2>
          <p className='text-neutral-400 mt-1 text-sm'>Manage and generate your AI video assets.</p>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-3 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-full text-sm font-medium'>
            <span className='text-neutral-400'>Videos: <span className='text-white'>{videoList?.length || 0}</span></span>
            <div className='w-px h-4 bg-neutral-700'></div>
            {/* Replaced hardcoded 200 with dynamic context data */}
            <span className='text-[#ec0f6b]'>{userDetail?.credits || 0} Credits</span>
          </div>
          <Link href={'/dashboard/create-new'}>
            <Button className='bg-[#ec0f6b] hover:bg-[#d00d5e] text-white rounded-full px-6 shadow-[0_0_20px_rgba(236,15,107,0.3)] transition-all'>
              + Create New
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className='mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7'>
          {[1, 2, 3, 4].map((item) => (
            <div 
              key={item} 
              className='w-full aspect-[9/16] rounded-[24px] bg-[#121212]/50 border border-neutral-800/50 animate-pulse'
            />
          ))}
        </div>
      ) : videoList?.length === 0 ? (
        <div> 
          <EmptyState /> 
        </div>
      ) : (
        <VideoList videoList={videoList} refreshData={GetVideoList} />
      )}
    </div>
  )
}

export default Dashboard