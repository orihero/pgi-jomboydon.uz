import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const heroSettings = await prisma.heroSection.findFirst();

    if (!heroSettings) {
      return NextResponse.json(
        { error: 'Hero settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(heroSettings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch hero settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const backgroundVideo = formData.get('backgroundVideo') as File | null;

    let backgroundVideoUrl = null;
    if (backgroundVideo && backgroundVideo.size > 0) {
      const bytes = await backgroundVideo.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      
      const filename = `hero-${Date.now()}-${backgroundVideo.name}`;
      const filepath = path.join(process.cwd(), 'public', 'videos', filename);
      
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      await fs.writeFile(filepath, buffer);
      
      backgroundVideoUrl = `/videos/${filename}`;
    }

    // Update hero section
    const updatedHero = await prisma.heroSection.update({
      where: { id: 1 },
      data: {
        title,
        titleRu: formData.get('titleRu') as string,
        titleUz: formData.get('titleUz') as string,
        subtitle: formData.get('subtitle') as string,
        subtitleRu: formData.get('subtitleRu') as string,
        subtitleUz: formData.get('subtitleUz') as string,
        ctaText: formData.get('ctaText') as string,
        ctaTextRu: formData.get('ctaTextRu') as string,
        ctaTextUz: formData.get('ctaTextUz') as string,
        backgroundVideo: backgroundVideoUrl,
      },
    });

    return NextResponse.json(updatedHero);
  } catch (error) {
    console.error('Error updating hero:', error);
    return NextResponse.json(
      { error: 'Failed to update hero section' },
      { status: 500 }
    );
  }
} 