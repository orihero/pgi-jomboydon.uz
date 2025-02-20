import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { compressVideo } from '@/lib/video';

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
    const backgroundVideo = formData.get('backgroundVideo') as File | null;

    // Get existing hero section
    const existingHero = await prisma.heroSection.findFirst();

    if (!existingHero) {
      return NextResponse.json(
        { error: 'Hero section not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const data: any = {
      title: formData.get('title'),
      titleRu: formData.get('titleRu'),
      titleUz: formData.get('titleUz'),
      subtitle: formData.get('subtitle'),
      subtitleRu: formData.get('subtitleRu'),
      subtitleUz: formData.get('subtitleUz'),
      ctaText: formData.get('ctaText'),
      ctaTextRu: formData.get('ctaTextRu'),
      ctaTextUz: formData.get('ctaTextUz'),
    };

    // Handle video upload and compression
    if (backgroundVideo) {
      const bytes = await backgroundVideo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filenames
      const tempFilename = `temp-${Date.now()}.mp4`;
      const finalFilename = `hero-${Date.now()}.mp4`;
      const uploadDir = path.join(process.cwd(), 'public/uploads/videos');
      
      // Ensure upload directory exists
      await mkdir(uploadDir, { recursive: true });
      
      // Save the original file temporarily
      const tempPath = path.join(uploadDir, tempFilename);
      const finalPath = path.join(uploadDir, finalFilename);
      
      await writeFile(tempPath, new Uint8Array(buffer));

      try {
        // Compress the video
        await compressVideo(tempPath, finalPath);
        
        // Delete the temporary file
        await unlink(tempPath);
        
        // Update the database with the compressed video path
        data.backgroundVideo = `/uploads/videos/${finalFilename}`;

        // Delete old video if exists
        if (existingHero.backgroundVideo) {
          const oldVideoPath = path.join(process.cwd(), 'public', existingHero.backgroundVideo);
          try {
            await unlink(oldVideoPath);
          } catch (err) {
            // Ignore error if file doesn't exist
            console.log('Error deleting old video:', err);
          }
        }
      } catch (error) {
        // Clean up temp file if compression fails
        try {
          await unlink(tempPath);
        } catch (err) {
          console.log('Error deleting temp file:', err);
        }
        throw new Error('Video compression failed');
      }
    }

    // Update existing hero section
    const heroSection = await prisma.heroSection.update({
      where: { id: existingHero.id },
      data,
    });

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error('Error updating hero settings:', error);
    return NextResponse.json(
      { error: 'Failed to update hero settings' },
      { status: 500 }
    );
  }
} 