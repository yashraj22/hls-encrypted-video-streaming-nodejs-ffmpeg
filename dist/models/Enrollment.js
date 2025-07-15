import mongoose, { Schema } from 'mongoose';
const enrollmentSchema = new Schema({
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
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ isActive: 1 });
export default mongoose.model('Enrollment', enrollmentSchema);
//# sourceMappingURL=Enrollment.js.map