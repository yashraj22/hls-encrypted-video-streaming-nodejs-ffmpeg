import { Router } from "express";
import { VideoController } from "../controllers/VideoController.ts";
// import { authenticate, checkLessonAccess } from "../middleware/auth.ts";

const router = Router();

// All video routes are now public
// router.use(authenticate);

// Get encryption key for video decryption
router.get("/key/:keyId", VideoController.getEncryptionKey);

// Get quality-specific video playlist (m3u8) - this must come before the master playlist route
router.get(
  "/stream/:lessonId([a-fA-F0-9]{24})/:quality(480p|720p|1080p)/index.m3u8",
  VideoController.getVideoPlaylist
);

// Get video playlist (m3u8) - master playlist
router.get(
  "/stream/:lessonId([a-fA-F0-9]{24})",
  VideoController.getVideoPlaylist
);

// Get video segments
// router.get(
//   "/segment/:lessonId/:segmentName",
//   // checkLessonAccess,
//   VideoController.getVideoSegment
// );

// Get video thumbnail
router.get("/thumbnail/:lessonId", VideoController.getVideoThumbnail);

// Generate video access token
router.post("/token/:lessonId", VideoController.generateVideoToken);

export default router;
