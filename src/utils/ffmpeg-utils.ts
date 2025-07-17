import ffmpeg from "fluent-ffmpeg";
import { path as ffprobePath } from "ffprobe-static";
import ffmpegPath from "ffmpeg-static";
import fs from "fs-extra";
import path from "path";
import { Response } from "express";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}
ffmpeg.setFfprobePath(ffprobePath);

export function generateThumbnail(
  filePath: string,
  outputDir: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .on("end", function () {
        resolve();
      })
      .on("error", function (err: Error) {
        console.error("Error generating thumbnail:", err);
        reject(err);
      })
      .screenshots({
        count: 1,
        folder: outputDir,
        size: "640x360",
        filename: "thumbnail.webp",
      });
  });
}

export function generateVideoSegments(
  filePath: string,
  outputDir: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .addOption("-profile:v", "baseline")
      .addOption("-level", "3.0")
      .addOption("-s", "640x360")
      .addOption("-start_number", "0")
      .addOption("-hls_time", "10")
      .addOption("-hls_list_size", "0")
      .addOption("-f", "hls")
      .output(path.join(outputDir, "index.m3u8"))
      .on("end", function () {
        resolve();
      })
      .on("error", function (err: Error) {
        console.error("Error generating video segments:", err);
        reject(err);
      })
      .run();
  });
}
