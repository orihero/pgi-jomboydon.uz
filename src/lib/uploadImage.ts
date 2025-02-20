import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadImage(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public/uploads', filename);
    
    // Write the file
    await writeFile(path, buffer);
    
    // Return the public URL
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

// TODO: In production, implement actual image upload to a service like:
// - AWS S3
// - Cloudinary
// - Firebase Storage
// - or your own server storage 