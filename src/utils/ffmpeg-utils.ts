import ffmpeg from 'fluent-ffmpeg';
import { path as ffprobePath } from 'ffprobe-static';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs-extra';
import { Response } from 'express';
import { updateJsonData } from './updateJsonData.js';

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}
ffmpeg.setFfprobePath(ffprobePath);

export async function generateThumbnail(filePath: string, outputDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .on('filenames', function (filenames: string[]) {
        console.log('Generating thumbnail:', filenames);
      })
      .on('end', function () {
        console.log('Thumbnail generation completed.');
        resolve();
      })
      .on('error', function (err: Error) {
        console.error('Error generating thumbnail:', err);
        reject(err);
      })
      .screenshots({
        count: 1,
        folder: outputDir,
        filename: 'thumbnail.webp',
        size: '320x?',
      });
  });
}

export async function generateVideoSegments(filePath: string, outputDir: string, title: string, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .on('filenames', function (filenames: string[]) {
        console.log('Generating Video Segments:', filenames);
      })
      .outputOptions([
        '-c:v libx264', // Specifies the H.264 video codec.
        '-c:a aac', // Specifies the AAC audio codec.
        '-preset medium', // Compression preset
        '-crf 24', // CRF for quality control (lower is better quality)
      ])
      .output(`${outputDir}/index.m3u8`)
      .outputOptions([
        '-start_number 0', // Sets the starting number for the HLS segments.
        '-hls_time 4', // Duration of each HLS segment in seconds.
        '-hls_list_size 0', // Ensures all segments are included in the playlist.
        '-hls_playlist_type vod', // Designates the playlist as VOD and includes the EXT-X-ENDLIST tag.
        '-f hls', // Specifies the output format as HLS (HTTP Live Streaming).
      ])
      .on('end', async () => {
        await fs.remove(filePath);
        updateJsonData(
          title,
          `videos/${title}/index.m3u8`,
          `videos/${title}/thumbnail.webp`
        );
        console.log('Video segments generation completed.');
        res.json({ message: 'Video uploaded and converted successfully.' });
        resolve();
      })
      .on('error', (err: Error) => {
        console.error('FFmpeg error:', err);
        res.status(500).json({ message: 'Error converting video.' });
        reject(err);
      })
      .run();
  });
}