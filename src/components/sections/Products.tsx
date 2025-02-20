'use client';

import { useParams } from 'next/navigation';
import { Language } from '@/i18n/config';

interface Product {
  id: string;
  name: {
    en: string;
    ru: string;
    uz: string;
  };
  category: {
    en: string;
    ru: string;
    uz: string;
  };
  imageUrl: string | null;
}

interface ProductsProps {
  products: Product[];
}

export default function Products({ products }: ProductsProps) {
  const params = useParams();
  const lang = (params?.lang as Language) || 'en';

  const getLocalizedContent = (content: { [key in Language]: string }) => {
    return content[lang];
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {lang === 'uz' ? 'Mahsulotlar' : 
           lang === 'ru' ? 'Продукты' : 
           'Products'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="relative h-[400px] group overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl ? (
                    product.imageUrl.startsWith('http') 
                      ? product.imageUrl 
                      : `/api/images${product.imageUrl.startsWith('/') ? product.imageUrl : `/${product.imageUrl}`}`
                  ) : '/images/placeholder.jpg'}
                  alt={getLocalizedContent(product.name)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>

              {/* Category */}
              <div className="absolute top-6 left-6 text-white text-lg font-light">
                {getLocalizedContent(product.category)}
              </div>

              {/* Name */}
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-xl font-medium leading-tight">
                  {getLocalizedContent(product.name)}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 