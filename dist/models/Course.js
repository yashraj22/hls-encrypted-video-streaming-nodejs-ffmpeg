import mongoose, { Schema } from 'mongoose';
const courseSchema = new Schema({
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
        maxlength: 1000
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'INR']
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    isFree: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    tags: [{
            type: String,
            trim: true
        }],
    duration: {
        type: Number,
        default: 0
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    lessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        }],
    enrolledStudents: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ difficulty: 1 });
courseSchema.index({ price: 1 });
export default mongoose.model('Course', courseSchema);
//# sourceMappingURL=Course.js.map