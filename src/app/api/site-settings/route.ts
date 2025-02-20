import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'public/uploads');

async function uploadFile(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const filename = `logo-${Date.now()}${path.extname(file.name)}`;
    const filepath = path.join(uploadDir, filename);
    
    // Write file - fixed Buffer type issue
    await writeFile(filepath, new Uint8Array(buffer));
    
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        logo: null,
        companyName: 'Jomboy don'
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.formData();
    const logo = data.get('logo') as File | null;
    const companyName = data.get('companyName') as string;

    let logoUrl = null;
    if (logo) {
      logoUrl = await uploadFile(logo);
    }

    const settings = await prisma.siteSettings.upsert({
      where: {
        id: 1,  // Changed from '1' to 1
      },
      update: {
        ...(logoUrl && { logo: logoUrl }),
        ...(companyName && { companyName }),
      },
      create: {
        logo: logoUrl,
        companyName: companyName || 'Jomboy don',
      },
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