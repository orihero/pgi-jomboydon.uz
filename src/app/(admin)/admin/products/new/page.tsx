'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { languages, Language } from '@/i18n/config';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { toast } from 'react-hot-toast';

interface ProductFormData {
  name: string;
  name_ru: string;
  name_uz: string;
  description: string;
  description_ru: string;
  description_uz: string;
  price: string;
  category: string;
  category_ru: string;
  category_uz: string;
  image: File | null;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    name_ru: '',
    name_uz: '',
    description: '',
    description_ru: '',
    description_uz: '',
    price: '',
    category: '',
    category_ru: '',
    category_uz: '',
    image: null,
  });

  const getFieldName = (baseName: string): string => {
    switch (currentLang) {
      case 'ru':
        return `${baseName}_ru`;
      case 'uz':
        return `${baseName}_uz`;
      default:
        return baseName;
    }
  };

  const getFieldValue = (baseName: string): string => {
    const fieldName = getFieldName(baseName);
    return formData[fieldName as keyof ProductFormData] as string || '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      // Send all fields including translations
      formDataToSend.append('name', formData.name);
      formDataToSend.append('name_ru', formData.name_ru);
      formDataToSend.append('name_uz', formData.name_uz);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('description_ru', formData.description_ru || '');
      formDataToSend.append('description_uz', formData.description_uz || '');
      formDataToSend.append('category', formData.category);
      formDataToSend.append('category_ru', formData.category_ru);
      formDataToSend.append('category_uz', formData.category_uz);
      formDataToSend.append('price', formData.price);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('/api/products', { // Updated API endpoint
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      toast.success('Product created successfully');
      router.push('/admin/products');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create product';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <main className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Add New Product
                  </h1>
                  <div className="flex space-x-2">
                    {Object.entries(languages).map(([code, name]) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setCurrentLang(code as Language)}
                        className={`px-3 py-1 rounded ${
                          currentLang === code
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name ({languages[currentLang]})
                    </label>
                    <input
                      type="text"
                      name={getFieldName('name')}
                      value={getFieldValue('name')}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description ({languages[currentLang]})
                    </label>
                    <textarea
                      name={getFieldName('description')}
                      value={getFieldValue('description')}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category ({languages[currentLang]})
                    </label>
                    <input
                      type="text"
                      name={getFieldName('category')}
                      value={getFieldValue('category')}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="image" 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Product Image
                    </label>
                    <div className="mt-1 flex items-center">
                      {imagePreview ? (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, image: null }));
                            }}
                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-lg"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg">
                          <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                          <label
                            htmlFor="image"
                            className="cursor-pointer text-sm text-gray-600 text-center"
                          >
                            <span>Upload image</span>
                            <br />
                            <span className="text-xs">PNG, JPG up to 5MB</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark"
                    >
                      {loading ? 'Creating...' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 