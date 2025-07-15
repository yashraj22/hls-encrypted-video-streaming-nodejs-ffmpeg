import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  description: string;
  course: mongoose.Types.ObjectId;
  order: number;
  duration: number; // in seconds
  videoUrl: string; // HLS playlist URL
  thumbnailUrl: string;
  isPublished: boolean;
  isFree: boolean;
  encryptionKey: string; // AES encryption key for video
  keyId: string; // Unique key identifier
  resources: {
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'link' | 'other';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: 1
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFree: {
    type: Boolean,
    default: false
  },
  encryptionKey: {
    type: String,
    required: true
  },
  keyId: {
    type: String,
    required: true,
    unique: true
  },
  resources: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['pdf', 'doc', 'link', 'other'],
      required: true
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
lessonSchema.index({ course: 1, order: 1 });
lessonSchema.index({ keyId: 1 });
lessonSchema.index({ isPublished: 1 });

export default mongoose.model<ILesson>('Lesson', lessonSchema);