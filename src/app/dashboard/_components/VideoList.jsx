import React, { useState } from 'react'
import { Thumbnail } from '@remotion/player';
import RemotionVideo from './RemotionVideo';
import PlayerDialog from './PlayerDialog';
import { Play, Trash2, Monitor, Smartphone } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { toast } from 'sonner';

const VideoList = ({ videoList, refreshData }) => {
    const [openPlayDialog, setOpenPlayDialog] = useState(false);
    const [videoId, setVideoId] = useState();
    const { user } = useUser();

    const handleDelete = async (e, id) => {
        e.stopPropagation(); 
        
        const confirmDelete = window.confirm("Are you sure you want to delete this video?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete('/api/delete-video', {
                data: { videoId: id }
            });

            if (response.data.success) {
                toast.success("Video deleted successfully.");
                if (refreshData) refreshData(); 
            }
        } catch (error) {
            toast.error("Failed to delete video.");
        }
    };

    return (
        // Reverted to standard grid without 'items-start' so cards stretch uniformly
        <div className='mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7'>
            {videoList?.map((video, index) => {
                const isHorizontal = video?.format === '16:9';
                
                // We still pass the true dimensions to Remotion so it renders the frame correctly
                const compWidth = isHorizontal ? 480 : 270;
                const compHeight = isHorizontal ? 270 : 480;
                
                const isOwner = user?.primaryEmailAddress?.emailAddress === video?.createdBy;

                return (
                    <div key={index}
                        onClick={() => { setOpenPlayDialog(Date.now()); setVideoId(video?.id); }}
                        className='group relative flex flex-col p-3 rounded-[32px] border border-neutral-800 bg-[#121212]/50 hover:bg-[#121212] hover:border-[#ec0f6b]/40 hover:shadow-[0_0_30px_rgba(236,15,107,0.15)] hover:scale-105 transition-all duration-300 ease-out cursor-pointer overflow-hidden'>
                        
                        {/* 
                            FORCED VERTICAL ASPECT RATIO 
                            This locks every card to the Netflix-style vertical shape.
                            The object-cover inside the Thumbnail will handle the center-cropping.
                        */}
                        <div className='relative w-full aspect-[9/16] overflow-hidden rounded-[24px] bg-black'>
                            <Thumbnail
                                component={RemotionVideo}
                                compositionWidth={compWidth}
                                compositionHeight={compHeight}
                                frameToDisplay={30}
                                durationInFrames={120}
                                fps={30}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                inputProps={{ ...video, isThumbnail: true }}
                            />
                            
                            {/* Aspect Ratio Badge - Clean frosted glass in lower left */}
                            <div className='absolute bottom-3 left-3 z-10'>
                                <div className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white shadow-lg'>
                                    {isHorizontal ? <Monitor size={12} className="text-neutral-300" /> : <Smartphone size={12} className="text-neutral-300" />}
                                    <span className='text-[10px] font-bold tracking-wider'>{isHorizontal ? '16:9' : '9:16'}</span>
                                </div>
                            </div>

                            {/* Play Button Overlay */}
                            <div className='absolute inset-0 rounded-[24px] bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                                <div className='w-12 h-12 rounded-full bg-[#ec0f6b] flex items-center justify-center shadow-[0_0_15px_rgba(236,15,107,0.5)]'>
                                    <Play className="text-white fill-white ml-1" size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Delete Button */}
                        {isOwner && (
                            <button 
                                onClick={(e) => handleDelete(e, video.id)}
                                className='absolute top-6 right-6 p-2 bg-black/60 hover:bg-[#ef4444] text-white rounded-xl backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10'
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                )
            })}
            <PlayerDialog playVideo={openPlayDialog} videoId={videoId} />
        </div>
    )
}

export default VideoList;