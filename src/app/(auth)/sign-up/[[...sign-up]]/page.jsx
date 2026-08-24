import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Image from 'next/image';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="relative flex flex-col h-screen font-sans overflow-hidden bg-[#0a0a0a] selection:bg-[#ec0f6b] selection:text-white text-white">

      {/* 🚀 THE "I'M RETIRING" CSS OVERRIDES */}
      <style>{`
        /* GitHub Icon Fix - Works, keeping it */
        .cl-socialButtonsProviderIcon__github {
          filter: invert(1) brightness(100) !important;
        }
        
        /* 
           THE WATERMARK FIX: 
           Target the raw HTML href attribute. Clerk cannot strip this 
           unless they delete their own website link.
        */
        a[href*="clerk"] {
          filter: grayscale(1) invert(1) brightness(3) !important;
          opacity: 0.6 !important;
          transition: opacity 0.2s ease-in-out !important;
        }
        a[href*="clerk"]:hover {
          opacity: 1 !important;
        }
      `}</style>

      {/* Ambient Sci-Fi Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#ec0f6b]/10 rounded-full mix-blend-screen blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-[#ec0f6b]/5 rounded-full mix-blend-screen blur-[120px] pointer-events-none"></div>

      {/* Top Navigation */}
      <header className="absolute top-0 left-0 w-full z-50 flex items-center justify-between p-6 md:px-5 pt-5">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image src="/logo1.svg" width={200} height={57} alt="Lumiere AI Logo" className="md:w-[260px] md:h-[74px] object-contain" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center flex-1 w-full max-w-[1400px] mx-auto px-6 pt-24 pb-8 gap-12 lg:gap-24 z-10 relative">

        {/* LEFT COLUMN */}
        <div className="hidden flex-col justify-center w-1/2 lg:flex">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white xl:text-[4rem] leading-[1.1]">
            Unlock Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ec0f6b] to-[#ff7eb3]">
              Creative Flow.
            </span>
          </h1>
          <p className="mb-8 text-xl font-medium text-neutral-400">
            Step into the next generation of video AI.
          </p>

          <div className="relative w-full max-w-lg max-h-[45vh] aspect-[4/3] rounded-[24px] overflow-hidden shadow-[0_0_40px_rgba(236,15,107,0.15)] border border-neutral-800 bg-[#121212]/50 backdrop-blur-xl group">
            <img
              src="/a.webp"
              alt="Creative AI Flow"
              className="relative z-10 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-100"
            />
            {/* <div className="absolute inset-0 bg-black/20 z-20 pointer-events-none transition-opacity group-hover:opacity-0"></div> */}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="relative z-20 flex justify-center w-full max-w-[440px] lg:w-1/2">
          <SignUp
            layout={{
              socialButtonsPlacement: 'bottom',
              socialButtonsVariant: 'blockButton',
            }}
            appearance={{
              baseTheme: dark,
              elements: {
                rootBox: "w-full",
                card: '!bg-[#1c1c22] !shadow-2xl !border-0 !rounded-[24px] !p-8 xl:!p-10 w-full',
                headerTitle: '!text-xl !font-bold !text-white !text-center !mb-1',
                headerSubtitle: '!text-sm !text-neutral-400 !text-center',
                formFieldLabel: '!text-white !font-medium !mb-2 !text-sm',
                formFieldInput: '!bg-[#131316] !border !border-white/5 hover:!border-white/10 focus:!bg-[#131316] focus:!border-white/20 focus:!ring-1 focus:!ring-white/20 !rounded-xl !py-3.5 !px-4 !text-white placeholder:!text-neutral-500 !transition-all !duration-300',
                formButtonPrimary: '!bg-white hover:!bg-neutral-200 !text-black !font-semibold !shadow-none !transition-all !rounded-xl !py-3.5 !text-sm !mt-2 !border-0',
                dividerLine: '!bg-white/10',
                dividerText: '!text-neutral-500 !font-normal !text-xs !lowercase',
                dividerRow: '!my-4',
                socialButtonsBlockButton: '!bg-transparent hover:!bg-white/5 !text-white !border !border-white/10 !shadow-none !transition-all !rounded-xl !py-3.5',
                socialButtonsBlockButtonText: '!font-medium !text-white !text-sm',
                
                // Cleaned out the useless watermark overrides
                footerActionText: '!text-neutral-400 !font-medium',
                footerActionLink: '!text-white hover:!text-neutral-300 !font-semibold !transition-colors',
                logoBox: 'hidden',
                footer: '!bg-[#131316] !bg-none !border-t-0',
                footerAction: '!bg-transparent !bg-none',
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}