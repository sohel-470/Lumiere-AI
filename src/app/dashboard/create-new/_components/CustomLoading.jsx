import React from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sparkles } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const CustomLoading = ({ loading }) => {
    return (
        <AlertDialog open={loading}>
            <AlertDialogContent className="bg-[#121212]/90 backdrop-blur-xl border border-neutral-800 text-white max-w-md rounded-2xl p-8 shadow-[0_0_40px_rgba(236,15,107,0.15)] outline-none">
                
                <VisuallyHidden>
                    <AlertDialogTitle>Generating Video Progress</AlertDialogTitle>
                </VisuallyHidden>

                <div className="flex flex-col items-center justify-center my-4 gap-6 text-center">
                    
                    {/* Upgraded Dual-Ring Sci-Fi Loader */}
                    <div className="relative flex items-center justify-center w-20 h-20">
                        {/* Soft background aura */}
                        <div className="absolute w-28 h-28 bg-[#ec0f6b]/20 rounded-full blur-2xl animate-[pulse_3s_ease-in-out_infinite]" />
                        
                        {/* Outer Ring: Rotating Clockwise with a Faded Gradient Trail */}
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#ec0f6b] border-r-[#ec0f6b]/40 animate-[spin_1.5s_linear_infinite]" />
                        
                        {/* Inner Ring: Rotating Counter-Clockwise in white/pink accent */}
                        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-white/80 border-l-white/20 animate-[reverseSpin_2s_linear_infinite]" />
                        
                        {/* Center Breathing Sparkle Icon */}
                        <Sparkles className="absolute w-7 h-7 text-[#ec0f6b] animate-[breath_2s_ease-in-out_infinite]" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white tracking-wide">
                            Crafting Your Story...
                        </h2>
                        <p className="text-sm text-neutral-400">
                            Generating AI prompts & script. <br />
                            <span className="text-[#ec0f6b] font-medium">Please do not refresh or close the page.</span>
                        </p>
                    </div>

                    {/* Smooth sliding gradient bar */}
                    <div className="relative w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800 mt-2">
                        <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[#ec0f6b] to-transparent animate-[smoothSlide_2s_ease-in-out_infinite]" />
                    </div>

                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CustomLoading;