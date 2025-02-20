'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BellIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-white hover:text-gray-200">Biz haqimizda</a>
            <a href="#" className="text-white hover:text-gray-200">Mahsulotlar</a>
            <a href="#" className="text-white hover:text-gray-200">Bo`limlar</a>
            <a href="#" className="text-white hover:text-gray-200">Yangiliklar</a>
            <a href="#" className="text-white hover:text-gray-200">Bog`lanish</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-gray-200">UZ</button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600">
              Biz bilan bog`lanish
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 