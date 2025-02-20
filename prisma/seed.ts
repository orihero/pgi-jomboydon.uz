import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const password = await hash('admin123', 12);
  
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password,
      name: 'Admin User',
    },
  });

  // Create or update the hero section
  const heroSection = await prisma.heroSection.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Our Production Facility',
      titleRu: 'Наше производственное предприятие',
      titleUz: 'Bizning Ishlab Chiqarish Zavodimiz',
      subtitle: 'Modern equipment and advanced technologies',
      subtitleRu: 'Современное оборудование и передовые технологии',
      subtitleUz: 'Zamonaviy uskunalar va ilg\'or texnologiyalar',
      ctaText: 'Learn More',
      ctaTextRu: 'Узнать больше',
      ctaTextUz: "Ko'proq ma'lumot",
    },
  });

  // Create or update the mission section
  const missionSection = await prisma.missionSection.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Our Mission',
      titleRu: 'Наша миссия',
      titleUz: 'Bizning vazifamiz',
      text: 'We strive to provide quality products',
      textRu: 'Мы стремимся предоставлять качественные продукты',
      textUz: 'Biz sifatli mahsulotlar taqdim etishga intilamiz',
    },
  });

  // Create or update site settings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      companyName: 'Jomboy don',
      logo: null,
    },
  });

  const initialStats = [
    {
      value: '~300T',
      label: 'Production Capacity',
      labelRu: 'Производственная мощность',
      labelUz: 'Ishlab chiqarish quvvati',
    },
    {
      value: '~6',
      label: 'Product Types',
      labelRu: 'Виды продукции',
      labelUz: 'Mahsulot turlari',
    },
    {
      value: '~6',
      label: 'Services',
      labelRu: 'Услуги',
      labelUz: 'Xizmatlar',
    },
    {
      value: '~2',
      label: 'Certificates',
      labelRu: 'Сертификаты',
      labelUz: 'Sertifikatlar',
    },
    {
      value: '~250',
      label: 'Partnership and Trade',
      labelRu: 'Партнерство и торговля',
      labelUz: 'Hamkorlik va Savdo',
    },
  ];

  for (const stat of initialStats) {
    await prisma.stat.create({
      data: stat,
    });
  }

  console.log({ admin, heroSection, missionSection });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 