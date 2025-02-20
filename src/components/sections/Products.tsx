'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Language } from '@/i18n/config';

interface Product {
  id: number;
  name: string;
  name_ru: string;
  name_uz: string;
  description: string | null;
  description_ru: string | null;
  description_uz: string | null;
  price: number;
  imageUrl: string | null;
  category: string;
  category_ru: string;
  category_uz: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const lang = (params?.lang as Language) || 'en';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedName = (product: Product) => {
    switch (lang) {
      case 'ru':
        return product.name_ru;
      case 'uz':
        return product.name_uz;
      default:
        return product.name;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {lang === 'uz' ? 'Mahsulotlar' : lang === 'ru' ? 'Продукты' : 'Products'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {product.imageUrl ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={product.imageUrl}
                    alt={getLocalizedName(product)}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {getLocalizedName(product)}
                </h3>
                <p className="text-gray-600 font-medium">
                  ${product.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 