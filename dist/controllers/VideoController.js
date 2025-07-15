import fs from 'fs-extra';
import path from 'path';
import jwt from 'jsonwebtoken';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import VideoProcessingService from '../services/VideoProcessingService.js';
export class VideoController {
    static async getEncryptionKey(req, res) {
        try {
            const { keyId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const lesson = await Lesson.findOne({ keyId }).populate('course');
            if (!lesson) {
                res.status(404).json({ message: 'Video not found' });
                return;
            }
            const enrollment = await Enrollment.findOne({
                student: userId,
                course: lesson.course,
                isActive: true
            });
            if (!enrollment) {
                res.status(403).json({ message: 'Access denied' });
                return;
            }
            const accessToken = jwt.sign({ userId, lessonId: lesson._id, keyId }, process.env['JWT_SECRET'] || 'your-secret-key', { expiresIn: '1h' });
            res.set({
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            });
            res.type('application/octet-stream');
            res.send(Buffer.from(lesson.encryptionKey, 'hex'));
        }
        catch (error) {
            console.error('Error serving encryption key:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async getVideoPlaylist(req, res) {
        try {
            const { lessonId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const lesson = await Lesson.findById(lessonId).populate('course');
            if (!lesson) {
                res.status(404).json({ message: 'Video not found' });
                return;
            }
            const enrollment = await Enrollment.findOne({
                student: userId,
                course: lesson.course,
                isActive: true
            });
            if (!enrollment) {
                res.status(403).json({ message: 'Access denied' });
                return;
            }
            await Enrollment.findByIdAndUpdate(enrollment._id, {
                lastAccessedLesson: lessonId,
                lastAccessedAt: new Date()
            });
            const playlistPath = path.join(VideoProcessingService['STORAGE_PATH'], 'videos', lessonId, 'index.m3u8');
            if (!(await fs.pathExists(playlistPath))) {
                res.status(404).json({ message: 'Video file not found' });
                return;
            }
            res.set({
                'Content-Type': 'application/vnd.apple.mpegurl',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Access-Control-Allow-Origin': process.env['FRONTEND_URL'] || 'http://localhost:3000',
                'Access-Control-Allow-Credentials': 'true'
            });
            const playlistContent = await fs.readFile(playlistPath, 'utf8');
            res.send(playlistContent);
        }
        catch (error) {
            console.error('Error serving video playlist:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async getVideoSegment(req, res) {
        try {
            const { lessonId, segmentName } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const lesson = await Lesson.findById(lessonId).populate('course');
            if (!lesson) {
                res.status(404).json({ message: 'Video not found' });
                return;
            }
            const enrollment = await Enrollment.findOne({
                student: userId,
                course: lesson.course,
                isActive: true
            });
            if (!enrollment) {
                res.status(403).json({ message: 'Access denied' });
                return;
            }
            const segmentPath = path.join(VideoProcessingService['STORAGE_PATH'], 'videos', lessonId, segmentName);
            if (!(await fs.pathExists(segmentPath))) {
                res.status(404).json({ message: 'Segment not found' });
                return;
            }
            res.set({
                'Content-Type': 'video/mp2t',
                'Cache-Control': 'private, max-age=3600',
                'Access-Control-Allow-Origin': process.env['FRONTEND_URL'] || 'http://localhost:3000',
                'Access-Control-Allow-Credentials': 'true'
            });
            const segmentStream = fs.createReadStream(segmentPath);
            segmentStream.pipe(res);
        }
        catch (error) {
            console.error('Error serving video segment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async getVideoThumbnail(req, res) {
        try {
            const { lessonId } = req.params;
            const thumbnailPath = path.join(VideoProcessingService['STORAGE_PATH'], 'videos', lessonId, 'thumbnail.webp');
            if (!(await fs.pathExists(thumbnailPath))) {
                res.status(404).json({ message: 'Thumbnail not found' });
                return;
            }
            res.set({
                'Content-Type': 'image/webp',
                'Cache-Control': 'public, max-age=86400'
            });
            const thumbnailStream = fs.createReadStream(thumbnailPath);
            thumbnailStream.pipe(res);
        }
        catch (error) {
            console.error('Error serving thumbnail:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async generateVideoToken(req, res) {
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
            const enrollment = await Enrollment.findOne({
                student: userId,
                course: lesson.course,
                isActive: true
            });
            if (!enrollment) {
                res.status(403).json({ message: 'Access denied' });
                return;
            }
            const token = jwt.sign({
                userId,
                lessonId,
                courseId: lesson.course,
                timestamp: Date.now()
            }, process.env['JWT_SECRET'] || 'your-secret-key', { expiresIn: '2h' });
            res.json({
                token,
                videoUrl: `/api/video/stream/${lessonId}`,
                expiresIn: 7200
            });
        }
        catch (error) {
            console.error('Error generating video token:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
//# sourceMappingURL=VideoController.js.map