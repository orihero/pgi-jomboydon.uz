import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Site settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const logo = formData.get('logo') as File | null;

    const existingSettings = await prisma.siteSettings.findFirst();

    if (!existingSettings) {
      return NextResponse.json(
        { error: 'Site settings not found' },
        { status: 404 }
      );
    }

    const data: any = {};

    if (logo) {
      const bytes = await logo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `logo-${Date.now()}${path.extname(logo.name)}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      await mkdir(uploadDir, { recursive: true });
      
      // Delete old logo if exists
      if (existingSettings.logo) {
        const oldLogoPath = path.join(process.cwd(), 'public', existingSettings.logo);
        try {
          await unlink(oldLogoPath);
        } catch (err) {
          console.log('Error deleting old logo:', err);
        }
      }
      
      await writeFile(
        path.join(uploadDir, filename),
        new Uint8Array(buffer)
      );
      
      data.logo = `/uploads/${filename}`;
    }

    const settings = await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
} 