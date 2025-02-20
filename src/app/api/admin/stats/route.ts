import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [products, users] = await Promise.all([
      prisma.product.count(),
      prisma.admin.count(),
    ]);

    return NextResponse.json({
      totalProducts: products,
      totalOrders: 0, // Add order model and count when implemented
      totalUsers: users,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
} 