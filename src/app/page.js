'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";

// 1. FIXED: Moved static arrays OUTSIDE the component 
// This prevents them from being recreated on every render and causing an infinite loop.
const phrases = [
  "Turn ideas into visual stories...",
  "Generate 3D cartoon characters...",
  "Craft engaging web series...",
  "Produce short narrated videos..."
];

const marqueeImages = [
  "/marquee-1.jpg",
  "/marquee-4.avif",
  "/marquee-6.jpg",
  "/marquee-7.jpg",
  "/marquee-2.jpg",
  "/marquee-8.jpg",
  "/marquee-5.jpg",
  "/marquee-3.jpg",
];

export default function Home() {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    setIsMounted(true);
  }, []);

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

    // 2. FIXED: Removed 'phrases' from dependencies since it's now a static global variable
  }, [displayText, isDeleting, loopNum, typingSpeed]);

  if (!isMounted) {
    return <div className="h-[100dvh] bg-black"></div>; // Clean black screen while loading
  }

  return (
    // 3. FIXED: Using h-[100dvh] so the mobile address bar doesn't break the layout
    <div className="relative h-[100dvh] bg-black text-white overflow-hidden font-sans select-none">

      {/* --- BACKGROUND MARQUEE --- */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center">
        <Marquee speed={40} gradient={false} pauseOnHover={false} className="h-full">
          {marqueeImages.map((src, index) => (
            <div
              key={index}
              // 4. FIXED: Added 'shrink-0' so the mobile flex container doesn't squish the images
              className="relative h-[105dvh] w-[280px] md:w-[380px] shrink-0 mx-2 md:mx-4 overflow-hidden rounded-[24px] border border-white/5 shadow-2xl"
            >
              <Image
                src={src}
                alt={`Cinematic background ${index + 1}`}
                fill
                sizes="(max-width: 768px) 280px, 380px"
                className="object-cover"
                priority={index < 3}
                unoptimized
              />
            </div>
          ))}
        </Marquee>
      </div>

      {/* --- THE DARK OVERLAY --- */}
      <div className="absolute inset-0 bg-black/75 z-10 pointer-events-none backdrop-blur-[0px]"></div>

      {/* --- NAVIGATION --- */}
      <header className="absolute top-0 left-0 w-full z-50 flex items-center justify-between p-6 md:px-5 pt-5">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image src="/logo1.svg" width={200} height={57} alt="Lumiere AI Logo" className="md:w-[260px] md:h-[74px]" />
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <Button className="bg-[#ec0f6b] hover:bg-[#d00d5e] text-white rounded-full px-5 md:px-6 shadow-[0_0_20px_rgba(236,15,107,0.3)] transition-all cursor-pointer">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* --- HERO CONTENT --- */}
      <main className="relative z-20 flex flex-col items-center top-[30dvh] md:top-[20dvh] min-h-[80dvh] px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-5xl leading-tight">
          Create Stunning Movies & Episodes With <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ec0f6b] to-[#ff7eb3]">
            AI-Powered Storytelling
          </span>
        </h1>

        <p className="text-base md:text-xl text-neutral-300 mb-10 max-w-3xl leading-relaxed">
          Bring your stories to life with AI: craft web series, generate unique character visuals, produce short narrated videos, and access a suite of creative tools—all in one place.
        </p>

        {/* Call to Action Area */}
        <div className="flex items-center w-full max-w-2xl bg-[#121212]/80 backdrop-blur-xl border border-neutral-800/80 rounded-full p-1.5 md:p-2 pl-4 md:pl-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all">

          {/* Typing Interface */}
          <div className="flex-1 text-left text-white text-xs md:text-base whitespace-nowrap overflow-hidden">
            {displayText}
            <span className="inline-block w-[2px] h-4 md:h-5 ml-1 bg-[#f52f81] animate-pulse relative top-1"></span>
          </div>

          {/* Embedded Try Now Button */}
          <Link href="/dashboard" className="shrink-0 ml-2 md:ml-4">
            <Button className="bg-gradient-to-r from-[#ec0f6b] to-[#a3449c] hover:opacity-90 text-white text-xs md:text-sm font-semibold rounded-full px-5 py-4 md:px-8 md:py-6 shadow-[0_0_20px_rgba(236,15,107,0.3)] transition-transform border-0 cursor-pointer">
              Try Now &rarr;
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}