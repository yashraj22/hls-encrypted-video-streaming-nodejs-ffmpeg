import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cron from 'node-cron';
import connectDB from './config/database.js';
import { auth } from './config/auth.js';
import videoRoutes from './routes/video.js';
import lessonRoutes from './routes/lessons.js';
import VideoProcessingService from './services/VideoProcessingService.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class Server {
    app;
    PORT;
    constructor() {
        this.app = express();
        this.PORT = parseInt(process.env['PORT'] || '3000');
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddleware() {
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "blob:"],
                    mediaSrc: ["'self'", "blob:"],
                    connectSrc: ["'self'"],
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    upgradeInsecureRequests: [],
                },
            },
        }));
        this.app.use(cors({
            origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }));
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: 'Too many requests from this IP, please try again later.'
        });
        this.app.use('/api/', limiter);
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use('/storage', express.static(path.join(__dirname, '../storage'), {
            setHeaders: (res, path) => {
                res.set({
                    'Cache-Control': 'private, max-age=3600',
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'Referrer-Policy': 'strict-origin-when-cross-origin'
                });
            }
        }));
        this.app.use('/api/auth', auth.handler);
        this.app.use('/api/video', (req, res, next) => {
            res.set({
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'Cache-Control': 'private, no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            next();
        });
    }
    initializeRoutes() {
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                environment: process.env['NODE_ENV'] || 'development'
            });
        });
        this.app.use('/api/video', videoRoutes);
        this.app.use('/api/lessons', lessonRoutes);
        this.app.use('*', (req, res) => {
            res.status(404).json({
                message: 'Route not found',
                path: req.originalUrl
            });
        });
    }
    initializeErrorHandling() {
        this.app.use((err, req, res, next) => {
            console.error('Global error:', err);
            if (err.name === 'ValidationError') {
                return res.status(400).json({
                    message: 'Validation error',
                    errors: Object.values(err.errors).map((e) => e.message)
                });
            }
            if (err.name === 'CastError') {
                return res.status(400).json({
                    message: 'Invalid ID format'
                });
            }
            if (err.code === 11000) {
                return res.status(409).json({
                    message: 'Duplicate entry error'
                });
            }
            res.status(err.status || 500).json({
                message: err.message || 'Internal server error',
                ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack })
            });
        });
    }
    initializeCronJobs() {
        cron.schedule('0 * * * *', async () => {
            try {
                console.log('Running cleanup job...');
            }
            catch (error) {
                console.error('Cleanup job error:', error);
            }
        });
        cron.schedule('*/30 * * * *', () => {
            console.log('System health check:', {
                timestamp: new Date().toISOString(),
                memory: process.memoryUsage(),
                uptime: process.uptime()
            });
        });
    }
    async start() {
        try {
            await connectDB();
            await VideoProcessingService.initialize();
            this.initializeCronJobs();
            this.app.listen(this.PORT, () => {
                console.log(`🚀 LMS Server running on port ${this.PORT}`);
                console.log(`📱 Environment: ${process.env['NODE_ENV'] || 'development'}`);
                console.log(`🔐 Frontend URL: ${process.env['FRONTEND_URL'] || 'http://localhost:3000'}`);
            });
            process.on('SIGTERM', this.gracefulShutdown);
            process.on('SIGINT', this.gracefulShutdown);
        }
        catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    }
    gracefulShutdown = async (signal) => {
        console.log(`Received ${signal}. Starting graceful shutdown...`);
        process.exit(0);
    };
}
const server = new Server();
server.start().catch((error) => {
    console.error('Server startup error:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map