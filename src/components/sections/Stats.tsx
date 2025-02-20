'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Stat } from '@prisma/client';

interface StatsProps {
  data?: Array<{
    id: string;
    value: string;
    label: {
      en: string;
      ru: string;
      uz: string;
    };
  }>;
}

export default function Stats({ data }: StatsProps) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(!data);
  const params = useParams();
  const lang = params?.lang as string || 'en';

  useEffect(() => {
    if (data) {
      setStats(data.map(d => ({
        id: d.id,
        value: d.value,
        label: d.label.en,
        labelRu: d.label.ru,
        labelUz: d.label.uz,
      })));
      setLoading(false);
    } else {
      fetchStats();
    }
  }, [data]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">
                {lang === 'ru' ? stat.labelRu : lang === 'uz' ? stat.labelUz : stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 