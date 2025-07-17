# 🎓 Learning Management System (LMS) Backend

A secure, scalable Learning Management System backend built with Node.js, Express, TypeScript, MongoDB, and FFmpeg. Features encrypted video streaming, user authentication, and comprehensive course management.

## 🚀 Features

### 🔐 Security & Authentication
- **BetterAuth Integration**: Secure user authentication with email verification
- **Role-based Access Control**: Student, Instructor, and Admin roles
- **Encrypted Video Streaming**: AES-128 HLS encryption for video protection
- **JWT-based Video Tokens**: Time-limited access tokens for video content
- **Rate Limiting**: Prevents API abuse and DDoS attacks
- **Security Headers**: Comprehensive security headers for all endpoints

### 📹 Video Management
- **Secure Video Upload**: Multi-format video support with validation
- **HLS Streaming**: Adaptive bitrate streaming with encryption
- **Video Processing**: Automatic transcoding and thumbnail generation
- **Access Control**: User enrollment validation for video access
- **Anti-Piracy**: Prevents screen recording and unauthorized downloads

### 🎯 Course Management
- **Course Creation**: Full CRUD operations for courses
- **Lesson Management**: Structured lesson organization
- **Progress Tracking**: Student progress monitoring
- **Enrollment System**: Automated course enrollment management

### 📊 Analytics & Monitoring
- **Health Checks**: System health monitoring
- **Cron Jobs**: Automated cleanup and maintenance
- **Error Handling**: Comprehensive error logging and handling

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **MongoDB**: Version 5.0 or higher
- **FFmpeg**: For video processing
- **Redis**: (Optional) For session storage

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lms-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Build the project**
   ```bash
   npm run build
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🏗️ Project Structure

```
src/
├── config/
│   ├── auth.ts           # BetterAuth configuration
│   └── database.ts       # MongoDB connection
├── controllers/
│   ├── LessonController.ts    # Lesson management
│   └── VideoController.ts     # Video streaming
├── middleware/
│   └── auth.ts           # Authentication middleware
├── models/
│   ├── User.ts           # User schema
│   ├── Course.ts         # Course schema
│   ├── Lesson.ts         # Lesson schema
│   └── Enrollment.ts     # Enrollment schema
├── routes/
│   ├── video.ts          # Video streaming routes
│   └── lessons.ts        # Lesson management routes
├── services/
│   └── VideoProcessingService.ts  # Video processing
├── types/
│   └── ffprobe-static.d.ts      # Type definitions
└── server.ts             # Main server file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment | No (default: development) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT secret key | Yes |
| `BETTER_AUTH_SECRET` | BetterAuth secret | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `SMTP_HOST` | SMTP server host | Yes |
| `SMTP_PORT` | SMTP server port | Yes |
| `SMTP_USER` | SMTP username | Yes |
| `SMTP_PASS` | SMTP password | Yes |

### Database Models

#### User Model
```typescript
interface IUser {
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  enrolledCourses: ObjectId[];
  createdCourses: ObjectId[];
  // ... other fields
}
```

#### Course Model
```typescript
interface ICourse {
  title: string;
  description: string;
  instructor: ObjectId;
  lessons: ObjectId[];
  enrolledStudents: ObjectId[];
  // ... other fields
}
```

#### Lesson Model
```typescript
interface ILesson {
  title: string;
  course: ObjectId;
  videoUrl: string;
  encryptionKey: string;
  keyId: string;
  // ... other fields
}
```

## 🛡️ Security Features

### Video Protection
- **HLS Encryption**: All video content is encrypted using AES-128
- **Key Rotation**: Unique encryption keys for each video
- **Access Tokens**: Time-limited JWT tokens for video access
- **Enrollment Validation**: Only enrolled users can access content
- **Domain Restrictions**: Videos can only be played on authorized domains

### API Security
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Strict CORS policy
- **Security Headers**: Comprehensive security headers
- **Input Validation**: All inputs are validated and sanitized

## 📡 API Endpoints

### Authentication
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session

### Lessons
- `POST /api/lessons` - Create lesson (Instructor only)
- `GET /api/lessons/:id` - Get lesson details
- `PUT /api/lessons/:id` - Update lesson (Instructor only)
- `DELETE /api/lessons/:id` - Delete lesson (Instructor only)
- `POST /api/lessons/:id/video` - Upload video (Instructor only)
- `GET /api/lessons/course/:courseId` - Get course lessons

### Video Streaming
- `GET /api/video/stream/:lessonId` - Get video playlist (HLS)
- `GET /api/video/key/:keyId` - Get decryption key
- `GET /api/video/segment/:lessonId/:segment` - Get video segment
- `GET /api/video/thumbnail/:lessonId` - Get video thumbnail
- `POST /api/video/token/:lessonId` - Generate video access token

## 🎮 Usage Examples

### Frontend Integration (React)

```typescript
// Video Player Component
import { useEffect, useState } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ lessonId, token }) => {
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (Hls.isSupported() && video) {
      const hls = new Hls({
        xhrSetup: (xhr) => {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
      });
      
      hls.loadSource(`/api/video/stream/${lessonId}`);
      hls.attachMedia(video);
      
      return () => hls.destroy();
    }
  }, [lessonId, token, video]);

  return (
    <video
      ref={setVideo}
      controls
      width="100%"
      height="400"
      onContextMenu={(e) => e.preventDefault()} // Prevent right-click
    />
  );
};
```

### Video Upload

```typescript
const uploadVideo = async (lessonId: string, file: File) => {
  const formData = new FormData();
  formData.append('video', file);
  
  const response = await fetch(`/api/lessons/${lessonId}/video`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

## 🔍 Monitoring & Health Checks

### Health Check
```bash
curl http://localhost:3000/health
```

### System Metrics
The server automatically logs system health every 30 minutes including:
- Memory usage
- Uptime
- Database connection status

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY keys ./keys
COPY storage ./storage

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### Production Considerations

1. **Environment Variables**: Use secure secrets management
2. **Database**: Use MongoDB Atlas or replica set
3. **Storage**: Use cloud storage for videos (AWS S3, Google Cloud)
4. **CDN**: Use CDN for video delivery
5. **Load Balancing**: Use load balancer for high availability
6. **Monitoring**: Set up monitoring and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

1. **Video Processing Fails**
   - Check FFmpeg installation
   - Verify video format support
   - Check disk space

2. **Authentication Issues**
   - Verify JWT_SECRET configuration
   - Check BetterAuth setup
   - Validate MongoDB connection

3. **Video Playback Issues**
   - Ensure HLS.js is loaded
   - Check network connectivity
   - Verify user enrollment

### Debug Mode
```bash
NODE_ENV=development npm run dev
```

## 📞 Support

For support, please create an issue in the GitHub repository or contact the development team.

---

Built with ❤️ for secure online learning.

## Seeding the Database

To seed the database with sample users, courses, lessons, and enrollments, run:

```
npm run seed
```

This will clear existing data and insert new sample data for testing.

## Frontend

A basic frontend will be provided in the `frontend/` directory. See its README for setup and usage instructions.
