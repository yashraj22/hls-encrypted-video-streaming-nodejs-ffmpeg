import type { Application } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cron from "node-cron";

// Import configurations
import connectDB from "./config/database.ts";
import { auth } from "./config/auth.ts";

// Import routes
import videoRoutes from "./routes/video.ts";
import lessonRoutes from "./routes/lessons.ts";

// Import services
import VideoProcessingService from "./services/VideoProcessingService.ts";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server {
  private app: Application;
  private PORT: number;

  constructor() {
    this.app = express();
    this.PORT = parseInt(process.env["PORT"] || "3000");
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(
      helmet({
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
      })
    );

    // CORS configuration
    this.app.use(
      cors({
        origin: [
          "http://localhost:5173", // Frontend development server
          "http://localhost:5174", // Frontend development server (alternative port)
          "http://localhost:3000", // Backend server (for HLS.js key requests)
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
          "Content-Type", 
          "Authorization", 
          "X-Requested-With", 
          "Cache-Control", 
          "Pragma",
          "Accept",
          "Origin",
          "X-Requested-With",
          "Access-Control-Request-Method",
          "Access-Control-Request-Headers"
        ],
        exposedHeaders: ["Content-Length", "X-Content-Type-Options"],
        optionsSuccessStatus: 200, // Support legacy browsers
        preflightContinue: false,
      })
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP, please try again later.",
    });
    
    // More permissive rate limiting for video endpoints
    const videoLimiter = rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 500, // Allow more requests for video streaming
      message: "Too many video requests from this IP, please try again later.",
    });
    
    this.app.use("/api/video", videoLimiter);
    this.app.use("/api/", limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Static file serving with security headers
    this.app.use(
      "/storage",
      express.static(path.join(__dirname, "../storage"), {
        setHeaders: (res, filePath) => {
          // Set security headers for video files
          res.set({
            "Cache-Control": "private, max-age=3600",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          });
          
          // Set correct MIME type for HLS segments
          if (filePath.endsWith('.ts')) {
            res.set('Content-Type', 'video/mp2t');
          } else if (filePath.endsWith('.m3u8')) {
            res.set('Content-Type', 'application/vnd.apple.mpegurl');
          }
        },
      })
    );

    // BetterAuth middleware
    this.app.use("/api/auth", auth.handler);

    // Custom security headers for video content
    this.app.use("/api/video", (req, res, next) => {
      // More permissive headers for key endpoint
      if (req.path.startsWith('/key/')) {
        res.set({
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "Cache-Control": "private, max-age=3600", // Allow caching for keys
          "Access-Control-Allow-Origin": req.headers.origin || "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma",
        });
      } else {
        res.set({
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        });
      }
      next();
    });

    // Custom CORS headers for lessons route (especially for file uploads)
    this.app.use("/api/lessons", (req, res, next) => {
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        res.set({
          "Access-Control-Allow-Origin": req.headers.origin || "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400", // 24 hours
        });
        res.status(200).end();
        return;
      }
      
      // Set headers for actual requests
      res.set({
        "Access-Control-Allow-Origin": req.headers.origin || "*",
        "Access-Control-Allow-Credentials": "true",
      });
      
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get("/health", (req, res) => {
      res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env["NODE_ENV"] || "development",
      });
    });

    // API routes
    this.app.use("/api/video", videoRoutes);
    this.app.use("/api/lessons", lessonRoutes);

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        message: "Route not found",
        path: req.originalUrl,
      });
    });
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use((err: any, req: any, res: any, next: any) => {
      console.error("Global error:", err);

      // Handle specific error types
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error",
          errors: Object.values(err.errors).map((e: any) => e.message),
        });
      }

      if (err.name === "CastError") {
        return res.status(400).json({
          message: "Invalid ID format",
        });
      }

      if (err.code === 11000) {
        return res.status(409).json({
          message: "Duplicate entry error",
        });
      }

      // Default error response
      res.status(err.status || 500).json({
        message: err.message || "Internal server error",
        ...(process.env["NODE_ENV"] === "development" && { stack: err.stack }),
      });
    });
  }

  private initializeCronJobs(): void {
    // Clean up expired video tokens every hour
    cron.schedule("0 * * * *", async () => {
      try {
        console.log("Running cleanup job...");
        // Add cleanup logic here if needed
      } catch (error) {
        console.error("Cleanup job error:", error);
      }
    });

    // Log system health every 30 minutes
    cron.schedule("*/30 * * * *", () => {
      console.log("System health check:", {
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      });
    });
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDB();

      // Initialize video processing service
      await VideoProcessingService.initialize();

      // Initialize cron jobs
      this.initializeCronJobs();

      // Start server
      this.app.listen(this.PORT, () => {
        console.log(`🚀 LMS Server running on port ${this.PORT}`);
        console.log(
          `📱 Environment: ${process.env["NODE_ENV"] || "development"}`
        );
        console.log(
          `🔐 Frontend URL: ${
            process.env["FRONTEND_URL"] || "http://localhost:3000"
          }`
        );
      });

      // Graceful shutdown
      process.on("SIGTERM", this.gracefulShutdown);
      process.on("SIGINT", this.gracefulShutdown);
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  private gracefulShutdown = async (signal: string): Promise<void> => {
    console.log(`Received ${signal}. Starting graceful shutdown...`);

    // Close database connections and cleanup
    process.exit(0);
  };
}

// Start the server
const server = new Server();
server.start().catch((error) => {
  console.error("Server startup error:", error);
  process.exit(1);
});
