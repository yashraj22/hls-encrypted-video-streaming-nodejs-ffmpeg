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

export interface QualityLevel {
  quality: string;
  resolution: string;
  bitrate: string;
  videoBitrate: string;
  audioBitrate: string;
}

export interface ProcessingResult {
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  keyId: string;
  encryptionKey: string;
  qualityLevels: QualityLevel[];
}

export class VideoProcessingService {
  private static readonly STORAGE_PATH = path.join(__dirname, "../../storage");
  private static readonly KEYS_PATH = path.join(__dirname, "../../keys");

  // Quality levels configuration
  private static readonly QUALITY_LEVELS: QualityLevel[] = [
    {
      quality: "1080p",
      resolution: "1920x1080",
      bitrate: "3000k",
      videoBitrate: "2500k",
      audioBitrate: "128k",
    },
    {
      quality: "720p",
      resolution: "1280x720",
      bitrate: "1500k",
      videoBitrate: "1300k",
      audioBitrate: "128k",
    },
    {
      quality: "480p",
      resolution: "854x480",
      bitrate: "800k",
      videoBitrate: "700k",
      audioBitrate: "128k",
    },
  ];

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

    try {
      // Get video info to determine available quality levels
      const videoInfo = await this.getVideoInfo(filePath);
      const availableQualities = this.getAvailableQualityLevels(videoInfo);

      // Create master playlist
      const masterPlaylistPath = path.join(outputDir, "master.m3u8");
      await this.createMasterPlaylist(
        masterPlaylistPath,
        availableQualities,
        lessonId
      );

      // Get video duration
      const duration = await this.getVideoDuration(filePath);

      // Generate thumbnail
      await this.generateThumbnail(filePath, outputDir, title);

      // Process video for each quality level
      for (const quality of availableQualities) {
        const qualityDir = path.join(outputDir, quality.quality);
        await fs.ensureDir(qualityDir);

        // Create key info file for this quality
        const keyInfoPath = path.join(qualityDir, "key.info");
        const keyUri = `http://localhost:3000/api/video/key/${keyId}`;
        await fs.writeFile(keyInfoPath, `${keyUri}\n${keyFilePath}\n`, "utf8");

        // Generate encrypted HLS for this quality
        await this.generateEncryptedHLSForQuality(
          filePath,
          qualityDir,
          keyInfoPath,
          quality,
          quality.quality
        );
      }

      // Clean up temporary files
      await fs.remove(filePath);

      return {
        videoUrl: `/storage/videos/${lessonId}/master.m3u8`,
        thumbnailUrl: `/storage/videos/${lessonId}/thumbnail.webp`,
        duration,
        keyId,
        encryptionKey: key.toString("hex"),
        qualityLevels: availableQualities,
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

  private static async getVideoInfo(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata);
      });
    });
  }

  private static getAvailableQualityLevels(videoInfo: any): QualityLevel[] {
    const videoStream = videoInfo.streams.find(
      (stream: any) => stream.codec_type === "video"
    );
    if (!videoStream) {
      throw new Error("No video stream found");
    }

    const inputHeight = videoStream.height || 0;
    const inputWidth = videoStream.width || 0;

    // Filter quality levels based on input resolution
    return this.QUALITY_LEVELS.filter((quality) => {
      const dimensions = quality.resolution.split("x").map(Number);
      if (dimensions.length !== 2 || !dimensions[0] || !dimensions[1])
        return false;

      const targetWidth = dimensions[0];
      const targetHeight = dimensions[1];

      // Only include qualities that are equal to or smaller than the input
      return targetHeight <= inputHeight && targetWidth <= inputWidth;
    });
  }

  private static async createMasterPlaylist(
    masterPlaylistPath: string,
    qualityLevels: QualityLevel[],
    lessonId: string
  ): Promise<void> {
    let masterPlaylist = "#EXTM3U\n#EXT-X-VERSION:3\n\n";

    for (const quality of qualityLevels) {
      const [width, height] = quality.resolution.split("x").map(Number);
      masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${quality.bitrate.replace(
        "k",
        "000"
      )},RESOLUTION=${width}x${height}\n`;
      masterPlaylist += `/api/video/stream/${lessonId}/${quality.quality}/index.m3u8\n\n`;
    }

    await fs.writeFile(masterPlaylistPath, masterPlaylist, "utf8");
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

  private static async generateEncryptedHLSForQuality(
    filePath: string,
    outputDir: string,
    keyInfoPath: string,
    quality: QualityLevel,
    qualityName: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const [width, height] = quality.resolution.split("x").map(Number);

      ffmpeg(filePath)
        .outputOptions([
          // Video encoding settings
          "-c:v libx264",
          "-c:a aac",
          "-preset veryfast",
          "-crf 23",
          "-profile:v baseline",
          "-level 3.0",
          "-pix_fmt yuv420p",
          // Scale to target resolution
          `-vf scale=${width}:${height}`,
          // Bitrate settings
          `-b:v ${quality.videoBitrate}`,
          `-maxrate ${quality.videoBitrate}`,
          `-bufsize ${parseInt(quality.videoBitrate) * 2}k`,
          // Audio settings
          "-ar 44100",
          "-ac 2",
          `-b:a ${quality.audioBitrate}`,
          "-acodec aac",
          // Stream mapping
          "-map 0:v:0",
          "-map 0:a:0",
          // Force keyframe intervals
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
          // MPEG-TS settings
          "-mpegts_m2ts_mode 1",
          "-mpegts_copyts 1",
          "-mpegts_start_pid 0x100",
          "-streamid 0:0x100",
          "-streamid 1:0x101",
          // Encryption settings
          `-hls_key_info_file`,
          keyInfoPath,
          "-hls_segment_filename",
          `${outputDir}/segment_%03d.ts`,
          "-start_number 0",
          "-avoid_negative_ts make_zero",
          "-fflags +genpts",
        ])
        .output(`${outputDir}/index.m3u8`)
        .on("end", () => {
          console.log(`HLS generation completed for ${qualityName} quality`);
          resolve();
        })
        .on("error", (err) => {
          console.error(`FFmpeg error for ${qualityName}:`, err);
          reject(err);
        })
        .on("progress", (progress) => {
          console.log(
            `Processing ${qualityName}: ${Math.round(progress.percent || 0)}%`
          );
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
