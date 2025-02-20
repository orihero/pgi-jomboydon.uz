'use client';

import { useParams } from 'next/navigation';
import { Language } from '@/i18n/config';
import Image from 'next/image';
import { format } from 'date-fns';
import { ru, uz } from 'date-fns/locale';

interface NewsItem {
  id: string;
  title: {
    en: string;
    ru: string;
    uz: string;
  };
  content: {
    en: string;
    ru: string;
    uz: string;
  };
  imageUrl: string | null;
  createdAt: Date;
}

interface NewsProps {
  news: NewsItem[];
}

export default function News({ news }: NewsProps) {
  const params = useParams();
  const lang = (params?.lang as Language) || 'en';

  const getLocalizedContent = (content: { [key in Language]: string }) => {
    return content[lang];
  };

  const formatDate = (date: Date) => {
    const locales = {
      en: undefined,
      ru: ru,
      uz: uz,
    };
    
    return format(new Date(date), 'dd MMMM yyyy', { locale: locales[lang] });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {lang === 'uz' ? 'Yangiliklar' : 
           lang === 'ru' ? 'Новости' : 
           'News'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative h-48 mb-4 overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={getLocalizedContent(item.title)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              
              <div className="space-y-2">
                <time className="text-sm text-gray-500">
                  {formatDate(item.createdAt)}
                </time>
                
                <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                  {getLocalizedContent(item.title)}
                </h3>
                
                <p className="text-gray-600 line-clamp-2">
                  {getLocalizedContent(item.content)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 