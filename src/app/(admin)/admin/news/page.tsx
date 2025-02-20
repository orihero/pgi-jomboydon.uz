'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { format } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  title_ru: string;
  title_uz: string;
  content: string;
  content_ru: string;
  content_uz: string;
  imageUrl: string | null;
  createdAt: Date;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    title_ru: '',
    title_uz: '',
    content: '',
    content_ru: '',
    content_uz: '',
    image: null as File | null,
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch('/api/news', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to create news');
      
      toast.success('News created successfully');
      fetchNews();
      // Reset form
      setFormData({
        title: '',
        title_ru: '',
        title_uz: '',
        content: '',
        content_ru: '',
        content_uz: '',
        image: null,
      });
    } catch (error) {
      toast.error('Failed to create news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Create News Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Create News</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['', '_ru', '_uz'].map((lang) => (
                <div key={lang}>
                  <label className="block text-sm font-medium text-gray-700">
                    Title{lang}
                  </label>
                  <input
                    type="text"
                    value={formData[`title${lang}` as keyof typeof formData] as string}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [`title${lang}`]: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              ))}
            </div>

            {/* Content fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['', '_ru', '_uz'].map((lang) => (
                <div key={lang}>
                  <label className="block text-sm font-medium text-gray-700">
                    Content{lang}
                  </label>
                  <textarea
                    value={formData[`content${lang}` as keyof typeof formData] as string}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [`content${lang}`]: e.target.value
                    }))}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              ))}
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  image: e.target.files?.[0] || null
                }))}
                className="mt-1 block w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create News'}
            </button>
          </form>
        </div>

        {/* News List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">News List</h2>
            <div className="space-y-6">
              {news.map((item) => (
                <div key={item.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    {item.imageUrl && (
                      <div className="relative w-32 h-24 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(new Date(item.createdAt), 'dd MMM yyyy')}
                      </p>
                      <p className="text-gray-600 mt-2 line-clamp-2">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 