'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";

export default function Home() {
  // 1. The Typewriter Phrases
  const phrases = [
    "Turn ideas into visual stories...",
    "Generate 3D cartoon characters...",
    "Craft engaging web series...",
    "Produce short narrated videos..."
  ];

  // 2. Your Background Images (Drop 5-6 vertical images into your public folder)
  const marqueeImages = [
    "/marquee-1.jpg", 
    "/marquee-6.jpg",
    "/marquee-4.avif",
    "/marquee-3.jpg", 
    "/marquee-7.jpg",
    "/marquee-8.jpg",
    "/marquee-2.jpg",
  ];

  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Typewriter Engine
  useEffect(() => {
    let timer;
    const handleType = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setDisplayText(
        isDeleting
          ? fullText.substring(0, displayText.length - 1)
          : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 50);

      if (!isDeleting && displayText === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500); 
      } else {
        timer = setTimeout(handleType, typingSpeed);
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed, phrases]);

  return (
    <div className="relative h-screen bg-black text-white overflow-hidden font-sans select-none">
      
      {/* --- BACKGROUND MARQUEE --- */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center">
        {/* We use a slight angle (-rotate-2) for a more dynamic, cinematic look, or keep it straight by removing the rotate class */}
        <Marquee speed={40} gradient={false} pauseOnHover={false} className="h-full">
          {marqueeImages.map((src, index) => (
            <div 
              key={index} 
              className="relative h-[105vh] w-[280px] md:w-[380px] mx-2 md:mx-4 overflow-hidden rounded-[24px] border border-white/5 shadow-2xl"
            >
              <Image 
                src={src} 
                alt={`Cinematic background ${index + 1}`} 
                fill 
                className="object-cover"
                priority={index < 3} // Prioritize loading the first few images
              />
            </div>
          ))}
        </Marquee>
      </div>

      {/* --- THE DARK OVERLAY (From your DevTools screenshot) --- */}
      <div className="absolute inset-0 bg-black/75 z-10 pointer-events-none backdrop-blur-[0px]"></div>

      {/* --- AMBIENT GLOWS --- */}
      {/* <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#ec0f6b]/15 rounded-full blur-[150px] pointer-events-none z-10" /> */}
      {/* <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] bg-[#ec0f6b]/10 rounded-full blur-[150px] pointer-events-none z-10" /> */}

      {/* --- NAVIGATION --- */}
      <header className="absolute top-0 left-0 w-full z-50 flex items-center justify-between p-8 md:px-5 pt-5">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image src="/logo1.svg" width={260} height={74} alt="Lumiere AI Logo" />
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <Button className="bg-[#ec0f6b] hover:bg-[#d00d5e] text-white rounded-full px-6 shadow-[0_0_20px_rgba(236,15,107,0.3)] transition-all cursor-pointer">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* --- HERO CONTENT --- */}
      <main className="relative z-20 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-5xl leading-tight">
          Create Stunning Movies & Episodes With <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ec0f6b] to-[#ff7eb3]">
            AI-Powered Storytelling
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-3xl leading-relaxed">
          Bring your stories to life with AI: craft web series, generate unique character visuals, produce short narrated videos, and access a suite of creative tools — all in one place.
        </p>

        {/* Call to Action Area (Nested Input Style) */}
        <div className="flex items-center w-full max-w-2xl bg-[#121212]/80 backdrop-blur-xl border border-neutral-800/80 rounded-full p-2 pl-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all">
           
           {/* Typing Interface */}
           <div className="flex-1 text-left text-white text-sm md:text-base whitespace-nowrap overflow-hidden">
             {displayText}
             {/* Blinking Cursor */}
             <span className="inline-block w-[2px] h-5 ml-1 bg-[#f52f81] animate-pulse relative top-1"></span>
           </div>
           
           {/* Embedded Try Now Button */}
           <Link href="/dashboard" className="shrink-0 ml-4">
             <Button className="bg-gradient-to-r from-[#ec0f6b] to-[#a3449c] hover:opacity-90 text-white text-sm font-semibold rounded-full px-8 py-6 shadow-[0_0_20px_rgba(236,15,107,0.3)] transition-transform border-0 cursor-pointer">
               Try Now &rarr;
             </Button>
           </Link>
        </div>
      </main>
    </div>
  );
}