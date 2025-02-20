'use client';

import { useParams } from 'next/navigation';

interface Stat {
  id: string;
  label: string;
  labelRu: string;
  labelUz: string;
  value: string;
}

interface StatsProps {
  data: Stat[];
}

export default function Stats({ data }: StatsProps) {
  const { lang } = useParams();

  const getLocalizedLabel = (stat: Stat) => {
    switch (lang) {
      case 'ru':
        return stat.labelRu;
      case 'uz':
        return stat.labelUz;
      default:
        return stat.label;
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {data.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-3xl font-bold text-[#8B1D1D] mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {getLocalizedLabel(stat)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 