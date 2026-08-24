import React, { useEffect, useState } from 'react'
import { Player } from "@remotion/player";
import { renderMediaOnWeb } from '@remotion/web-renderer'; // Import the web renderer
import { toast } from "sonner"; // Ensure toast is imported for notifications
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import RemotionVideo from './RemotionVideo';
import { Button } from "@/components/ui/button";
import { GetVideoDataAction } from '@/app/actions'


function PlayerDialog({ playVideo, videoId }) {
    const [openDialog, setOpenDialog] = useState(false)
    const [videoData, setVideoData] = useState()
    const [durationInFrame, setDurationInFrame] = useState(100)
    const [isExporting, setIsExporting] = useState(false) // Track export state

    useEffect(() => {
        if (playVideo) {
            setOpenDialog(true);
            videoId && GetVideoData();
        }
    }, [playVideo])


    const isHorizontal = videoData?.format === '16:9';
    const compWidth = isHorizontal ? 1920 : 1080;
    const compHeight = isHorizontal ? 1080 : 1920;
    const cssAspectRatio = isHorizontal ? '16/9' : '9/16';
    const maxWidthClass = isHorizontal ? 'max-w-[460px]' : 'max-w-[260px]'; // Make modal wider for horizontal


    const GetVideoData = async () => {
        const result = await GetVideoDataAction(videoId);
        setVideoData(result)
    }

    const exportVideo = async () => {
        try {
            setIsExporting(true);
            toast.info("Rendering video directly in your browser. Please do not close the tab.");

            // Initiate client-side render using WebCodecs
            const { getBlob } = await renderMediaOnWeb({
                composition: {
                    component: RemotionVideo,
                    durationInFrames: durationInFrame,
                    fps: 30,
                    width: compWidth,   // <-- DYNAMIC
                    height: compHeight, // <-- DYNAMIC
                },
                inputProps: {
                    ...videoData,
                    setDurationInFrame: () => { } // Dummy function to satisfy prop requirements
                }
            });

            // Retrieve the MP4 blob and trigger download
            const blob = await getBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Lumiere-AI-${videoId}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success("Video exported successfully!");
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export video. Check the console for details.");
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="bg-[#121212] border border-neutral-800 text-white shadow-[0_0_50px_rgba(236,15,107,0.15)] sm:max-w-md rounded-[24px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold mt-4 mb-2 text-white flex flex-col items-center">
                        Your video is ready!
                    </DialogTitle>
                    <DialogDescription className="text-neutral-400 text-center text-sm">
                        Preview your generated video below.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center mt-4">
                    <div className="relative rounded-[16px] overflow-hidden border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.6)] w-full max-w-[260px] bg-black">
                        <Player
                            component={RemotionVideo}
                            durationInFrames={durationInFrame}
                            compositionWidth={compWidth}   // <-- DYNAMIC
                            compositionHeight={compHeight} // <-- DYNAMIC
                            fps={30}
                            controls={true}
                            style={{ width: '100%', aspectRatio: cssAspectRatio, borderRadius: '16px' }}
                            inputProps={{
                                ...videoData,
                                setDurationInFrame: setDurationInFrame
                            }}
                        />
                    </div>

                    <div className='flex gap-4 mt-8 mb-2 w-full justify-center'>
                        <Button
                            variant="ghost"
                            className="text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full px-8 transition-colors"
                            onClick={() => setOpenDialog(false)}
                        >
                            Cancel
                        </Button>

                        {/* Wire up the onClick and loading state to your existing button styling */}
                        <Button
                            onClick={exportVideo}
                            disabled={isExporting || !videoData}
                            className="bg-[#ec0f6b] hover:bg-[#d00d5e] text-white rounded-full px-10 shadow-[0_0_20px_rgba(236,15,107,0.4)] hover:shadow-[0_0_30px_rgba(236,15,107,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isExporting ? 'Rendering MP4...' : 'Export Video'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PlayerDialog