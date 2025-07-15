import { Router } from 'express';
import { LessonController } from '../controllers/LessonController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All lesson routes require authentication
router.use(authenticate);

// Create a new lesson (instructors only)
router.post('/', authorize(['instructor', 'admin']), LessonController.createLesson);

// Upload video for a lesson (instructors only)
router.post('/:lessonId/video', authorize(['instructor', 'admin']), LessonController.uploadVideo);

// Get lesson details
router.get('/:lessonId', LessonController.getLesson);

// Update lesson (instructors only)
router.put('/:lessonId', authorize(['instructor', 'admin']), LessonController.updateLesson);

// Delete lesson (instructors only)
router.delete('/:lessonId', authorize(['instructor', 'admin']), LessonController.deleteLesson);

// Get lessons for a course
router.get('/course/:courseId', LessonController.getCourseLessons);

export default router;