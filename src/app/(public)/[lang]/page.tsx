import { Language } from '@/i18n/config';
import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import Mission from '@/components/sections/Mission';
import Products from '@/components/sections/Products';
import Footer from '@/components/sections/Footer';
import News from '@/components/sections/News';
import { prisma } from '@/lib/prisma';
import { type News as NewsType, type Prisma } from '@prisma/client';

export default async function Home({ params }: { params: { lang: Language } }) {
  const heroSettings = await prisma.heroSection.findFirst();
  const missionSettings = await prisma.missionSection.findFirst();
  const stats = await prisma.stat.findMany();
  const products = await prisma.product.findMany();
  const siteSettings = await prisma.siteSettings.findFirst({
    include: {
      phones: true,
    },
  });
  const news = await prisma.news.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc'
    }
  }) as NewsType[];

  if (!heroSettings || !missionSettings || !siteSettings) {
    return null;
  }

  const heroData = {
    title: {
      en: heroSettings.title || '',
      ru: heroSettings.titleRu || '',
      uz: heroSettings.titleUz || '',
    },
    subtitle: {
      en: heroSettings.subtitle || '',
      ru: heroSettings.subtitleRu || '',
      uz: heroSettings.subtitleUz || '',
    },
    ctaText: {
      en: heroSettings.ctaText || '',
      ru: heroSettings.ctaTextRu || '',
      uz: heroSettings.ctaTextUz || '',
    },
    backgroundVideo: heroSettings.backgroundVideo,
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
      en: missionSettings.title || '',
      ru: missionSettings.titleRu || '',
      uz: missionSettings.titleUz || '',
    },
    text: {
      en: missionSettings.text || '',
      ru: missionSettings.textRu || '',
      uz: missionSettings.textUz || '',
    },
    image: missionSettings.image,
  };

  const productsData = products.map(product => ({
    id: product.id.toString(),
    name: {
      en: product.name,
      ru: product.name_ru,
      uz: product.name_uz,
    },
    category: {
      en: product.category,
      ru: product.category_ru,
      uz: product.category_uz,
    },
    imageUrl: product.imageUrl,
  }));

  const footerData = {
    address: {
      en: siteSettings.address || '',
      ru: siteSettings.address_ru || '',
      uz: siteSettings.address_uz || '',
    },
    phones: siteSettings.phones.map(phone => ({
      id: phone.id.toString(),
      number: phone.number,
      department: {
        en: phone.department,
        ru: phone.department_ru,
        uz: phone.department_uz,
      },
      description: phone.description ? {
        en: phone.description,
        ru: phone.description_ru,
        uz: phone.description_uz,
      } : undefined,
    })),
    socialLinks: {
      instagram: siteSettings.instagram || undefined,
      telegram: siteSettings.telegram || undefined,
      youtube: siteSettings.youtube || undefined,
      facebook: siteSettings.facebook || undefined,
    },
  };

  const newsData = news.map((item: NewsType) => ({
    id: item.id.toString(),
    title: {
      en: item.title,
      ru: item.title_ru,
      uz: item.title_uz,
    },
    content: {
      en: item.content,
      ru: item.content_ru,
      uz: item.content_uz,
    },
    imageUrl: item.imageUrl,
    createdAt: item.createdAt,
  }));

  return (
    <main>
      <Hero {...heroData} />
      <Stats data={statsData} />
      <Products products={productsData} />
      <Mission {...missionData} />
      <News news={newsData} />
      <Footer {...footerData} />
    </main>
  );
} 