'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { languages, Language } from '@/i18n/config';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  nameRu: string;
  nameUz: string;
  description: string | null;
  descriptionRu: string | null;
  descriptionUz: string | null;
  price: number;
  imageUrl: string | null;
  category: string;
  categoryRu: string;
  categoryUz: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>('en');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    router.push('/admin/products/new');
  };

  const handleEditProduct = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(product => product.id !== id));
        toast.success('Product deleted successfully');
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <div className="flex-1 overflow-auto">
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Products</h1>
                <button
                  onClick={handleAddProduct}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                  Add Product
                </button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.imageUrl.startsWith('http') 
                                ? product.imageUrl 
                                : `/api/images${product.imageUrl.startsWith('/') ? product.imageUrl : `/${product.imageUrl}`}`}
                              alt={product.name}
                              className="h-10 w-10 object-cover rounded"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate">
                            {currentLang === 'ru' ? product.nameRu :
                              currentLang === 'uz' ? product.nameUz :
                                product.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate">
                            {currentLang === 'ru' ? product.categoryRu :
                              currentLang === 'uz' ? product.categoryUz :
                                product.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditProduct(product.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 