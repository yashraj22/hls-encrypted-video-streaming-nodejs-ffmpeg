import { Router } from 'express';
import { VideoController } from '../controllers/VideoController.js';
import { authenticate, checkLessonAccess } from '../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.get('/key/:keyId', VideoController.getEncryptionKey);
router.get('/stream/:lessonId', checkLessonAccess, VideoController.getVideoPlaylist);
router.get('/segment/:lessonId/:segmentName', checkLessonAccess, VideoController.getVideoSegment);
router.get('/thumbnail/:lessonId', VideoController.getVideoThumbnail);
router.post('/token/:lessonId', VideoController.generateVideoToken);
export default router;
//# sourceMappingURL=video.js.map