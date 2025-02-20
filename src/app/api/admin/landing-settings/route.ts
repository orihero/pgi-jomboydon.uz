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

    // Map form fields to database fields with correct casing
    const fieldMappings = {
      'heroTitle': 'title',
      'heroTitleRu': 'titleRu',
      'heroTitleUz': 'titleUz',
      'subtitle': 'subtitle',
      'subtitleRu': 'subtitleRu',
      'subtitleUz': 'subtitleUz',
      'ctaText': 'ctaText',
      'ctaTextRu': 'ctaTextRu',
      'ctaTextUz': 'ctaTextUz',
    };

    // Handle hero section fields with correct casing
    Object.entries(fieldMappings).forEach(([formKey, dbKey]) => {
      updateData[dbKey] = formData.get(formKey)?.toString() || '';
    });

    // Handle video upload
    const file = formData.get('file') as File | null;
    if (file && file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      
      const filename = `hero-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filepath = path.join(process.cwd(), 'public', 'videos', filename);
      
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      await fs.writeFile(filepath, buffer);
      
      updateData.backgroundVideo = `/videos/${filename}`;
    } else if (formData.get('currentVideo')) {
      const currentVideo = formData.get('currentVideo')?.toString();
      if (currentVideo) {
        updateData.backgroundVideo = currentVideo;
      }
    }

    // Update hero section
    const settings = await prisma.heroSection.upsert({
      where: { id: 1 },
      update: updateData,
      create: {
        id: 1,
        ...updateData,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating landing settings:', error);
    return NextResponse.json({ 
      error: 'Failed to update settings',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 