import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: 'student' | 'instructor' | 'admin';
  isActive: boolean;
  avatar?: string;
  enrolledCourses: mongoose.Types.ObjectId[];
  createdCourses: mongoose.Types.ObjectId[];
  lastLogin?: Date;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  createdCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  lastLogin: {
    type: Date,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods['comparePassword'] = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this['password']);
};

// Remove password from JSON output
userSchema.methods['toJSON'] = function() {
  const user = this['toObject']();
  delete user.password;
  return user;
};

export default mongoose.model<IUser>('User', userSchema);