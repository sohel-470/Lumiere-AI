'use client'
import React, { useContext, useState } from 'react'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { useUser } from '@clerk/nextjs'
import { Check, Zap, Gem } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

const Upgrade = () => {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const pricingOptions = [
        { id: 1, name: 'Starter', credits: 500, price: 99, desc: 'Ideal for trying out short videos.' },
        { id: 2, name: 'Creator', credits: 1500, price: 249, desc: 'Great for regular creators & stories.', isPopular: true },
        { id: 3, name: 'Studio', credits: 5000, price: 699, desc: 'Best value for extended series.' },
    ];

    const handlePayment = async (option) => {
        if (!user) {
            toast.error("Please sign in to purchase credits.");
            return;
        }

        setLoading(true);

        try {
            // 1. Create order on the server
            const { data: order } = await axios.post('/api/razorpay/create-order', {
                amount: option.price
            });

            if (!order?.id) {
                toast.error("Unable to initiate transaction. Please try again.");
                setLoading(false);
                return;
            }

            // 2. Configure Razorpay checkout options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Lumiere AI',
                description: `Purchase ${option.credits} Credits (${option.name} Pack)`,
                order_id: order.id,



                config: {
                    display: {
                        blocks: {
                            upi_collect: {
                                name: "Pay via UPI ID",
                                instruments: [
                                    {
                                        method: "upi",
                                        flows: ["collect"] // This strictly summons the text input box
                                    }
                                ]
                            }
                        },
                        sequence: ["block.upi_collect"], // Puts your custom block at the top
                        preferences: {
                            show_default_blocks: true // Keeps Cards, Netbanking, EMI, etc. visible below it
                        }
                    }
                },



                handler: async function (response) {
                    try {
                        // 3. Verify payment signature on the backend
                        const verificationRes = await axios.post('/api/razorpay/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            email: user?.primaryEmailAddress?.emailAddress,
                            creditsToAdd: option.credits
                        });

                        if (verificationRes.data.success) {
                            setUserDetail(prev => ({
                                ...prev,
                                credits: verificationRes.data.newCredits
                            }));
                            toast.success(`Success! ${option.credits} credits added.`);
                        }
                    } catch (err) {
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: {
                    name: user?.fullName || '',
                    email: user?.primaryEmailAddress?.emailAddress || '',
                },
                theme: {
                    color: '#ec0f6b',
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment initiation failed:", error);
            toast.error("Something went wrong while initiating checkout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-5xl mx-auto'>
            {/* Load Razorpay SDK */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <div className='text-center mb-12 mt-4'>
                <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ec0f6b]/10 border border-[#ec0f6b]/20 text-[#ec0f6b] text-sm font-medium mb-4'>
                    <Gem size={16} /> Current Balance: {userDetail?.credits || 0} Credits
                </div>
                <h2 className='text-4xl font-bold text-white mb-3'>Fuel Your Generations</h2>
                <p className='text-neutral-400 text-sm md:text-base'>Choose a credit pack to generate more AI video scenes without interruption.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {pricingOptions.map((option) => (
                    <div
                        key={option.id}
                        className={`relative p-8 rounded-[24px] bg-[#121212]/60 backdrop-blur-md border ${option.isPopular ? 'border-[#ec0f6b] shadow-[0_0_30px_rgba(236,15,107,0.15)]' : 'border-neutral-800'
                            } flex flex-col justify-between transition-all duration-300 hover:border-[#ec0f6b]/50`}
                    >
                        {option.isPopular && (
                            <span className='absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ec0f6b] text-white px-4 py-1 text-xs font-bold rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(236,15,107,0.5)]'>
                                <Zap size={13} /> POPULAR
                            </span>
                        )}

                        <div>
                            <h3 className='text-2xl font-bold text-white mb-2'>{option.name}</h3>
                            <p className='text-neutral-400 text-sm mb-6'>{option.desc}</p>

                            <div className='mb-6'>
                                <span className='text-4xl font-bold text-white'>₹{option.price}</span>
                                <span className='text-neutral-500 text-sm ml-2'>one-time</span>
                            </div>

                            <ul className='space-y-3 mb-8'>
                                <li className='flex items-center gap-3 text-sm text-neutral-300'>
                                    <div className='bg-[#ec0f6b]/20 p-1 rounded-full'>
                                        <Check className='text-[#ec0f6b]' size={14} />
                                    </div>
                                    <span className='font-semibold text-white'>{option.credits} Credits</span>
                                </li>
                                <li className='flex items-center gap-3 text-sm text-neutral-400'>
                                    <div className='bg-[#ec0f6b]/20 p-1 rounded-full'>
                                        <Check className='text-[#ec0f6b]' size={14} />
                                    </div>
                                    Up to {Math.floor(option.credits / 100)} Complete Videos
                                </li>
                            </ul>
                        </div>

                        <Button
                            onClick={() => handlePayment(option)}
                            disabled={loading}
                            className={`w-full py-6 rounded-full font-semibold transition-all cursor-pointer ${option.isPopular
                                ? 'bg-[#ec0f6b] hover:bg-[#d00d5e] text-white shadow-[0_0_20px_rgba(236,15,107,0.3)]'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                                }`}
                        >
                            {loading ? 'Processing...' : `Get ${option.name}`}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Upgrade;