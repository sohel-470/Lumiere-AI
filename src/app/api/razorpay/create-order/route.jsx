import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
    try {
        const { amount } = await req.json(); // amount in INR

        const options = {
            amount: Math.round(Number(amount) * 100), // Razorpay accepts amounts in paise (₹1 = 100 paise)
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}