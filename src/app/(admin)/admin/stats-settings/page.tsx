'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Stat {
  id: string;
  label: string;
  labelRu: string;
  labelUz: string;
  value: string;
}

export default function StatsSettingsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stats }),
      });
      
      if (response.ok) {
        toast.success('Stats updated successfully');
      } else {
        throw new Error('Failed to update stats');
      }
    } catch (error) {
      console.error('Error updating stats:', error);
      toast.error('Failed to update stats');
    }
  };

  const handleStatChange = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Stats Settings</h1>
      <form onSubmit={handleSubmit}>
        {stats.map((stat, index) => (
          <div key={stat.id} className="mb-6 p-4 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Value</label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Label (English)</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Label (Russian)</label>
                <input
                  type="text"
                  value={stat.labelRu}
                  onChange={(e) => handleStatChange(index, 'labelRu', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Label (Uzbek)</label>
                <input
                  type="text"
                  value={stat.labelUz}
                  onChange={(e) => handleStatChange(index, 'labelUz', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
} 