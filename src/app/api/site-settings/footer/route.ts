import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage } from '@/lib/uploadImage';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Update site settings
    const siteSettings = await prisma.siteSettings.update({
      where: {
        id: 1,
      },
      data: {
        address: data.address,
        address_ru: data.address_ru,
        address_uz: data.address_uz,
        instagram: data.instagram,
        telegram: data.telegram,
        youtube: data.youtube,
        facebook: data.facebook,
      },
    });

    // Delete existing phones
    await prisma.phone.deleteMany({
      where: {
        settingsId: siteSettings.id,
      },
    });

    // Create new phones one by one
    if (data.phones.length > 0) {
      for (const phone of data.phones) {
        await prisma.phone.create({
          data: {
            number: phone.number,
            department: phone.department,
            department_ru: phone.department_ru,
            department_uz: phone.department_uz,
            description: phone.description || null,
            description_ru: phone.description_ru || null,
            description_uz: phone.description_uz || null,
            settingsId: siteSettings.id,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating footer settings:', error);
    return NextResponse.json(
      { error: 'Failed to update footer settings' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const siteSettings = await prisma.siteSettings.findFirst({
      include: {
        phones: true,
      },
    });

    if (!siteSettings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    return NextResponse.json(siteSettings);
  } catch (error) {
    console.error('Error fetching footer settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch footer settings' },
      { status: 500 }
    );
  }
} 