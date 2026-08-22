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
        if (playVideo) {
            setOpenDialog(true);
            videoId && GetVideoData();
        }
    }, [playVideo])

    const GetVideoData = async () => {
        const result = await db.select().from(VideoTable).where(eq(VideoTable.id, videoId));

        console.log(result)
        setVideoData(result[0])
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="bg-[#121212] border border-neutral-800 text-white shadow-[0_0_50px_rgba(236,15,107,0.15)] sm:max-w-md rounded-[24px]">
                <DialogHeader>
                    {/* Swapped amber for crisp white, adjusted spacing */}
                    <DialogTitle className="text-3xl font-bold mt-4 mb-2 text-white flex flex-col items-center">
                        Your video is ready!
                    </DialogTitle>
                    <DialogDescription className="text-neutral-400 text-center text-sm">
                        Preview your generated video below.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center mt-4">
                    {/* Added a sleek, dark frame and shadow to the player */}
                    <div className="relative rounded-[16px] overflow-hidden border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.6)] w-full max-w-[260px] bg-black">
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
                                borderRadius: '16px' // Matches the wrapper
                            }}
                            inputProps={{
                                ...videoData,
                                setDurationInFrame: setDurationInFrame
                            }}
                        />
                    </div>

                    {/* Upgraded the buttons to premium, rounded styles */}
                    <div className='flex gap-4 mt-8 mb-2 w-full justify-center'>
                        <Button
                            variant="ghost"
                            className="text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full px-8 transition-colors"
                            onClick={() => setOpenDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#ec0f6b] hover:bg-[#d00d5e] text-white rounded-full px-10 shadow-[0_0_20px_rgba(236,15,107,0.4)] hover:shadow-[0_0_30px_rgba(236,15,107,0.6)] transition-all"
                        >
                            Export Video
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PlayerDialog