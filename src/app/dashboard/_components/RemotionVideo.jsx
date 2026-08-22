import { Audio } from '@remotion/media';
import React, { useEffect } from 'react'
import { AbsoluteFill, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion'

const RemotionVideo = ({ script, audioFileUrl, captions, imageList, setDurationInFrame }) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();

    // 1. Safely check if we have data FIRST
    const hasData = captions && captions.length > 0 && imageList && imageList.length > 0;

    // 2. Safely calculate totalFrames (fallback to 0 if data isn't ready)
    const totalFrames = hasData
        ? Math.round((captions[captions.length - 1]?.end / 1000) * fps)
        : 0;

    // 3. HOOK GOES BEFORE THE EARLY RETURN!
    useEffect(() => {
        // Only trigger the state update if we actually have data and the function exists
        if (hasData && setDurationInFrame) {
            setDurationInFrame(totalFrames);
        }
    }, [hasData, totalFrames, setDurationInFrame]);

    // Preload images into the browser cache so they appear instantly
    useEffect(() => {
        if (imageList && imageList.length > 0) {
            imageList.forEach((url) => {
                const img = new Image();
                img.src = url;
            });
        }
    }, [imageList]);

    // 4. GUARD CLAUSE (Early Return) MUST GO AFTER ALL HOOKS
    if (!hasData) {
        return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
    }

    // 5. Calculate exactly how many frames each image gets
    const framesPerImage = Math.round(totalFrames / imageList.length);



    const getCurrentCaption = () => {
        const currentTime = frame / 30 * 1000 //convert frame no to ms (for 30 fps video)
        const currentCaption = captions.find((word) => currentTime >= word.start && currentTime <= word.end)

        return currentCaption ? currentCaption?.text : ''
    }


    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {imageList.map((item, index) => {
                // Calculate the exact start frame for this image
                const startFrame = index * framesPerImage;

                // If this is the very last image, give it all the remaining frames so there are no black gaps
                const duration = index === imageList.length - 1
                    ? totalFrames - startFrame
                    : framesPerImage;

                const scale = (index) => interpolate(
                    frame,
                    [startFrame, startFrame + (duration / 2), (startFrame + duration)], //zoom in & out
                    (index % 2 == 0) ? [1, 1.2, 1.4] : [1.4, 1.2, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                )
                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={duration} // Fixed: applied your 'duration' variable here!
                    >
                        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Img
                                src={item}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: `scale(${scale(index)})`
                                }}
                            />
                            <AbsoluteFill style={{
                                color: 'white',
                                justifyContent: 'center',
                                textAlign: 'center',
                                top: undefined,
                                bottom: '30%',
                                height: 150,
                                width: '100%'
                            }}>
                                <h2 className='text-7xl'>{getCurrentCaption()}</h2>
                            </AbsoluteFill>
                        </AbsoluteFill>
                    </Sequence>
                )
            })}
            <Audio src={audioFileUrl} />
        </AbsoluteFill>
    )
}

export default RemotionVideo