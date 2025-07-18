import ffmpeg from "fluent-ffmpeg";
import { path as ffprobePath } from "ffprobe-static";
import ffmpegPath from "ffmpeg-static";
import fs from "fs-extra";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

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
  private static readonly STORAGE_PATH = path.join(__dirname, "../../storage");
  private static readonly KEYS_PATH = path.join(__dirname, "../../keys");

  static async initialize(): Promise<void> {
    await fs.ensureDir(this.STORAGE_PATH);
    await fs.ensureDir(this.KEYS_PATH);
  }

  static generateEncryptionKey(): { key: Buffer; keyId: string } {
    const key = crypto.randomBytes(16); // Buffer, not hex string
    const keyId = uuidv4();
    return { key, keyId };
  }

  static async saveEncryptionKey(keyId: string, key: Buffer): Promise<string> {
    const keyFilePath = path.join(this.KEYS_PATH, `${keyId}.key`);
    await fs.writeFile(keyFilePath, key); // Write raw binary
    return keyFilePath;
  }

  static async processVideo(
    filePath: string,
    lessonId: string,
    title: string
  ): Promise<ProcessingResult> {
    const outputDir = path.join(this.STORAGE_PATH, "videos", lessonId);
    await fs.ensureDir(outputDir);

    // Generate encryption key
    const { key, keyId } = this.generateEncryptionKey();
    const keyFilePath = await this.saveEncryptionKey(keyId, key);

    // Create key info file for HLS encryption
    const keyInfoPath = path.join(outputDir, "key.info");
    const keyUri = `http://localhost:3000/api/video/key/${keyId}`;
    // Write key info file: only two lines, no key bytes appended
    await fs.writeFile(keyInfoPath, `${keyUri}\n${keyFilePath}\n`, "utf8");
    // Debug logging
    console.log("Key info file written:", keyInfoPath);
    console.log("Key URI:", keyUri);
    console.log("Key file path:", keyFilePath);
    console.log("Key (hex):", key.toString("hex"));
    const keyInfoDebug = await fs.readFile(keyInfoPath);
    console.log("Key info file (hex):", keyInfoDebug.toString("hex"));
    console.log("Key info file (utf8):", keyInfoDebug.toString("utf8"));

    try {
      // Get video duration
      const duration = await this.getVideoDuration(filePath);

      // Generate thumbnail
      await this.generateThumbnail(filePath, outputDir, title);

      // Process video with encryption
      await this.generateEncryptedHLS(filePath, outputDir, keyInfoPath);

      // Clean up temporary files
      await fs.remove(filePath);
      // Do NOT remove keyInfoPath for debugging
      // await fs.remove(keyInfoPath);

      return {
        videoUrl: `/storage/videos/${lessonId}/index.m3u8`,
        thumbnailUrl: `/storage/videos/${lessonId}/thumbnail.webp`,
        duration,
        keyId,
        encryptionKey: key.toString("hex"),
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
        .on("end", () => {
          console.log(`Thumbnail generated for: ${title}`);
          resolve();
        })
        .on("error", (err) => {
          console.error("Error generating thumbnail:", err);
          reject(err);
        })
        .screenshots({
          count: 1,
          folder: outputDir,
          filename: "thumbnail.webp",
          size: "640x360",
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
          // Video encoding settings - ensure compatibility
          "-c:v libx264",
          "-c:a aac",
          "-preset veryfast",
          "-crf 23",
          "-profile:v baseline",
          "-level 3.0",
          "-pix_fmt yuv420p",
          // Audio settings - ensure proper audio stream
          "-ar 44100",
          "-ac 2",
          "-b:a 128k",
          "-acodec aac",
          // Ensure proper stream mapping
          "-map 0:v:0",
          "-map 0:a:0",
          // Force keyframe intervals for better segmentation
          "-g 30",
          "-keyint_min 30",
          "-sc_threshold 0",
          // HLS settings
          "-f hls",
          "-hls_time 6",
          "-hls_list_size 0",
          "-hls_playlist_type vod",
          "-hls_segment_type mpegts",
          "-hls_flags independent_segments",
          // Ensure proper MPEG-TS format
          "-mpegts_m2ts_mode 1",
          "-mpegts_copyts 1",
          "-mpegts_start_pid 0x100",
          // Force proper stream types in MPEG-TS
          "-streamid 0:0x100",
          "-streamid 1:0x101",
          // Encryption settings
          `-hls_key_info_file`,
          keyInfoPath,
          "-hls_segment_filename",
          `${outputDir}/segment_%03d.ts`,
          // Start numbering from 0
          "-start_number 0",
          // Ensure proper format
          "-avoid_negative_ts make_zero",
          "-fflags +genpts",
        ])
        .output(`${outputDir}/index.m3u8`)
        .on("end", async () => {
          console.log("HLS generation completed with encryption enabled");
          // Debug: print key.info and key file contents after FFmpeg
          try {
            const keyInfoContent = await fs.readFile(keyInfoPath, "utf8");
            console.log("[DEBUG] key.info after FFmpeg:", keyInfoContent);
            const keyFilePathLine = keyInfoContent.split("\n")[1];
            if (keyFilePathLine) {
              const keyFilePath = keyFilePathLine.trim();
              const keyFileContent = await fs.readFile(keyFilePath);
              console.log(
                "[DEBUG] key file after FFmpeg (hex):",
                keyFileContent.toString("hex")
              );
            } else {
              console.warn(
                "[DEBUG] key.info does not have a second line for key file path."
              );
            }
          } catch (e) {
            console.error(
              "[DEBUG] Error reading key.info or key file after FFmpeg:",
              e
            );
          }
          resolve();
        })
        .on("error", (err) => {
          console.error("FFmpeg error:", err);
          reject(err);
        })
        .on("progress", (progress) => {
          console.log(`Processing: ${Math.round(progress.percent || 0)}%`);
        })
        .on("stderr", (line) => {
          console.error("FFmpeg stderr:", line);
        })
        .run();
    });
  }

  static async deleteVideo(lessonId: string): Promise<void> {
    const videoDir = path.join(this.STORAGE_PATH, "videos", lessonId);
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
