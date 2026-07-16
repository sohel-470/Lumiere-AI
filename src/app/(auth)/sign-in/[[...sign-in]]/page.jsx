import { SignIn } from '@clerk/nextjs';
            
            export default function SignInPage() {
              return (
                <div className="relative flex flex-col h-screen font-sans overflow-hidden bg-slate-50 selection:bg-teal-400 selection:text-white">
                  
                  {/* 1. Aurora Glows (Soft, massive blur gradients) */}
                  <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-teal-300/30 rounded-full mix-blend-multiply blur-[120px] pointer-events-none animate-pulse duration-10000"></div>
                  <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-rose-300/30 rounded-full mix-blend-multiply blur-[120px] pointer-events-none"></div>
                  <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-sky-300/20 rounded-full mix-blend-multiply blur-[120px] pointer-events-none"></div>
            
                  {/* Top Navigation */}
                  <header className="absolute top-0 left-0 w-full p-8 z-30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-11 h-11 font-black text-white rounded-xl bg-gradient-to-br from-teal-400 to-sky-500 shadow-lg shadow-teal-500/20">
                        VS
                      </div>
                      <span className="text-2xl font-extrabold tracking-tight text-slate-800">
                        VidSynapse AI
                      </span>
                    </div>
                  </header>
            
                  {/* Main Content */}
                  <main className="flex items-center justify-center flex-1 w-full max-w-[1400px] mx-auto px-6 pt-24 pb-8 gap-12 lg:gap-24 z-10 relative">
                    
                    {/* LEFT COLUMN: Hero Copy & Feature Image */}
                    <div className="hidden flex-col justify-center w-1/2 lg:flex">
                      <h1 className="mb-4 text-5xl font-black tracking-tighter text-slate-900 xl:text-[4rem] leading-[1.05]">
                        Unlock Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-500">
                          Creative Flow.
                        </span>
                      </h1>
                      <p className="mb-8 text-xl font-medium text-slate-500">
                        Step into the next generation of video AI.
                      </p>
                      
                      {/* Image Container with Soft Frosted Border */}
                      <div className="relative w-full max-w-lg max-h-[45vh] aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-[8px] border-green-200/60 bg-red-400/40 backdrop-blur-xl group">
                        <img
                          src="/a.png"
                          alt="Creative AI Flow"
                          className="relative z-10 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </div>
            
                    {/* RIGHT COLUMN: Auth Card */}
                    <div className="relative z-20 flex justify-center w-full max-w-[440px] lg:w-1/2">
                      <SignIn
                        layout={{
                          socialButtonsPlacement: 'bottom',
                          socialButtonsVariant: 'blockButton',
                        }}
                        appearance={{
                          elements: {
                            rootBox: "w-full",
                            card: '!bg-pink-100/70 backdrop-blur-2xl !shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] !border-[1px] !border-white !rounded-[6.5rem] !p-8 xl:!p-10 w-full',
                            headerTitle: '!text-3xl !font-extrabold !text-slate-800 !text-center !mb-2',
                            headerSubtitle: '!hidden',
                            formFieldLabel: '!text-slate-600 !font-bold !mb-2 !text-sm',
                            formFieldInput: '!bg-white/80 !border-2 !border-slate-100 hover:!border-slate-200 focus:!bg-white focus:!border-teal-400 focus:!ring-4 focus:!ring-teal-400/10 !rounded-xl !py-3.5 !px-4 !font-medium !text-slate-800 !transition-all !duration-300',
                            formButtonPrimary: '!bg-gradient-to-r !from-green-400 !to-sky-500 hover:!opacity-90 !text-white !font-bold !shadow-xl !shadow-teal-500/25 !transition-all !rounded-full !py-4 !text-lg !mt-4 !border-0',
                            dividerLine: '!bg-slate-200',
                            dividerText: '!text-slate-400 !font-semibold !text-xs !uppercase !tracking-wider',
                            dividerRow: '!my-0',
                            socialButtonsBlockButton: '!bg-white/80 hover:!bg-white !text-slate-700 !border-[1px] !border-slate-200 !shadow-sm hover:!shadow-md !transition-all !rounded-2xl !py-3.5',
                            socialButtonsBlockButtonText: '!font-bold !text-slate-700 !text-base',
                            footerActionText: '!text-slate-500 !font-medium',
                            footerActionLink: '!text-teal-500 hover:!text-teal-600 !font-bold !transition-colors',
                            logoBox: 'justify-center mb-4',
                          }
                        }}
                      />
                    </div>
                  </main>
                </div>
              );
            }