'use server'

import { db } from '@/configs/db';
import { Users, VideoTable } from '@/configs/schema';
import { eq, desc } from 'drizzle-orm';

// 1. For app/provider.js
export async function checkAndCreateUser(email, name, imageUrl) {
    if (!email) return;
    const result = await db.select().from(Users).where(eq(Users.email, email));

    if (!result[0]) {
        await db.insert(Users).values({
            name: name,
            email: email,
            imageUrl: imageUrl
        });
    }
}

// 2. For app/dashboard/layout.jsx
export async function getUserDetailAction(email) {
    if (!email) return null;
    const result = await db.select().from(Users).where(eq(Users.email, email));
    return result[0];
}

// 3. For app/dashboard/page.jsx
export async function GetVideoListAction(email) {
    if (!email) return [];
    const result = await db.select().from(VideoTable).where(eq(VideoTable.createdBy, email)).orderBy(desc(VideoTable.id));
    return result;
}

// 4. For app/dashboard/community/page.jsx
export async function GetAllCommunityVideosAction() {
    const result = await db.select().from(VideoTable).orderBy(desc(VideoTable.id));
    return result;
}

// 5. For app/dashboard/_components/PlayerDialog.jsx
export async function GetVideoDataAction(videoId) {
    if (!videoId) return null;
    const result = await db.select().from(VideoTable).where(eq(VideoTable.id, videoId));
    return result[0];
}

// 6. For app/dashboard/create-new/page.jsx (Saving the video)
export async function saveVideoDataAction(videoData, email, aspectRatio) {
    const result = await db.insert(VideoTable).values({
        script: videoData.videoScript,
        audioFileUrl: videoData.audioFileUrl,
        captions: videoData.captions,
        imageList: videoData.imageList,
        createdBy: email,
        format: aspectRatio || '9:16'
    }).returning({ id: VideoTable.id });

    return result[0].id;
}

// 7. For app/dashboard/create-new/page.jsx (Updating credits)
export async function UpdateUserCreditsAction(email, currentCredits) {
    const newCredits = Math.max(0, currentCredits - 100);
    await db.update(Users)
        .set({ credits: newCredits })
        .where(eq(Users.email, email));

    return newCredits;
}