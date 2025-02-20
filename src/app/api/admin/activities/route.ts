import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Implement activity logging in your database
    const activities = [
      {
        id: 1,
        action: 'New product added',
        timestamp: new Date().toISOString(),
      },
      // Add more mock activities for now
    ];

    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
} 