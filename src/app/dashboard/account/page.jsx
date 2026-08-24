'use client'
import React from 'react'
import { UserProfile } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const Account = () => {
    return (
        <div className='max-w-5xl mx-auto flex flex-col items-center justify-center pb-12'>
            {/* Header Section */}
            <div className='text-center mb-8 mt-2'>
                <h2 className='font-bold text-4xl text-white tracking-tight'>Account Settings</h2>
                <p className='text-neutral-400 mt-1 text-sm md:text-base'>
                    Manage your profile details, security preferences, and connected accounts.
                </p>
            </div>

            {/* Embedded Clerk User Profile */}
            <div className='w-full flex justify-center'>
                <UserProfile 
                    routing="hash"
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            rootBox: "w-full max-w-4xl flex justify-center",
                            card: "!bg-[#121212]/80 !backdrop-blur-xl !border !border-neutral-800 !shadow-[0_0_50px_rgba(0,0,0,0.6)] !rounded-[24px] !p-6 md:!p-8 w-full",
                            navbar: "!border-r !border-neutral-800/80 !pr-4",
                            navbarButton: "text-neutral-400 hover:text-white hover:bg-neutral-800/60 rounded-xl transition-all duration-200 text-sm font-medium",
                            navbarButtonActive: "!text-[#ec0f6b] !bg-[#ec0f6b]/10 !border !border-[#ec0f6b]/20 rounded-xl font-semibold",
                            headerTitle: "!text-white font-bold text-xl",
                            headerSubtitle: "text-neutral-400 text-sm",
                            profileSectionTitleText: "!text-white font-semibold text-base",
                            profileSectionContent: "!text-neutral-300",
                            formButtonPrimary: "!bg-[#ec0f6b] hover:!bg-[#d00d5e] !text-white !font-semibold !rounded-xl !shadow-[0_0_20px_rgba(236,15,107,0.3)] !transition-all !border-0",
                            formButtonReset: "!bg-neutral-800 hover:!bg-neutral-700 !text-white !rounded-xl !transition-all",
                            formFieldInput: "!bg-[#1a1a1f] !border !border-neutral-800 focus:!border-[#ec0f6b]/50 !text-white !rounded-xl",
                            badge: "!bg-[#ec0f6b]/15 !text-[#ec0f6b] !border !border-[#ec0f6b]/30",
                            avatarImageActionsUpload: "!bg-[#ec0f6b] hover:!bg-[#d00d5e] !text-white",
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default Account