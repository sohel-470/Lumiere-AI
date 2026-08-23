import { db } from '@/configs/db';
import { Users } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email, creditsToAdd } = await req.json();

        if (!email || !creditsToAdd) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Fetch the user's current credits from the DB
        const user = await db.select().from(Users).where(eq(Users.email, email));
        const currentCredits = user[0]?.credits || 0;

        // Update the user's total credits
        await db.update(Users)
            .set({ credits: currentCredits + creditsToAdd })
            .where(eq(Users.email, email));

        return NextResponse.json({ success: true, newCredits: currentCredits + creditsToAdd });
        
    } catch (error) {
        console.error("Error adding credits:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}