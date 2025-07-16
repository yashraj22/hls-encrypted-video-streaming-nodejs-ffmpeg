import mongoose from 'mongoose';
import User from './models/User';
import Course from './models/Course';
import Lesson from './models/Lesson';
import Enrollment from './models/Enrollment';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Course.deleteMany({});
  await Lesson.deleteMany({});
  await Enrollment.deleteMany({});

  // Create users
  const admin = await User.create({
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'password123',
    role: 'admin',
    isActive: true,
    emailVerified: true,
  });
  const instructor = await User.create({
    email: 'instructor@example.com',
    name: 'Instructor User',
    password: 'password123',
    role: 'instructor',
    isActive: true,
    emailVerified: true,
  });
  const student = await User.create({
    email: 'student@example.com',
    name: 'Student User',
    password: 'password123',
    role: 'student',
    isActive: true,
    emailVerified: true,
  });

  // Create a course
  const course = await Course.create({
    title: 'Sample Course',
    description: 'A sample course for seeding.',
    instructor: instructor._id,
    thumbnail: 'https://via.placeholder.com/300x200',
    price: 0,
    currency: 'USD',
    isPublished: true,
    isFree: true,
    category: 'General',
    tags: ['sample', 'test'],
    duration: 60,
    difficulty: 'beginner',
    lessons: [],
    enrolledStudents: [],
    rating: 0,
    reviewCount: 0,
  });

  // Create a lesson (no video, just metadata)
  const lesson = await Lesson.create({
    title: 'Sample Lesson',
    description: 'A sample lesson for seeding.',
    course: course._id,
    order: 1,
    duration: 300,
    videoUrl: '',
    thumbnailUrl: '',
    isPublished: true,
    isFree: true,
    encryptionKey: 'seedkeyseedkeyseedkeyseedkey12',
    keyId: 'seedkeyid',
    resources: [],
  });

  // Update course with lesson
  course.lessons.push(lesson._id);
  await course.save();

  // Enroll student
  await Enrollment.create({
    student: student._id,
    course: course._id,
    enrolledAt: new Date(),
    completedLessons: [],
    progress: 0,
    isActive: true,
    certificateIssued: false,
  });

  console.log('Seed data created!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});