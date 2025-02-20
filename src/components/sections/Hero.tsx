'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

interface HeroProps {
  data: {
    title: string;
    titleRu: string;
    titleUz: string;
    subtitle: string;
    subtitleRu: string;
    subtitleUz: string;
    ctaText: string;
    ctaTextRu: string;
    ctaTextUz: string;
    backgroundVideo: string | null;
  };
}

export default function Hero({ data }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang } = useParams();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  const getLocalizedContent = (en: string, ru: string, uz: string) => {
    switch (lang) {
      case 'ru':
        return ru;
      case 'uz':
        return uz;
      default:
        return en;
    }
  };

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {data.backgroundVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={data.backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl font-bold mb-4">
            {getLocalizedContent(data.title, data.titleRu, data.titleUz)}
          </h1>
          <p className="text-xl mb-8">
            {getLocalizedContent(data.subtitle, data.subtitleRu, data.subtitleUz)}
          </p>
          <button className="bg-orange-500 px-6 py-3 rounded-md text-lg font-medium">
            {getLocalizedContent(data.ctaText, data.ctaTextRu, data.ctaTextUz)}
          </button>
        </div>
      </div>
    </section>
  );
} 