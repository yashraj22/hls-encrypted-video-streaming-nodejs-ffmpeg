import { Router } from 'express';
import { VideoController } from '../controllers/VideoController.js';
import { authenticate, checkLessonAccess } from '../middleware/auth.js';

const router = Router();

// All video routes require authentication
router.use(authenticate);

// Get encryption key for video decryption
router.get('/key/:keyId', VideoController.getEncryptionKey);

// Get video playlist (m3u8)
router.get('/stream/:lessonId', checkLessonAccess, VideoController.getVideoPlaylist);

// Get video segments
router.get('/segment/:lessonId/:segmentName', checkLessonAccess, VideoController.getVideoSegment);

// Get video thumbnail
router.get('/thumbnail/:lessonId', VideoController.getVideoThumbnail);

// Generate video access token
router.post('/token/:lessonId', VideoController.generateVideoToken);

export default router;