import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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
    const price = parseFloat(formData.get('price') as string);
    const image = formData.get('image') as File;

    let imageUrl = null;
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const filename = `${Date.now()}-${image.name}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      // Ensure upload directory exists
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // Directory might already exist, ignore error
      }
      
      // Save the file
      await writeFile(
        path.join(uploadDir, filename), 
        new Uint8Array(buffer)
      );
      imageUrl = `/uploads/${filename}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        ...(imageUrl ? { imageUrl } : {}), // Only include imageUrl if it exists
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