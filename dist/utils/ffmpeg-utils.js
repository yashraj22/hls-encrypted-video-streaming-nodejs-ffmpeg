import ffmpeg from 'fluent-ffmpeg';
import { path as ffprobePath } from 'ffprobe-static';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs-extra';
import { updateJsonData } from './updateJsonData.js';
if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath);
}
ffmpeg.setFfprobePath(ffprobePath);
export async function generateThumbnail(filePath, outputDir) {
    return new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .on('filenames', function (filenames) {
            console.log('Generating thumbnail:', filenames);
        })
            .on('end', function () {
            console.log('Thumbnail generation completed.');
            resolve();
        })
            .on('error', function (err) {
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
export async function generateVideoSegments(filePath, outputDir, title, res) {
    return new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .on('filenames', function (filenames) {
            console.log('Generating Video Segments:', filenames);
        })
            .outputOptions([
            '-c:v libx264',
            '-c:a aac',
            '-preset medium',
            '-crf 24',
        ])
            .output(`${outputDir}/index.m3u8`)
            .outputOptions([
            '-start_number 0',
            '-hls_time 4',
            '-hls_list_size 0',
            '-hls_playlist_type vod',
            '-f hls',
        ])
            .on('end', async () => {
            await fs.remove(filePath);
            updateJsonData(title, `videos/${title}/index.m3u8`, `videos/${title}/thumbnail.webp`);
            console.log('Video segments generation completed.');
            res.json({ message: 'Video uploaded and converted successfully.' });
            resolve();
        })
            .on('error', (err) => {
            console.error('FFmpeg error:', err);
            res.status(500).json({ message: 'Error converting video.' });
            reject(err);
        })
            .run();
    });
}
//# sourceMappingURL=ffmpeg-utils.js.map