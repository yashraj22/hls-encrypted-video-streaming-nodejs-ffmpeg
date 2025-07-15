import mongoose, { Schema } from 'mongoose';
const lessonSchema = new Schema({
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
lessonSchema.index({ course: 1, order: 1 });
lessonSchema.index({ keyId: 1 });
lessonSchema.index({ isPublished: 1 });
export default mongoose.model('Lesson', lessonSchema);
//# sourceMappingURL=Lesson.js.map