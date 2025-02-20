import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage } from '@/lib/uploadImage';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const title_ru = formData.get('title_ru') as string;
    const title_uz = formData.get('title_uz') as string;
    const content = formData.get('content') as string;
    const content_ru = formData.get('content_ru') as string;
    const content_uz = formData.get('content_uz') as string;
    const image = formData.get('image') as File | null;

    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage(image);
    }

    const news = await prisma.news.create({
      data: {
        title,
        title_ru,
        title_uz,
        content,
        content_ru,
        content_uz,
        imageUrl,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 