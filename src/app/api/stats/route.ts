import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const stats = await prisma.stat.findMany();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { stats } = await request.json();
    
    // Update all stats in a transaction
    await prisma.$transaction(
      stats.map((stat: any) =>
        prisma.stat.update({
          where: { id: stat.id },
          data: {
            value: stat.value,
            label: stat.label,
            labelRu: stat.labelRu,
            labelUz: stat.labelUz,
          },
        })
      )
    );

    return NextResponse.json({ message: 'Stats updated successfully' });
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
  }
} 