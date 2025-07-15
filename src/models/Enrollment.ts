import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrolledAt: Date;
  completedLessons: mongoose.Types.ObjectId[];
  progress: number; // percentage
  lastAccessedLesson?: mongoose.Types.ObjectId;
  lastAccessedAt?: Date;
  isActive: boolean;
  completedAt?: Date;
  certificateIssued: boolean;
}

const enrollmentSchema = new Schema<IEnrollment>({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastAccessedLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    default: null
  },
  lastAccessedAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  completedAt: {
    type: Date,
    default: null
  },
  certificateIssued: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for unique enrollment per student-course pair
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ isActive: 1 });

export default mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);