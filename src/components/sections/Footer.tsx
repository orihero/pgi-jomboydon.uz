'use client';

import { useParams } from 'next/navigation';
import { Language } from '@/i18n/config';
import { FaInstagram, FaTelegram, FaYoutube, FaFacebook } from 'react-icons/fa';

interface FooterProps {
  address: {
    en: string;
    ru: string;
    uz: string;
  };
  phones: {
    id: string;
    number: string;
    department: {
      en: string;
      ru: string;
      uz: string;
    };
    description?: {
      en: string | null;
      ru: string | null;
      uz: string | null;
    };
  }[];
  socialLinks: {
    instagram?: string | null;
    telegram?: string | null;
    youtube?: string | null;
    facebook?: string | null;
  };
}

export default function Footer({ address, phones, socialLinks }: FooterProps) {
  const params = useParams();
  const lang = (params?.lang as Language) || 'en';

  const getLocalizedContent = (content: { 
    [key in Language]: string | null 
  } | undefined) => {
    if (!content) return '';
    return content[lang] || '';
  };

  return (
    <footer>
      {/* Questions Section */}
      <div className="bg-[#ffb331] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="space-y-2 mb-6 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl font-bold">
                {lang === 'uz' ? 'Savollar qoldimi?' : 
                 lang === 'ru' ? 'Остались вопросы?' : 
                 'Got questions?'}
              </h2>
              <p className="text-gray-800">
                {lang === 'uz' ? "Formani to'ldiring va bizga yuboring" : 
                 lang === 'ru' ? 'Заполните форму и отправьте нам' : 
                 'Fill out the form and send it to us'}
              </p>
            </div>
            <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-900 transition-colors">
              {lang === 'uz' ? 'Ariza qoldirish' : 
               lang === 'ru' ? 'Оставить заявку' : 
               'Submit request'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Menu */}
            <div>
              <h3 className="text-xl font-bold mb-6">
                {lang === 'uz' ? 'Menyu' : 
                 lang === 'ru' ? 'Меню' : 
                 'Menu'}
              </h3>
              <nav className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-gray-900">
                  {lang === 'uz' ? 'Kompaniya' : 
                   lang === 'ru' ? 'Компания' : 
                   'Company'}
                </a>
                <a href="#" className="block text-gray-600 hover:text-gray-900">
                  {lang === 'uz' ? 'Savdo' : 
                   lang === 'ru' ? 'Торговля' : 
                   'Trade'}
                </a>
                <a href="#" className="block text-gray-600 hover:text-gray-900">
                  {lang === 'uz' ? 'Ishlab chiqarish' : 
                   lang === 'ru' ? 'Производство' : 
                   'Production'}
                </a>
                <a href="#" className="block text-gray-600 hover:text-gray-900">
                  {lang === 'uz' ? 'Xarid' : 
                   lang === 'ru' ? 'Закупка' : 
                   'Purchase'}
                </a>
                <a href="#" className="block text-gray-600 hover:text-gray-900">
                  {lang === 'uz' ? 'Saqlash' : 
                   lang === 'ru' ? 'Хранение' : 
                   'Storage'}
                </a>
              </nav>
            </div>

            {/* Contacts */}
            <div>
              <h3 className="text-xl font-bold mb-6">
                {lang === 'uz' ? 'Kontaktlar' : 
                 lang === 'ru' ? 'Контакты' : 
                 'Contacts'}
              </h3>
              <div className="space-y-4">
                {phones.map(phone => (
                  <div key={phone.id}>
                    <div className="font-medium text-gray-900">
                      {getLocalizedContent(phone.department)}
                    </div>
                    <a href={`tel:${phone.number}`} className="text-gray-600 hover:text-gray-900">
                      {phone.number}
                    </a>
                    {phone.description && (
                      <div className="text-sm text-gray-500">
                        {getLocalizedContent(phone.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Address and Social */}
            <div>
              <h3 className="text-xl font-bold mb-6">
                {lang === 'uz' ? 'Manzil' : 
                 lang === 'ru' ? 'Адрес' : 
                 'Address'}
              </h3>
              <p className="text-gray-600 mb-6">
                {getLocalizedContent(address)}
              </p>
              <div className="flex space-x-4">
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-600 hover:text-gray-900">
                    <FaInstagram size={24} />
                  </a>
                )}
                {socialLinks.telegram && (
                  <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-600 hover:text-gray-900">
                    <FaTelegram size={24} />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-600 hover:text-gray-900">
                    <FaYoutube size={24} />
                  </a>
                )}
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-600 hover:text-gray-900">
                    <FaFacebook size={24} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 