import { db } from '@/configs/db';
import { Users } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            email,
            creditsToAdd
        } = await req.json();

        // 1. Verify payment signature using HMAC SHA256
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json({ error: 'Payment verification failed: Invalid Signature' }, { status: 400 });
        }

        // 2. Fetch current credits
        const user = await db.select().from(Users).where(eq(Users.email, email));
        const currentCredits = user[0]?.credits || 0;
        const updatedCredits = currentCredits + Number(creditsToAdd);

        // 3. Update credits in your database
        await db.update(Users)
            .set({ credits: updatedCredits })
            .where(eq(Users.email, email));

        return NextResponse.json({
            success: true,
            newCredits: updatedCredits
        });

    } catch (error) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}