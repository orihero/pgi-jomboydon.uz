import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

// GET single product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const image = formData.get('image') as File | null;

    // Get the current product to check existing image
    const currentProduct = await prisma.product.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    let imageUrl = currentProduct.imageUrl;

    // Handle new image upload
    if (image) {
      // Delete old image if exists
      if (currentProduct.imageUrl) {
        const oldImagePath = path.join(
          process.cwd(),
          'public',
          currentProduct.imageUrl
        );
        try {
          await unlink(oldImagePath);
        } catch (err) {
          // Ignore error if file doesn't exist
          console.log('Error deleting old image:', err);
        }
      }

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
      
      // Save the new file
      await writeFile(
        path.join(uploadDir, filename),
        new Uint8Array(buffer)
      );
      imageUrl = `/uploads/${filename}`;
    }

    // Update product in database
    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name,
        description: description || null,
        price,
        ...(imageUrl ? { imageUrl } : {}),
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the product to delete its image
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete the image file if it exists
    if (product.imageUrl) {
      const imagePath = path.join(process.cwd(), 'public', product.imageUrl);
      try {
        await unlink(imagePath);
      } catch (err) {
        // Ignore error if file doesn't exist
        console.log('Error deleting image:', err);
      }
    }

    // Delete the product from database
    await prisma.product.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 