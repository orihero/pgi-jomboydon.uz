'use client';

import { useParams } from 'next/navigation';
import { Language } from '@/i18n/config';
import Image from 'next/image';

interface MissionProps {
  title: {
    en: string;
    ru: string;
    uz: string;
  };
  text: {
    en: string;
    ru: string;
    uz: string;
  };
  image: string | null;
}

export default function Mission({ title, text, image }: MissionProps) {
  const params = useParams();
  const lang = (params?.lang as Language) || 'en';

  const getLocalizedContent = (content: { [key in Language]: string }) => {
    return content[lang];
  };

  if (!image) return null;

  return (
    <section className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-white p-8 lg:p-16 flex items-center">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold mb-8">
              {getLocalizedContent(title)}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
              {getLocalizedContent(text)}
            </p>
          </div>
        </div>
        <div className="relative h-[400px] lg:h-auto min-h-[500px]">
          <Image
            src={image}
            alt={getLocalizedContent(title)}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
} 