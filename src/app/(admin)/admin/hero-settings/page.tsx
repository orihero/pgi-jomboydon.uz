'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { languages, Language } from '@/i18n/config';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

interface HeroFormData {
  title: string;
  titleRu: string;
  titleUz: string;
  subtitle: string;
  subtitleRu: string;
  subtitleUz: string;
  ctaText: string;
  ctaTextRu: string;
  ctaTextUz: string;
  backgroundVideo: File | null;
  currentVideo: string | null;
}

export default function HeroSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [formData, setFormData] = useState<HeroFormData>({
    title: '',
    titleRu: '',
    titleUz: '',
    subtitle: '',
    subtitleRu: '',
    subtitleUz: '',
    ctaText: '',
    ctaTextRu: '',
    ctaTextUz: '',
    backgroundVideo: null,
    currentVideo: null,
  });

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      const response = await fetch('/api/admin/hero-settings');
      const data = await response.json();
      
      setFormData({
        ...data,
        backgroundVideo: null,
        currentVideo: data.backgroundVideo,
      });
    } catch (error) {
      setError('Failed to fetch hero settings');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        backgroundVideo: file
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCurrentLangFields = () => {
    switch (currentLang) {
      case 'ru':
        return {
          title: formData.titleRu,
          subtitle: formData.subtitleRu,
          ctaText: formData.ctaTextRu,
        };
      case 'uz':
        return {
          title: formData.titleUz,
          subtitle: formData.subtitleUz,
          ctaText: formData.ctaTextUz,
        };
      default:
        return {
          title: formData.title,
          subtitle: formData.subtitle,
          ctaText: formData.ctaText,
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && key !== 'currentVideo') {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch('/api/admin/hero-settings', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to update hero settings');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const currentFields = getCurrentLangFields();

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
                    Hero Section Settings
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

                {error && (
                  <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title ({languages[currentLang]})
                    </label>
                    <input
                      type="text"
                      name={currentLang === 'en' ? 'title' : `title${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`}
                      value={currentFields.title}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subtitle ({languages[currentLang]})
                    </label>
                    <textarea
                      name={currentLang === 'en' ? 'subtitle' : `subtitle${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`}
                      value={currentFields.subtitle}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CTA Text ({languages[currentLang]})
                    </label>
                    <input
                      type="text"
                      name={currentLang === 'en' ? 'ctaText' : `ctaText${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`}
                      value={currentFields.ctaText}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  {/* Background Video (same for all languages) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Background Video
                    </label>
                    <div className="mt-2">
                      {formData.currentVideo && (
                        <div className="mb-4">
                          <video
                            src={formData.currentVideo}
                            className="w-full max-w-md rounded"
                            controls
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                      />
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
                      disabled={saving}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
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