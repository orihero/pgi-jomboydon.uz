import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    
    const heroData = {
      title: formData.get('heroTitle')?.toString() || '',
      titleRu: formData.get('heroTitleRu')?.toString() || '',
      titleUz: formData.get('heroTitleUz')?.toString() || '',
      subtitle: formData.get('subtitle')?.toString() || '',
      subtitleRu: formData.get('subtitleRu')?.toString() || '',
      subtitleUz: formData.get('subtitleUz')?.toString() || '',
      ctaText: formData.get('ctaText')?.toString() || '',
      ctaTextRu: formData.get('ctaTextRu')?.toString() || '',
      ctaTextUz: formData.get('ctaTextUz')?.toString() || '',
      backgroundVideo: formData.get('backgroundVideo')?.toString() || null,
    };

    console.log('Hero data:', heroData);

    // Update only hero section
    await prisma.heroSection.upsert({
      where: { id: 1 },
      update: heroData,
      create: { id: 1, ...heroData },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating hero section:', error);
    return Response.json({ 
      error: 'Failed to update hero section',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 