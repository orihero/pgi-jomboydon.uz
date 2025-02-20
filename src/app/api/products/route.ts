import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      
      const filename = `product-${Date.now()}-${imageFile.name}`;
      const filepath = path.join(process.cwd(), 'public', 'images', 'products', filename);
      
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      await fs.writeFile(filepath, buffer);
      
      imageUrl = `/images/products/${filename}`;
    }

    // Log the received form data for debugging
    console.log('Received form data:', Object.fromEntries(formData.entries()));

    const product = await prisma.product.create({
      data: {
        name: formData.get('name') as string,
        name_ru: formData.get('name_ru') as string || '', // Provide default empty string
        name_uz: formData.get('name_uz') as string || '', // Provide default empty string
        description: formData.get('description') as string || null,
        description_ru: formData.get('description_ru') as string || null,
        description_uz: formData.get('description_uz') as string || null,
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category') as string || '', // Provide default empty string
        category_ru: formData.get('category_ru') as string || '', // Provide default empty string
        category_uz: formData.get('category_uz') as string || '', // Provide default empty string
        imageUrl,
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