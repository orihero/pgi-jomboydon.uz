'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Phone {
  id?: string;
  number: string;
  department: string;
  department_ru: string;
  department_uz: string;
  description?: string;
  description_ru?: string;
  description_uz?: string;
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState({
    companyName: '',
    logo: null as File | null,
    currentLogo: null as string | null,
  });

  const [footerSettings, setFooterSettings] = useState({
    address: '',
    address_ru: '',
    address_uz: '',
    instagram: '',
    telegram: '',
    youtube: '',
    facebook: '',
    phones: [] as Phone[],
  });

  const [loading, setLoading] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/site-settings');
      const data = await response.json();
      setSettings({
        companyName: data.companyName,
        logo: null,
        currentLogo: data.logo,
      });
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('companyName', settings.companyName);
      if (settings.logo) {
        formData.append('logo', settings.logo);
      }

      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update settings');
      
      toast.success('Settings updated successfully');
      fetchSettings(); // Refresh the data
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhone = () => {
    setFooterSettings(prev => ({
      ...prev,
      phones: [...prev.phones, {
        number: '',
        department: '',
        department_ru: '',
        department_uz: '',
      }],
    }));
  };

  const handlePhoneChange = (index: number, field: keyof Phone, value: string) => {
    setFooterSettings(prev => ({
      ...prev,
      phones: prev.phones.map((phone, i) => 
        i === index ? { ...phone, [field]: value } : phone
      ),
    }));
  };

  const handleRemovePhone = (index: number) => {
    setFooterSettings(prev => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index),
    }));
  };

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFooterLoading(true);

    try {
      const response = await fetch('/api/site-settings/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerSettings),
      });

      if (!response.ok) throw new Error('Failed to update footer settings');
      
      toast.success('Footer settings updated successfully');
    } catch (error) {
      toast.error('Failed to update footer settings');
    } finally {
      setFooterLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Site Settings
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSettings(prev => ({ ...prev, logo: e.target.files?.[0] || null }))}
                  className="mt-1 block w-full"
                />
                {settings.currentLogo && (
                  <img
                    src={settings.currentLogo}
                    alt="Current logo"
                    className="mt-2 h-20 w-auto"
                  />
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Footer Settings
            </h2>

            <form onSubmit={handleFooterSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={footerSettings.address}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, address: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address (RU)</label>
                  <input
                    type="text"
                    value={footerSettings.address_ru}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, address_ru: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address (UZ)</label>
                  <input
                    type="text"
                    value={footerSettings.address_uz}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, address_uz: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['instagram', 'telegram', 'youtube', 'facebook'].map((social) => (
                  <div key={social}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {social}
                    </label>
                    <input
                      type="url"
                      value={footerSettings[social as keyof typeof footerSettings] as string}
                      onChange={(e) => setFooterSettings(prev => ({ ...prev, [social]: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      placeholder={`https://${social}.com/...`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Phone Numbers</h3>
                  <button
                    type="button"
                    onClick={handleAddPhone}
                    className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark"
                  >
                    Add Phone
                  </button>
                </div>

                <div className="space-y-4">
                  {footerSettings.phones.map((phone, index) => (
                    <div key={index} className="border p-4 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Number</label>
                          <input
                            type="text"
                            value={phone.number}
                            onChange={(e) => handlePhoneChange(index, 'number', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                          />
                        </div>
                        {['department', 'department_ru', 'department_uz'].map((field) => (
                          <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 capitalize">
                              {field.replace('_', ' ')}
                            </label>
                            <input
                              type="text"
                              value={phone[field as keyof Phone] as string}
                              onChange={(e) => handlePhoneChange(index, field as keyof Phone, e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePhone(index)}
                        className="mt-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={footerLoading}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                >
                  {footerLoading ? 'Saving...' : 'Save Footer Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 