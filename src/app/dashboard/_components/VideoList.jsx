import React from 'react'
import {Thumbnail} from '@remotion/player';
import RemotionVideo from './RemotionVideo';

const VideoList = ({ videoList }) => {
    return (
        <div className='mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7'>
            {videoList?.map((video, index) => (
                <div className='cursor-pointer hover:scale-105 transition-all'>
                    <Thumbnail
                        component={RemotionVideo}
                        compositionWidth={250}
                        compositionHeight={300}
                        frameToDisplay={30}
                        durationInFrames={120}
                        fps={30}
                        style={{
                            borderRadius: 25
                        }}
                        inputProps={{
                            ...video,
                            setDurationInFrame: (v)=> console.log(v)
                        }}
                    />
                </div>
            ))}
        </div>
    )
}

export default VideoList
