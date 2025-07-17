import mongoose from "mongoose";
import User from "./models/User.ts";
import Course from "./models/Course.ts";
import Lesson from "./models/Lesson.ts";
import Enrollment from "./models/Enrollment.ts";

const MONGO_URI =
  process.env["MONGO_URI"] || "mongodb://localhost:27017/videolms";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await User.deleteMany({});
  await Course.deleteMany({});
  await Lesson.deleteMany({});
  await Enrollment.deleteMany({});

  // Create users
  const admin = await User.create({
    email: "admin@example.com",
    name: "Admin User",
    password: "password123",
    role: "admin",
    isActive: true,
    emailVerified: true,
  });
  const instructor = await User.create({
    email: "instructor@example.com",
    name: "Instructor User",
    password: "password123",
    role: "instructor",
    isActive: true,
    emailVerified: true,
  });
  const student = await User.create({
    email: "student@example.com",
    name: "Student User",
    password: "password123",
    role: "student",
    isActive: true,
    emailVerified: true,
  });

  // Create a course
  const course = await Course.create({
    title: "Sample Course",
    description: "A sample course for seeding.",
    instructor: instructor._id,
    thumbnail: "https://via.placeholder.com/300x200",
    price: 0,
    currency: "USD",
    isPublished: true,
    isFree: true,
    category: "General",
    tags: ["sample", "test"],
    duration: 60,
    difficulty: "beginner",
    lessons: [],
    enrolledStudents: [],
    rating: 0,
    reviewCount: 0,
  });

  // Create a lesson (no video, just metadata)
  const lesson = await Lesson.create({
    title: "Sample Lesson",
    description: "A sample lesson for seeding.",
    course: course._id,
    order: 1,
    duration: 300,
    videoUrl: "https://example.com/placeholder.m3u8", // Placeholder URL
    thumbnailUrl: "https://via.placeholder.com/300x200", // Placeholder thumbnail
    isPublished: true,
    isFree: true,
    encryptionKey: "bf13642711a34333986ad8bb5cc86159", // Valid 32-char hex string
    keyId: "seedkeyid",
    resources: [],
  });

  // Update course with lesson
  course.lessons.push(lesson._id as mongoose.Types.ObjectId);
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

  console.log("Seed data created!");
  await mongoose.disconnect();
}

if (process.argv.includes("--show-lesson")) {
  const idx = process.argv.indexOf("--show-lesson");
  const lessonId = process.argv[idx + 1];
  if (!lessonId) {
    console.error("Usage: ts-node src/seed.ts --show-lesson <lessonId>");
    process.exit(1);
  }
  import("./models/Lesson.ts").then(async ({ default: Lesson }) => {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      console.log("Lesson not found");
    } else {
      console.log("Lesson:", JSON.stringify(lesson, null, 2));
    }
    process.exit(0);
  });
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
