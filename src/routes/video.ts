import { Router } from "express";
import { VideoController } from "../controllers/VideoController.ts";
// import { authenticate, checkLessonAccess } from "../middleware/auth.ts";

const router = Router();

// All video routes are now public
// router.use(authenticate);

// Route guard: prevent /api/video/stream/:lessonId/* from matching segment requests
router.get("/stream/:lessonId/*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Get encryption key for video decryption
router.get("/key/:keyId", VideoController.getEncryptionKey);

// Get video playlist (m3u8)
router.get(
  "/stream/:lessonId([a-fA-F0-9]{24})",
  // checkLessonAccess,
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
