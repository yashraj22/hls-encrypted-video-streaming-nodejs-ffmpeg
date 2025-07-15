import multer from 'multer';
import path from 'path';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import VideoProcessingService from '../services/VideoProcessingService.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({
    dest: 'temp-uploads/',
    limits: {
        fileSize: 500 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'video/mp4',
            'video/avi',
            'video/mov',
            'video/wmv',
            'video/webm'
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only video files are allowed.'));
        }
    }
});
export class LessonController {
    static async createLesson(req, res) {
        try {
            const { title, description, courseId, order, isFree } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const course = await Course.findOne({
                _id: courseId,
                instructor: userId
            });
            if (!course) {
                res.status(404).json({ message: 'Course not found or access denied' });
                return;
            }
            const lesson = new Lesson({
                title,
                description,
                course: courseId,
                order,
                isFree: isFree || false,
                duration: 0,
                videoUrl: '',
                thumbnailUrl: '',
                encryptionKey: '',
                keyId: '',
                isPublished: false
            });
            await lesson.save();
            await Course.findByIdAndUpdate(courseId, {
                $push: { lessons: lesson._id }
            });
            res.status(201).json({
                message: 'Lesson created successfully',
                lesson: {
                    id: lesson._id,
                    title: lesson.title,
                    description: lesson.description,
                    order: lesson.order,
                    isFree: lesson.isFree,
                    isPublished: lesson.isPublished
                }
            });
        }
        catch (error) {
            console.error('Error creating lesson:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async uploadVideo(req, res) {
        const uploadSingle = upload.single('video');
        uploadSingle(req, res, async (err) => {
            if (err) {
                console.error('Upload error:', err);
                res.status(400).json({ message: err.message });
                return;
            }
            try {
                const { lessonId } = req.params;
                const userId = req.user?.id;
                if (!userId) {
                    res.status(401).json({ message: 'Authentication required' });
                    return;
                }
                if (!req.file) {
                    res.status(400).json({ message: 'No video file uploaded' });
                    return;
                }
                const lesson = await Lesson.findById(lessonId).populate('course');
                if (!lesson) {
                    res.status(404).json({ message: 'Lesson not found' });
                    return;
                }
                const course = await Course.findOne({
                    _id: lesson.course,
                    instructor: userId
                });
                if (!course) {
                    res.status(403).json({ message: 'Access denied' });
                    return;
                }
                const processingResult = await VideoProcessingService.processVideo(req.file.path, lessonId, lesson.title);
                await Lesson.findByIdAndUpdate(lessonId, {
                    videoUrl: processingResult.videoUrl,
                    thumbnailUrl: processingResult.thumbnailUrl,
                    duration: processingResult.duration,
                    encryptionKey: processingResult.encryptionKey,
                    keyId: processingResult.keyId
                });
                res.json({
                    message: 'Video uploaded and processed successfully',
                    video: {
                        url: processingResult.videoUrl,
                        thumbnail: processingResult.thumbnailUrl,
                        duration: processingResult.duration
                    }
                });
            }
            catch (error) {
                console.error('Error uploading video:', error);
                res.status(500).json({ message: 'Video processing failed' });
            }
        });
    }
    static async getLesson(req, res) {
        try {
            const { lessonId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const lesson = await Lesson.findById(lessonId)
                .populate('course', 'title instructor')
                .select('-encryptionKey');
            if (!lesson) {
                res.status(404).json({ message: 'Lesson not found' });
                return;
            }
            res.json({
                lesson: {
                    id: lesson._id,
                    title: lesson.title,
                    description: lesson.description,
                    order: lesson.order,
                    duration: lesson.duration,
                    videoUrl: lesson.videoUrl,
                    thumbnailUrl: lesson.thumbnailUrl,
                    isFree: lesson.isFree,
                    isPublished: lesson.isPublished,
                    course: lesson.course,
                    resources: lesson.resources
                }
            });
        }
        catch (error) {
            console.error('Error getting lesson:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async updateLesson(req, res) {
        try {
            const { lessonId } = req.params;
            const { title, description, order, isFree, isPublished } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const lesson = await Lesson.findById(lessonId).populate('course');
            if (!lesson) {
                res.status(404).json({ message: 'Lesson not found' });
                return;
            }
            const course = await Course.findOne({
                _id: lesson.course,
                instructor: userId
            });
            if (!course) {
                res.status(403).json({ message: 'Access denied' });
                return;
            }
            const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, {
                title,
                description,
                order,
                isFree,
                isPublished
            }, { new: true }).select('-encryptionKey');
            res.json({
                message: 'Lesson updated successfully',
                lesson: updatedLesson
            });
        }
        catch (error) {
            console.error('Error updating lesson:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async deleteLesson(req, res) {
        try {
            const { lessonId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const lesson = await Lesson.findById(lessonId).populate('course');
            if (!lesson) {
                res.status(404).json({ message: 'Lesson not found' });
                return;
            }
            const course = await Course.findOne({
                _id: lesson.course,
                instructor: userId
            });
            if (!course) {
                res.status(403).json({ message: 'Access denied' });
                return;
            }
            if (lesson.videoUrl) {
                await VideoProcessingService.deleteVideo(lessonId);
            }
            await Course.findByIdAndUpdate(lesson.course, {
                $pull: { lessons: lessonId }
            });
            await Lesson.findByIdAndDelete(lessonId);
            res.json({ message: 'Lesson deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting lesson:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async getCourseLessons(req, res) {
        try {
            const { courseId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const lessons = await Lesson.find({ course: courseId })
                .sort({ order: 1 })
                .select('-encryptionKey');
            res.json({ lessons });
        }
        catch (error) {
            console.error('Error getting course lessons:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
//# sourceMappingURL=LessonController.js.map