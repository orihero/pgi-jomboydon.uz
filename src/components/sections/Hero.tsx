'use client';

import { useEffect, useRef } from 'react';
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
  const params = useParams();
  const lang = (params?.lang as Language) || 'en';

  useEffect(() => {
    if (videoRef.current && backgroundVideo) {
      console.log('Video path:', backgroundVideo);
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, [backgroundVideo]);

  const getLocalizedContent = (content: { [key in Language]: string }) => {
    return content[lang];
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {backgroundVideo && (
        <video
          ref={videoRef}
          id="hero-video"
          className="absolute w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          {getLocalizedContent(title)}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          {getLocalizedContent(subtitle)}
        </p>
        <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300">
          {getLocalizedContent(ctaText)}
        </button>
      </div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </section>
  );
} 