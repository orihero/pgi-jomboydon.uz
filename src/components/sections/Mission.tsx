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
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Background Image */}
          <div className="w-full h-[720px] relative">
            <Image
              src={image.startsWith('http') 
                ? image 
                : `/api/images${image.startsWith('/') ? image : `/${image}`}`}
              alt={getLocalizedContent(title)}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content Card */}
          <div className="absolute bottom-0 left-[7%] bg-white shadow-xl p-8 lg:p-12 max-w-xl h-[90%] overflow-y-auto">
            <h2 className="text-4xl font-bold mb-6">
              {getLocalizedContent(title)}
            </h2>
            <div className="prose prose-lg">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {getLocalizedContent(text)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 