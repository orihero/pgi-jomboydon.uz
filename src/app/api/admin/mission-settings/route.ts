import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs/promises';

const uploadDir = path.join(process.cwd(), 'public/uploads');

async function uploadImage(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filename = `mission-${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
    
    await writeFile(filepath, new Uint8Array(buffer));
    
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

export async function GET() {
  try {
    const missionSection = await prisma.missionSection.findFirst();
    
    if (!missionSection) {
      return NextResponse.json({
        title: '',
        titleRu: '',
        titleUz: '',
        text: '',
        textRu: '',
        textUz: '',
        image: null,
      });
    }

    return NextResponse.json(missionSection);
  } catch (error) {
    console.error('Error fetching mission section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mission section' },
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
      'missionTitle': 'title',
      'missionTitleRu': 'titleRu',
      'missionTitleUz': 'titleUz',
      'missionText': 'text',
      'missionTextRu': 'textRu',
      'missionTextUz': 'textUz',
    };

    // Handle mission section fields with correct casing
    Object.entries(fieldMappings).forEach(([formKey, dbKey]) => {
      updateData[dbKey] = formData.get(formKey)?.toString() || '';
    });

    // Handle image upload
    const file = formData.get('missionImage') as File | null;
    if (file && file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      
      const filename = `mission-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filepath = path.join(process.cwd(), 'public', 'images', 'mission', filename);
      
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      await fs.writeFile(filepath, buffer);
      
      updateData.image = `/images/mission/${filename}`;
    } else if (formData.get('currentMissionImage')) {
      const currentImage = formData.get('currentMissionImage')?.toString();
      if (currentImage) {
        updateData.image = currentImage;
      }
    }

    // Update mission section
    const settings = await prisma.missionSection.upsert({
      where: { id: 1 },
      update: updateData,
      create: {
        id: 1,
        ...updateData,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating mission settings:', error);
    return NextResponse.json({ 
      error: 'Failed to update settings',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 