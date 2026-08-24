import { db } from '@/configs/db';
import { VideoTable } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { storage } from '@/configs/FirebaseConfig';
import { ref, deleteObject } from 'firebase/storage';

export async function DELETE(req) {
    try {
        const { videoId } = await req.json();

        if (!videoId) {
            return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
        }

        // 1. Fetch the video record FIRST to get the Firebase URLs
        const videoRecord = await db.select().from(VideoTable).where(eq(VideoTable.id, videoId));

        if (videoRecord.length === 0) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        const video = videoRecord[0];

        // 2. Delete the Audio File from Firebase
        if (video.audioFileUrl) {
            try {
                // ref() is smart enough to parse the direct download URL
                const audioRef = ref(storage, video.audioFileUrl);
                await deleteObject(audioRef);
                console.log("Audio deleted from Firebase");
            } catch (firebaseErr) {
                console.error("Failed to delete audio from Firebase:", firebaseErr);
            }
        }

        // 3. Delete all Images from Firebase
        if (video.imageList && video.imageList.length > 0) {
            for (const imageUrl of video.imageList) {
                try {
                    const imageRef = ref(storage, imageUrl);
                    await deleteObject(imageRef);
                } catch (firebaseErr) {
                    console.error("Failed to delete image from Firebase:", firebaseErr);
                }
            }
            console.log("Images deleted from Firebase");
        }

        // 4. Finally, delete the row from the database
        await db.delete(VideoTable).where(eq(VideoTable.id, videoId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting video:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}