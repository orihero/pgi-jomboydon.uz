import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    let imageUrl = formData.get('currentImageUrl') as string | null;
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      
      const filename = `product-${Date.now()}-${imageFile.name}`;
      const filepath = path.join(process.cwd(), 'public', 'images', 'products', filename);
      
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      await fs.writeFile(filepath, buffer);
      
      imageUrl = `/images/products/${filename}`;
    }

    const product = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: {
        name: formData.get('name') as string,
        name_ru: formData.get('nameRu') as string,
        name_uz: formData.get('nameUz') as string,
        description: formData.get('description') as string || null,
        description_ru: formData.get('descriptionRu') as string || null,
        description_uz: formData.get('descriptionUz') as string || null,
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category') as string,
        category_ru: formData.get('categoryRu') as string,
        category_uz: formData.get('categoryUz') as string,
        imageUrl,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 