'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Language } from '@/i18n/config';

interface HeroProps {
  title: {
    en: string;
    ru: string;
    uz: string;
  };
  subtitle: {
    en: string;
    ru: string;
    uz: string;
  };
  ctaText: {
    en: string;
    ru: string;
    uz: string;
  };
  backgroundVideo: string | null;
}

export default function Hero({ title, subtitle, ctaText, backgroundVideo }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const params = useParams();
  const lang = (params?.lang as Language) || 'en';

  useEffect(() => {
    if (videoRef.current && backgroundVideo) {
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [backgroundVideo]);

  const getLocalizedContent = (content: { [key in Language]: string }) => {
    return content[lang];
  };

  return (
    <section className="relative h-screen">
      {backgroundVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-black/60 z-10" />
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center max-w-4xl">
          {getLocalizedContent(title)}
        </h1>
        <p className="text-lg md:text-xl mb-8 text-center max-w-2xl">
          {getLocalizedContent(subtitle)}
        </p>
        <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300">
          {getLocalizedContent(ctaText)}
        </button>
      </div>
    </section>
  );
} 