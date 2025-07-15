import { Router } from 'express';
import { LessonController } from '../controllers/LessonController.js';
import { authenticate, authorize } from '../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.post('/', authorize(['instructor', 'admin']), LessonController.createLesson);
router.post('/:lessonId/video', authorize(['instructor', 'admin']), LessonController.uploadVideo);
router.get('/:lessonId', LessonController.getLesson);
router.put('/:lessonId', authorize(['instructor', 'admin']), LessonController.updateLesson);
router.delete('/:lessonId', authorize(['instructor', 'admin']), LessonController.deleteLesson);
router.get('/course/:courseId', LessonController.getCourseLessons);
export default router;
//# sourceMappingURL=lessons.js.map