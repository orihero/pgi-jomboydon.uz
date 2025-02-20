import { spawn } from 'child_process';
import path from 'path';

export async function compressVideo(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // FFmpeg command with optimized settings for web video
    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      // Video settings
      '-c:v', 'libx264',        // Use H.264 codec
      '-crf', '23',             // Constant Rate Factor (18-28 is good, lower = better quality)
      '-preset', 'slow',        // Slower preset = better compression
      '-profile:v', 'main',     // Main profile for better compatibility
      '-movflags', '+faststart', // Enable fast start for web playback
      // Audio settings
      '-c:a', 'aac',            // Use AAC codec for audio
      '-b:a', '128k',           // Audio bitrate
      // Resolution (optional, comment out to keep original resolution)
      // '-vf', 'scale=-2:720',    // Scale to 720p height, maintain aspect ratio
      // Output
      '-y',                      // Overwrite output file
      outputPath
    ]);

    // Handle process events
    ffmpeg.stderr.on('data', (data) => {
      console.log(`FFmpeg: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });

    ffmpeg.on('error', (err) => {
      reject(err);
    });
  });
} 