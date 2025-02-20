'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { languages, Language } from '@/i18n/config';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

interface LandingFormData {
  // Hero section fields
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
  // Mission section fields
  missionTitle: string;
  missionTitleRu: string;
  missionTitleUz: string;
  missionText: string;
  missionTextRu: string;
  missionTextUz: string;
  missionImage: File | null;
  currentMissionImage: string | null;
  // Add Stats fields
  stats: Array<{
    id: string;
    value: string;
    label: string;
    labelRu: string;
    labelUz: string;
  }>;
}

export default function LandingSettingsPage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<LandingFormData>({
    // Hero section fields
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
    // Mission section fields
    missionTitle: '',
    missionTitleRu: '',
    missionTitleUz: '',
    missionText: '',
    missionTextRu: '',
    missionTextUz: '',
    missionImage: null,
    currentMissionImage: null,
    // Add Stats fields
    stats: [],
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch hero and mission settings
      const settingsResponse = await fetch('/api/admin/landing-settings');
      const settingsData = await settingsResponse.json();

      // Fetch stats
      const statsResponse = await fetch('/api/stats');
      const statsData = await statsResponse.json();

      // Map stats to the format we need
      const formattedStats = statsData.map((stat: any) => ({
        id: stat.id,
        value: stat.value,
        label: stat.label,
        labelRu: stat.labelRu,
        labelUz: stat.labelUz,
      }));

      setFormData({
        ...settingsData,
        backgroundVideo: null,
        missionImage: null,
        currentVideo: settingsData.backgroundVideo,
        currentMissionImage: settingsData.missionImage,
        stats: formattedStats, // Add stats to form data
      });
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'backgroundVideo' | 'missionImage') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleAddStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [
        ...(prev.stats || []),
        {
          id: Date.now().toString(),
          value: '',
          label: '',
          labelRu: '',
          labelUz: '',
        }
      ]
    }));
  };

  const handleRemoveStat = (id: string) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter(stat => stat.id !== id)
    }));
  };

  const handleStatChange = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.map(stat => 
        stat.id === id ? { ...stat, [field]: value } : stat
      )
    }));
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append hero section fields
      ['title', 'titleRu', 'titleUz', 'subtitle', 'subtitleRu', 'subtitleUz', 'ctaText', 'ctaTextRu', 'ctaTextUz'].forEach(key => {
        formDataToSend.append(key, formData[key as keyof LandingFormData] as string);
      });

      if (formData.backgroundVideo) {
        formDataToSend.append('backgroundVideo', formData.backgroundVideo);
      }
      if (formData.currentVideo) {
        formDataToSend.append('currentVideo', formData.currentVideo);
      }

      const response = await fetch('/api/admin/landing-settings', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to update hero section');
      toast.success('Hero section updated successfully');
    } catch (error) {
      toast.error('Failed to update hero section');
    } finally {
      setLoading(false);
    }
  };

  const handleStatsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.stats),
      });

      if (!response.ok) throw new Error('Failed to update stats');
      toast.success('Stats updated successfully');
    } catch (error) {
      toast.error('Failed to update stats');
    } finally {
      setLoading(false);
    }
  };

  const handleMissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append mission section fields
      ['missionTitle', 'missionTitleRu', 'missionTitleUz', 'missionText', 'missionTextRu', 'missionTextUz'].forEach(key => {
        formDataToSend.append(key, formData[key as keyof LandingFormData] as string);
      });

      if (formData.missionImage) {
        formDataToSend.append('missionImage', formData.missionImage);
      }
      if (formData.currentMissionImage) {
        formDataToSend.append('currentMissionImage', formData.currentMissionImage);
      }

      const response = await fetch('/api/admin/landing-settings', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to update mission section');
      toast.success('Mission section updated successfully');
    } catch (error) {
      toast.error('Failed to update mission section');
    } finally {
      setLoading(false);
    }
  };

  const getFieldValue = (baseName: string): string => {
    const key = currentLang === 'en' 
      ? baseName 
      : `${baseName}${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`;
    return formData[key as keyof LandingFormData] as string || '';
  };

  const getFieldName = (baseName: string): string => {
    const key = currentLang === 'en' 
      ? baseName 
      : `${baseName}${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`;
    return key;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <main className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Hero Section */}
              <form onSubmit={handleHeroSubmit} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Hero Section
                  </h2>
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title ({languages[currentLang]})
                    </label>
                    <input
                      type="text"
                      name={getFieldName('title')}
                      value={getFieldValue('title')}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subtitle ({languages[currentLang]})
                    </label>
                    <textarea
                      name={getFieldName('subtitle')}
                      value={getFieldValue('subtitle')}
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
                      name={getFieldName('ctaText')}
                      value={getFieldValue('ctaText')}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Background Video
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, 'backgroundVideo')}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                      />
                    </div>
                    {formData.currentVideo && (
                      <div className="mt-2">
                        <video width="200" controls>
                          <source src={formData.currentVideo} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Hero Section'}
                  </button>
                </div>
              </form>

              {/* Stats Section */}
              <form onSubmit={handleStatsSubmit} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Stats Section
                  </h2>
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

                <div className="space-y-6">
                  {formData.stats?.map((stat, index) => (
                    <div key={stat.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Stat #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => handleRemoveStat(stat.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Value
                          </label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Label ({languages[currentLang]})
                          </label>
                          <input
                            type="text"
                            value={currentLang === 'en' ? stat.label : currentLang === 'ru' ? stat.labelRu : stat.labelUz}
                            onChange={(e) => handleStatChange(stat.id, `label${currentLang === 'en' ? '' : currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddStat}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary"
                  >
                    + Add New Stat
                  </button>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Stats'}
                  </button>
                </div>
              </form>

              {/* Mission Section */}
              <form onSubmit={handleMissionSubmit} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Mission Section
                  </h2>
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mission Title ({languages[currentLang]})
                    </label>
                    <input
                      type="text"
                      name={getFieldName('missionTitle')}
                      value={getFieldValue('missionTitle')}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mission Text ({languages[currentLang]})
                    </label>
                    <textarea
                      name={getFieldName('missionText')}
                      value={getFieldValue('missionText')}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mission Background Image
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'missionImage')}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                      />
                    </div>
                    {formData.currentMissionImage && (
                      <div className="mt-2">
                        <img
                          src={formData.currentMissionImage}
                          alt="Current mission background"
                          className="h-32 w-auto object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Mission Section'}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 