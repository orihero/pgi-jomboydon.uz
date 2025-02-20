import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public/videos');

async function uploadVideo(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filename = `hero-${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
    
    await writeFile(filepath, new Uint8Array(buffer));
    
    return `/videos/${filename}`;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
}

export async function GET() {
  try {
    const heroSection = await prisma.heroSection.findFirst();
    
    if (!heroSection) {
      return NextResponse.json({
        title: '',
        titleRu: '',
        titleUz: '',
        subtitle: '',
        subtitleRu: '',
        subtitleUz: '',
        ctaText: '',
        ctaTextRu: '',
        ctaTextUz: '',
        backgroundVideo: null,
      });
    }

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero section' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.formData();
    const backgroundVideo = data.get('backgroundVideo') as File | null;

    let videoUrl = null;
    if (backgroundVideo) {
      videoUrl = await uploadVideo(backgroundVideo);
    }

    const heroSection = await prisma.heroSection.upsert({
      where: { id: 1 },
      update: {
        title: data.get('heroTitle') as string,
        titleRu: data.get('heroTitleRu') as string,
        titleUz: data.get('heroTitleUz') as string,
        subtitle: data.get('subtitle') as string,
        subtitleRu: data.get('subtitleRu') as string,
        subtitleUz: data.get('subtitleUz') as string,
        ctaText: data.get('ctaText') as string,
        ctaTextRu: data.get('ctaTextRu') as string,
        ctaTextUz: data.get('ctaTextUz') as string,
        ...(videoUrl && { backgroundVideo: videoUrl }),
      },
      create: {
        title: data.get('heroTitle') as string,
        titleRu: data.get('heroTitleRu') as string,
        titleUz: data.get('heroTitleUz') as string,
        subtitle: data.get('subtitle') as string,
        subtitleRu: data.get('subtitleRu') as string,
        subtitleUz: data.get('subtitleUz') as string,
        ctaText: data.get('ctaText') as string,
        ctaTextRu: data.get('ctaTextRu') as string,
        ctaTextUz: data.get('ctaTextUz') as string,
        backgroundVideo: videoUrl,
      },
    });

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error('Error updating hero section:', error);
    return NextResponse.json(
      { error: 'Failed to update hero section' },
      { status: 500 }
    );
  }
} 