import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Delete all existing stats
    await prisma.stat.deleteMany();
    
    // Create new stats
    const stats = await Promise.all(
      data.map((stat: any) => 
        prisma.stat.create({
          data: {
            id: stat.id,
            value: stat.value,
            label: stat.label,
            labelRu: stat.labelRu,
            labelUz: stat.labelUz,
          }
        })
      )
    );

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    );
  }
} 