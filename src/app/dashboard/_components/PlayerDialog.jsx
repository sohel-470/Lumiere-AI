import React, { useEffect, useState } from 'react'
import { Player } from "@remotion/player";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import RemotionVideo from './RemotionVideo';
import { VideoTable } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/configs/db';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

function PlayerDialog({ playVideo, videoId }) {

    const [openDialog, setOpenDialog] = useState(false)
    const [videoData, setVideoData] = useState()
    const [durationInFrame, setDurationInFrame] = useState(100)// 100 is just a default value
    const router = useRouter()

    useEffect(() => {
        setOpenDialog(playVideo)
        videoId && GetVideoData();
    }, [playVideo])

    const GetVideoData = async () => {
        const result = await db.select().from(VideoTable).where(eq(VideoTable.id, videoId));

        console.log(result)
        setVideoData(result[0])
    }

    return (
        <Dialog open={openDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={"text-3xl font-bold my-5 text-amber-700 flex flex-col items-center"}>Your video is ready!</DialogTitle>
                    <DialogDescription>
                        Preview your generated video below.
                    </DialogDescription>
                </DialogHeader>

                {/* MOVED THE PLAYER OUTSIDE OF THE HEADER & DESCRIPTION */}
                <div className="flex flex-col items-center mt-4"> 
                    <Player
                        component={RemotionVideo}
                        durationInFrames={durationInFrame}
                        compositionWidth={1080}
                        compositionHeight={1920}
                        fps={30}
                        controls={true}
                        style={{
                            width: '100%',
                            aspectRatio: '9/16',
                            maxHeight: '400px',
                            borderRadius: '0.5rem'
                        }}
                        inputProps={{
                            ...videoData,
                            setDurationInFrame: setDurationInFrame
                        }}
                    />
                    
                    {/* BUTTONS ADDED HERE AS SHOWN IN image_bd0254.jpg */}
                    <div className='flex gap-10 mt-10'>
                        {/* <Button variant="destructive" onClick={() => setOpenDialog(false)}>Cancel</Button> */}
                        <Button variant="destructive" onClick={() => router.replace('/dashboard')}>Cancel</Button>
                        <Button>Export</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PlayerDialog