import { Language } from '@/i18n/config';
import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import Mission from '@/components/sections/Mission';
import Products from '@/components/sections/Products';
import { prisma } from '@/lib/prisma';

export default async function Home({ params }: { params: { lang: Language } }) {
  const settings = await prisma.heroSection.findFirst();
  const stats = await prisma.stat.findMany();

  if (!settings) {
    return null;
  }

  const heroData = {
    title: {
      en: settings.title || '',
      ru: settings.titleRu || '',
      uz: settings.titleUz || '',
    },
    subtitle: {
      en: settings.subtitle || '',
      ru: settings.subtitleRu || '',
      uz: settings.subtitleUz || '',
    },
    ctaText: {
      en: settings.ctaText || '',
      ru: settings.ctaTextRu || '',
      uz: settings.ctaTextUz || '',
    },
    backgroundVideo: settings.backgroundVideo,
  };

  const statsData = stats.map(stat => ({
    id: stat.id,
    value: stat.value,
    label: {
      en: stat.label,
      ru: stat.labelRu,
      uz: stat.labelUz,
    }
  }));

  const missionData = {
    title: {
      en: settings.missionTitle || '',
      ru: settings.missionTitleRu || '',
      uz: settings.missionTitleUz || '',
    },
    text: {
      en: settings.missionText || '',
      ru: settings.missionTextRu || '',
      uz: settings.missionTextUz || '',
    },
    image: settings.missionImage,
  };

  return (
    <main>
      <Hero {...heroData} />
      <Stats data={statsData} />
      <Mission {...missionData} />
      <Products />
    </main>
  );
} 