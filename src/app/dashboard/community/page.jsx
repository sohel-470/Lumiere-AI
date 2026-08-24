'use client'
import React, { useEffect, useState } from 'react'
import VideoList from '../_components/VideoList'
import { Globe, Sparkles } from 'lucide-react'
import { GetAllCommunityVideosAction } from '@/app/actions'

const Community = () => {
    const [videoList, setVideoList] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        GetAllCommunityVideos()
    }, [])

    const GetAllCommunityVideos = async () => {
        setIsLoading(true)
        try {
            // Fetch all videos from the table, ordered by newest first
            const result = await GetAllCommunityVideosAction();
            setVideoList(result)
        } catch (error) {
            console.error("Failed to fetch community videos:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            {/* Header Section */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10'>
                <div>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ec0f6b]/10 border border-[#ec0f6b]/20 text-[#ec0f6b] text-xs font-semibold mb-3 shadow-[0_0_10px_rgba(236,15,107,0.1)]'>
                        <Sparkles size={14} /> Public Gallery
                    </div>
                    <h2 className='font-bold text-4xl text-white tracking-tight'>Community Showcase</h2>
                    <p className='text-neutral-400 mt-1 text-sm md:text-base'>
                        Explore and get inspired by AI stories created by the entire Lumiere community.
                    </p>
                </div>
                
                <div className='flex items-center gap-3 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-full text-sm font-medium'>
                    <span className='text-neutral-400'>Total Stories: <span className='text-white font-semibold'>{videoList?.length || 0}</span></span>
                </div>
            </div>

            {/* Content Section */}
            {isLoading ? (
                <div className='mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7'>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div
                            key={item}
                            className='w-full aspect-[9/16] rounded-[24px] bg-[#121212]/50 border border-neutral-800/50 animate-pulse'
                        />
                    ))}
                </div>
            ) : videoList?.length === 0 ? (
                <div className='flex flex-col items-center justify-center p-12 mt-10 rounded-[24px] border border-dashed border-neutral-800 bg-[#121212]/30 text-center'>
                    <Globe size={48} className='text-neutral-600 mb-4' />
                    <h3 className='text-xl font-bold text-white mb-2'>No Community Videos Yet</h3>
                    <p className='text-neutral-400 text-sm max-w-sm'>
                        The gallery is completely empty. Be the first to generate and share a video with the community!
                    </p>
                </div>
            ) : (
                // Reusing your existing VideoList component directly!
                <VideoList refreshData={GetAllCommunityVideos} videoList={videoList} />
            )}
        </div>
    )
}

export default Community