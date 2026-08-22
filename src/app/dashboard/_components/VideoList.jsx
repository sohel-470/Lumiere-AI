import React, { useState } from 'react'
import { Thumbnail } from '@remotion/player';
import RemotionVideo from './RemotionVideo';
import PlayerDialog from './PlayerDialog';
import { Play } from 'lucide-react';

const VideoList = ({ videoList }) => {


    const [openPlayDialog, setOpenPlayDialog] = useState()
    const [videoId, setVideoId] = useState()


    return (
        <div className='mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7'>
            {videoList?.map((video, index) => (
                <div key={index}
                    onClick={() => { setOpenPlayDialog(Date.now()); setVideoId(video?.id); }}
                    className='group relative flex flex-col p-3 rounded-[32px] border border-neutral-800 bg-[#121212]/50 hover:bg-[#121212] hover:border-[#ec0f6b]/40 hover:shadow-[0_0_30px_rgba(236,15,107,0.15)] hover:scale-105 transition-all duration-300 ease-out cursor-pointer overflow-hidden'>

                    {/* The Thumbnail */}
                    <div className='relative w-full aspect-[9/16] overflow-hidden rounded-[24px]'>
                        <Thumbnail
                            component={RemotionVideo}
                            compositionWidth={270}
                            compositionHeight={480}
                            frameToDisplay={30}
                            durationInFrames={120}
                            fps={30}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            inputProps={{ ...video, isThumbnail: true }}
                        />
                        {/* Clean, frosted play button overlay on hover */}
                        <div className='absolute inset-0 rounded-[24px] bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                            <div className='w-12 h-12 rounded-full bg-[#ec0f6b] flex items-center justify-center shadow-[0_0_15px_rgba(236,15,107,0.5)]'>
                                {/* Drop a lucide-react Play icon here */}
                                <Play className="text-white fill-white ml-1" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <PlayerDialog playVideo={openPlayDialog} videoId={videoId} />
        </div>
    )
}

export default VideoList
