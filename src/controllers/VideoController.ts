import type { Response } from "express";
import fs from "fs-extra";
import path from "path";
import jwt from "jsonwebtoken";
import Lesson from "../models/Lesson.ts";
import Enrollment from "../models/Enrollment.ts";
import VideoProcessingService from "../services/VideoProcessingService.ts";
import type { AuthRequest } from "../middleware/auth.ts";

export class VideoController {
  // Serve encryption key for authenticated users
  static async getEncryptionKey(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { keyId } = req.params;
      // const userId = req.user?.id;

      // Remove authentication and enrollment check
      // if (!userId) {
      //   res.status(401).json({ message: "Authentication required" });
      //   return;
      // }

      // Find the lesson associated with this key
      const lesson = await Lesson.findOne({ keyId });

      if (!lesson) {
        res.status(404).json({ message: "Video not found" });
        return;
      }

      // Remove enrollment check
      // const enrollment = await Enrollment.findOne({
      //   student: userId,
      //   course: lesson.course,
      //   isActive: true,
      // });
      // if (!enrollment) {
      //   res.status(403).json({ message: "Access denied" });
      //   return;
      // }

      // Generate time-limited access token (optional, can skip)
      // const accessToken = jwt.sign(
      //   { userId, lessonId: lesson._id, keyId },
      //   process.env["JWT_SECRET"] || "your-secret-key",
      //   { expiresIn: "1h" }
      // );

      // Set security headers
      res.set({
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      });

      // Return the encryption key
      res.type("application/octet-stream");
      res.send(Buffer.from(lesson.encryptionKey, "hex"));
    } catch (error) {
      console.error("Error serving encryption key:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Serve video playlist (public)
  // NOTE: The playlist should reference segment URLs under /storage/videos/<lessonId>/segment_XXX.ts
  //       so that the HLS player fetches segments directly from static files, not via API routes.
  static async getVideoPlaylist(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { lessonId } = req.params;
      // const userId = req.user?.id;

      // Remove authentication and enrollment check
      // if (!userId) {
      //   res.status(401).json({ message: "Authentication required" });
      //   return;
      // }

      const lesson = await Lesson.findById(lessonId).populate("course");

      if (!lesson) {
        res.status(404).json({ message: "Video not found" });
        return;
      }

      // Remove enrollment check
      // const enrollment = await Enrollment.findOne({
      //   student: userId,
      //   course: lesson.course,
      //   isActive: true,
      // });
      // if (!enrollment) {
      //   res.status(403).json({ message: "Access denied" });
      //   return;
      // }

      // Update last accessed
      // await Enrollment.findByIdAndUpdate(enrollment._id, {
      //   lastAccessedLesson: lessonId as string,
      //   lastAccessedAt: new Date(),
      // });

      // Serve the playlist file
      const playlistPath = path.join(
        VideoProcessingService["STORAGE_PATH"],
        "videos",
        lessonId as string,
        "index.m3u8"
      );

      if (!(await fs.pathExists(playlistPath))) {
        res.status(404).json({ message: "Video file not found" });
        return;
      }

      res.set({
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin":
          process.env["FRONTEND_URL"] || "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
      });

      let playlistContent = await fs.readFile(playlistPath, "utf8");
      // Rewrite segment lines to absolute URLs
      playlistContent = playlistContent
        .split("\n")
        .map((line) => {
          // Only rewrite lines that look like segment files
          if (/^segment_\d+\.ts$/.test(line.trim())) {
            return `/storage/videos/${lessonId}/${line.trim()}`;
          }
          return line;
        })
        .join("\n");
      res.send(playlistContent);
    } catch (error) {
      console.error("Error serving video playlist:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Serve video segments (public)
  // NOTE: This route is deprecated. Segments should be served directly from /storage/videos/<lessonId>/segment_XXX.ts
  //       via static file serving, not through this API endpoint.
  static async getVideoSegment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { lessonId, segmentName } = req.params;
      // const userId = req.user?.id;

      // Remove authentication and enrollment check
      // if (!userId) {
      //   res.status(401).json({ message: "Authentication required" });
      //   return;
      // }

      const lesson = await Lesson.findById(lessonId).populate("course");

      if (!lesson) {
        res.status(404).json({ message: "Video not found" });
        return;
      }

      // Remove enrollment check
      // const enrollment = await Enrollment.findOne({
      //   student: userId,
      //   course: lesson.course,
      //   isActive: true,
      // });
      // if (!enrollment) {
      //   res.status(403).json({ message: "Access denied" });
      //   return;
      // }

      // Serve the segment file
      const segmentPath = path.join(
        VideoProcessingService["STORAGE_PATH"],
        "videos",
        lessonId as string,
        segmentName as string
      );

      if (!(await fs.pathExists(segmentPath))) {
        res.status(404).json({ message: "Segment not found" });
        return;
      }

      res.set({
        "Content-Type": "video/mp2t",
        "Cache-Control": "private, max-age=3600",
        "Access-Control-Allow-Origin":
          process.env["FRONTEND_URL"] || "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
      });

      const segmentStream = fs.createReadStream(segmentPath);
      segmentStream.pipe(res);
    } catch (error) {
      console.error("Error serving video segment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get video thumbnail (public)
  static async getVideoThumbnail(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { lessonId } = req.params;

      const thumbnailPath = path.join(
        VideoProcessingService["STORAGE_PATH"],
        "videos",
        lessonId as string,
        "thumbnail.webp"
      );

      if (!(await fs.pathExists(thumbnailPath))) {
        res.status(404).json({ message: "Thumbnail not found" });
        return;
      }

      res.set({
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400",
      });

      const thumbnailStream = fs.createReadStream(thumbnailPath);
      thumbnailStream.pipe(res);
    } catch (error) {
      console.error("Error serving thumbnail:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Generate secure video access token (public)
  static async generateVideoToken(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { lessonId } = req.params;
      // const userId = req.user?.id;

      // Remove authentication and enrollment check
      // if (!userId) {
      //   res.status(401).json({ message: "Authentication required" });
      //   return;
      // }

      const lesson = await Lesson.findById(lessonId).populate("course");

      if (!lesson) {
        res.status(404).json({ message: "Lesson not found" });
        return;
      }

      // Remove enrollment check
      // const enrollment = await Enrollment.findOne({
      //   student: userId,
      //   course: lesson.course,
      //   isActive: true,
      // });
      // if (!enrollment) {
      //   res.status(403).json({ message: "Access denied" });
      //   return;
      // }

      // Generate time-limited token (optional, can skip)
      // const token = jwt.sign(
      //   {
      //     userId,
      //     lessonId,
      //     courseId: lesson.course,
      //     timestamp: Date.now(),
      //   },
      //   process.env["JWT_SECRET"] || "your-secret-key",
      //   { expiresIn: "2h" }
      // );

      res.json({
        // token,
        videoUrl: `/api/video/stream/${lessonId}`,
        // expiresIn: 7200, // 2 hours
      });
    } catch (error) {
      console.error("Error generating video token:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
