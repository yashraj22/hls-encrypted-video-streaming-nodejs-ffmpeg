import ffmpeg from 'fluent-ffmpeg';
import { path as ffprobePath } from 'ffprobe-static';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}
ffmpeg.setFfprobePath(ffprobePath);

export interface ProcessingResult {
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  keyId: string;
  encryptionKey: string;
}

export class VideoProcessingService {
  private static readonly STORAGE_PATH = path.join(__dirname, '../../storage');
  private static readonly KEYS_PATH = path.join(__dirname, '../../keys');
  
  static async initialize(): Promise<void> {
    await fs.ensureDir(this.STORAGE_PATH);
    await fs.ensureDir(this.KEYS_PATH);
  }

  static generateEncryptionKey(): { key: string; keyId: string } {
    const key = crypto.randomBytes(16).toString('hex');
    const keyId = uuidv4();
    return { key, keyId };
  }

  static async saveEncryptionKey(keyId: string, key: string): Promise<string> {
    const keyFilePath = path.join(this.KEYS_PATH, `${keyId}.key`);
    await fs.writeFile(keyFilePath, key);
    return keyFilePath;
  }

  static async processVideo(
    filePath: string,
    lessonId: string,
    title: string
  ): Promise<ProcessingResult> {
    const outputDir = path.join(this.STORAGE_PATH, 'videos', lessonId);
    await fs.ensureDir(outputDir);

    // Generate encryption key
    const { key, keyId } = this.generateEncryptionKey();
    const keyFilePath = await this.saveEncryptionKey(keyId, key);

    // Create key info file for HLS encryption
    const keyInfoPath = path.join(outputDir, 'key.info');
    const keyUri = `/api/video/key/${keyId}`;
    await fs.writeFile(keyInfoPath, `${keyUri}\n${keyFilePath}\n${key}`);

    try {
      // Get video duration
      const duration = await this.getVideoDuration(filePath);

      // Generate thumbnail
      await this.generateThumbnail(filePath, outputDir, title);

      // Process video with encryption
      await this.generateEncryptedHLS(filePath, outputDir, keyInfoPath);

      // Clean up temporary files
      await fs.remove(filePath);
      await fs.remove(keyInfoPath);

      return {
        videoUrl: `/storage/videos/${lessonId}/index.m3u8`,
        thumbnailUrl: `/storage/videos/${lessonId}/thumbnail.webp`,
        duration,
        keyId,
        encryptionKey: key
      };
    } catch (error) {
      // Clean up on error
      await fs.remove(outputDir);
      throw error;
    }
  }

  private static async getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration || 0);
      });
    });
  }

  private static async generateThumbnail(
    filePath: string,
    outputDir: string,
    title: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .on('end', () => {
          console.log(`Thumbnail generated for: ${title}`);
          resolve();
        })
        .on('error', (err) => {
          console.error('Error generating thumbnail:', err);
          reject(err);
        })
        .screenshots({
          count: 1,
          folder: outputDir,
          filename: 'thumbnail.webp',
          size: '640x360'
        });
    });
  }

  private static async generateEncryptedHLS(
    filePath: string,
    outputDir: string,
    keyInfoPath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .outputOptions([
          // Video encoding settings
          '-c:v libx264',
          '-c:a aac',
          '-preset medium',
          '-crf 23',
          '-profile:v baseline',
          '-level 3.0',
          
          // HLS settings
          '-f hls',
          '-hls_time 6',
          '-hls_list_size 0',
          '-hls_playlist_type vod',
          
          // Encryption settings
          `-hls_key_info_file ${keyInfoPath}`,
          '-hls_segment_filename',
          `${outputDir}/segment_%03d.ts`,
          
          // Multiple quality settings for adaptive streaming
          '-map 0:v:0',
          '-map 0:a:0',
          '-b:v:0 2000k',
          '-maxrate:v:0 2000k',
          '-bufsize:v:0 4000k',
          '-s:v:0 1280x720',
          
          // Add a lower quality stream
          '-map 0:v:0',
          '-map 0:a:0',
          '-b:v:1 800k',
          '-maxrate:v:1 800k',
          '-bufsize:v:1 1600k',
          '-s:v:1 854x480',
          
          // Master playlist
          '-var_stream_map', 'v:0,a:0 v:1,a:1',
          '-master_pl_name', 'index.m3u8',
          '-hls_segment_type', 'mpegts'
        ])
        .output(`${outputDir}/stream_%v.m3u8`)
        .on('end', () => {
          console.log('HLS generation completed with encryption');
          resolve();
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .on('progress', (progress) => {
          console.log(`Processing: ${Math.round(progress.percent || 0)}%`);
        })
        .run();
    });
  }

  static async deleteVideo(lessonId: string): Promise<void> {
    const videoDir = path.join(this.STORAGE_PATH, 'videos', lessonId);
    await fs.remove(videoDir);
  }

  static async getKeyPath(keyId: string): Promise<string> {
    return path.join(this.KEYS_PATH, `${keyId}.key`);
  }

  static async validateVideoAccess(
    userId: string,
    lessonId: string
  ): Promise<boolean> {
    // This would check if user has access to the lesson
    // Implementation depends on your enrollment logic
    return true; // Placeholder
  }
}

export default VideoProcessingService;