import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Ensure we always return an array
    return NextResponse.json(products || []);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const image = formData.get('image') as File;

    let imageUrl: string | undefined;

    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      
      const filename = `${Date.now()}-${image.name}`;
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
      
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      await fs.writeFile(filepath, buffer);
      
      imageUrl = `/uploads/${filename}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        name_ru: name,
        name_uz: name,
        description: description || null,
        price,
        imageUrl,
        category: 'default',
        category_ru: 'default',
        category_uz: 'default'
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 