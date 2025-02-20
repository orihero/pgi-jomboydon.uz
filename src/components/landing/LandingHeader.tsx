'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Language } from '@/i18n/config';

interface SiteSettings {
  logo: string;
  companyName: string;
}

const LANGUAGES = {
  uz: 'UZ',
  ru: 'RU',
  en: 'EN'
} as const;

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = (params?.lang as Language) || 'uz';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    fetchSiteSettings();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await fetch('/api/site-settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  const switchLanguage = (lang: Language) => {
    // Get the path after the current language code
    const pathWithoutLang = pathname.split('/').slice(2).join('/');
    const newPath = `/${lang}${pathWithoutLang ? `/${pathWithoutLang}` : ''}`;
    router.push(newPath);
    setIsLangMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#ffb331] backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href={`/${currentLang}`} className="flex items-center">
            {settings?.logo ? (
              <img
                src={settings.logo.startsWith('/') ? settings.logo : `/${settings.logo}`}
                alt={settings.companyName || 'Company Logo'}
                className="h-10 w-auto"
              />
            ) : (
              <span className="text-white text-2xl font-bold">Jomboy don</span>
            )}
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="#" className="text-white hover:text-gray-200">
              {currentLang === 'uz' ? 'Biz haqimizda' : 
               currentLang === 'ru' ? 'О нас' : 'About us'}
            </Link>
            <Link href="#" className="text-white hover:text-gray-200">
              {currentLang === 'uz' ? 'Mahsulotlar' : 
               currentLang === 'ru' ? 'Продукты' : 'Products'}
            </Link>
            <Link href="#" className="text-white hover:text-gray-200">
              {currentLang === 'uz' ? "Bo'limlar" : 
               currentLang === 'ru' ? 'Разделы' : 'Sections'}
            </Link>
            <Link href="#" className="text-white hover:text-gray-200">
              {currentLang === 'uz' ? 'Yangiliklar' : 
               currentLang === 'ru' ? 'Новости' : 'News'}
            </Link>
            <Link href="#" className="text-white hover:text-gray-200">
              {currentLang === 'uz' ? "Bog'lanish" : 
               currentLang === 'ru' ? 'Контакты' : 'Contact'}
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="text-white hover:text-gray-200 flex items-center"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              >
                {LANGUAGES[currentLang]}
                <svg 
                  className={`ml-1 h-4 w-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-2 py-2 w-24 bg-white rounded-lg shadow-xl">
                  {Object.entries(LANGUAGES).map(([lang, label]) => (
                    <button
                      key={lang}
                      onClick={() => switchLanguage(lang as Language)}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                        currentLang === lang ? 'text-orange-500 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="bg-[#ffb331] text-white px-4 py-2 rounded-full hover:bg-[#e6a12c] transition">
              {currentLang === 'uz' ? "Biz bilan bog'lanish" : 
               currentLang === 'ru' ? 'Связаться с нами' : 'Contact us'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 