'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getDictionary } from '@/i18n/get-dictionary';
import { Language, languages } from '@/i18n/config';
import { Dictionary } from '@/i18n/dictionaries/types';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const { lang } = useParams();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    fetchLogo();
    loadDictionary();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lang]);

  const loadDictionary = async () => {
    if (lang) {
      const dict = await getDictionary(lang as Language);
      setDictionary(dict);
    }
  };

  const fetchLogo = async () => {
    try {
      const response = await fetch('/api/site-settings');
      const data = await response.json();
      setLogo(data.logo);
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  if (!dictionary) {
    return null; // or loading state
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center">
            {logo ? (
              <Image
                src={logo}
                alt="Company Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            ) : (
              <span className={`text-xl font-bold ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}>
                PGI Jomboydon
              </span>
            )}
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href={`/${lang}/about`}
              className={`${
                scrolled ? 'text-gray-700' : 'text-white'
              } hover:text-primary transition-colors`}
            >
              {dictionary.navigation.company}
            </Link>
            <Link
              href={`/${lang}/products`}
              className={`${
                scrolled ? 'text-gray-700' : 'text-white'
              } hover:text-primary transition-colors`}
            >
              {dictionary.navigation.trade}
            </Link>
            <Link
              href={`/${lang}/production`}
              className={`${
                scrolled ? 'text-gray-700' : 'text-white'
              } hover:text-primary transition-colors`}
            >
              {dictionary.navigation.production}
            </Link>
            <Link
              href={`/${lang}/purchase`}
              className={`${
                scrolled ? 'text-gray-700' : 'text-white'
              } hover:text-primary transition-colors`}
            >
              {dictionary.navigation.purchase}
            </Link>
            <Link
              href={`/${lang}/contacts`}
              className={`${
                scrolled ? 'text-gray-700' : 'text-white'
              } hover:text-primary transition-colors`}
            >
              {dictionary.navigation.contacts}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            {Object.entries(languages).map(([code, name]) => (
              <Link 
                key={code}
                href={`/${code}`}
                className={`text-sm ${
                  scrolled ? 'text-gray-700' : 'text-white'
                } hover:text-primary transition-colors`}
              >
                {code.toUpperCase()}
              </Link>
            ))}
            
            <button
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              {dictionary.navigation.writeUs}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 