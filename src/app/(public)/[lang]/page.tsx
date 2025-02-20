import { prisma } from '@/lib/prisma';
import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import Products from '@/components/sections/Products';

async function getHeroData() {
  const heroSettings = await prisma.heroSection.findFirst();

  if (!heroSettings) {
    // Return default hero settings instead of throwing error
    return {
      title: 'Our Production Facility',
      titleRu: 'Наше производственное предприятие',
      titleUz: 'Bizning Ishlab Chiqarish Zavodimiz',
      subtitle: 'Producing Quality Flour from Premium Grade Grains',
      subtitleRu: 'Производим качественную муку из зерна высшего сорта',
      subtitleUz: 'Yuqori Navli Donlardan Sifatli Un Ishlab Chiqaramiz',
      ctaText: 'Contact Us',
      ctaTextRu: 'Связаться с нами',
      ctaTextUz: "Biz bilan bog'laning",
      backgroundVideo: null,
    };
  }

  return heroSettings;
}

export default async function HomePage() {
  const heroData = await getHeroData();

  return (
    <main>
      <Hero data={heroData} />
      <Stats />
      <Products />
    </main>
  );
} 