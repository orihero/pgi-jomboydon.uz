'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { languages, Language } from '@/i18n/config';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

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
  currentImageUrl: string | null;
}

export default function ProductForm({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isEditing = params.id !== 'new';
  const [loading, setLoading] = useState(isEditing);
  const [currentLang, setCurrentLang] = useState<Language>('en');
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
    currentImageUrl: null,
  });

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [isEditing]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();
      setFormData({
        ...data,
        price: data.price.toString(),
        image: null,
        currentImageUrl: data.imageUrl,
      });
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      // Send all fields including translations
      formDataToSend.append('name', formData.name);
      formDataToSend.append('name_ru', formData.name_ru);
      formDataToSend.append('name_uz', formData.name_uz);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('description_ru', formData.description_ru || '');
      formDataToSend.append('description_uz', formData.description_uz || '');
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('category_ru', formData.category_ru);
      formDataToSend.append('category_uz', formData.category_uz);

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      if (formData.currentImageUrl) {
        formDataToSend.append('currentImageUrl', formData.currentImageUrl);
      }

      const response = await fetch(
        `/api/products${isEditing ? `/${params.id}` : ''}`,
        {
          method: isEditing ? 'PUT' : 'POST',
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error('Failed to save product');

      toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully`);
      router.push('/admin/products');
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

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

  if (loading) return <div>Loading...</div>;

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
                    {isEditing ? 'Edit Product' : 'Add New Product'}
                  </h1>
                  <div className="flex space-x-2">
                    {Object.entries(languages).map(([code, name]) => (
                      <button
                        key={code}
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description ({languages[currentLang]})
                    </label>
                    <textarea
                      name={getFieldName('description')}
                      value={getFieldValue('description')}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  {/* Category Field */}
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  {/* Price Field - Always visible regardless of language */}
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  {/* Image Upload Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Product Image
                    </label>
                    {formData.currentImageUrl && (
                      <div className="mt-2 mb-4">
                        <img
                          src={formData.currentImageUrl}
                          alt="Current product"
                          className="w-32 h-32 object-cover rounded"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                    />
                  </div>

                  {/* Submit and Cancel Buttons */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => router.push('/admin/products')}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600"
                    >
                      {isEditing ? 'Update Product' : 'Create Product'}
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