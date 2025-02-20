import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    const settings = await prisma.heroSection.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching landing settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const updateData: any = {};
    
    // Check which section is being updated based on the fields present
    const isHeroSection = formData.has('title');
    const isMissionSection = formData.has('missionTitle');

    if (isHeroSection) {
      // Handle hero section fields
      ['title', 'titleRu', 'titleUz', 'subtitle', 'subtitleRu', 'subtitleUz', 'ctaText', 'ctaTextRu', 'ctaTextUz'].forEach(key => {
        updateData[key] = formData.get(key);
      });

      // Handle video upload
      const videoFile = formData.get('backgroundVideo') as File | null;
      if (videoFile && videoFile.size > 0) {
        const bytes = await videoFile.arrayBuffer();
        const buffer = new Uint8Array(bytes);
        
        const filename = `hero-${Date.now()}-${videoFile.name}`;
        const filepath = path.join(process.cwd(), 'public', 'videos', filename);
        
        await fs.mkdir(path.dirname(filepath), { recursive: true });
        await fs.writeFile(filepath, buffer);
        
        updateData.backgroundVideo = `/videos/${filename}`;
      } else if (formData.get('currentVideo')) {
        updateData.backgroundVideo = formData.get('currentVideo');
      }
    }

    if (isMissionSection) {
      // Handle mission section fields
      ['missionTitle', 'missionTitleRu', 'missionTitleUz', 'missionText', 'missionTextRu', 'missionTextUz'].forEach(key => {
        updateData[key] = formData.get(key);
      });

      // Handle mission image upload
      const imageFile = formData.get('missionImage') as File | null;
      if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = new Uint8Array(bytes);
        
        const filename = `mission-${Date.now()}-${imageFile.name}`;
        const filepath = path.join(process.cwd(), 'public', 'images', filename);
        
        await fs.mkdir(path.dirname(filepath), { recursive: true });
        await fs.writeFile(filepath, buffer);
        
        updateData.missionImage = `/images/${filename}`;
      } else if (formData.get('currentMissionImage')) {
        updateData.missionImage = formData.get('currentMissionImage');
      }
    }

    // Update only the relevant section
    const settings = await prisma.heroSection.upsert({
      where: { id: 1 },
      update: updateData,
      create: {
        ...updateData,
        // Add required fields that might not be in updateData
        title: updateData.title || '',
        titleRu: updateData.titleRu || '',
        titleUz: updateData.titleUz || '',
        subtitle: updateData.subtitle || '',
        subtitleRu: updateData.subtitleRu || '',
        subtitleUz: updateData.subtitleUz || '',
        ctaText: updateData.ctaText || '',
        ctaTextRu: updateData.ctaTextRu || '',
        ctaTextUz: updateData.ctaTextUz || '',
        missionTitle: updateData.missionTitle || '',
        missionTitleRu: updateData.missionTitleRu || '',
        missionTitleUz: updateData.missionTitleUz || '',
        missionText: updateData.missionText || '',
        missionTextRu: updateData.missionTextRu || '',
        missionTextUz: updateData.missionTextUz || '',
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating landing settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 