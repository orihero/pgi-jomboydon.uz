import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = join(process.cwd(), 'public', ...params.path);
    const imageBuffer = await readFile(imagePath);
    
    const response = new NextResponse(imageBuffer);
    response.headers.set('Content-Type', 'image/jpeg'); // Adjust content type as needed
    return response;
  } catch (error) {
    return new NextResponse('Image not found', { status: 404 });
  }
} 