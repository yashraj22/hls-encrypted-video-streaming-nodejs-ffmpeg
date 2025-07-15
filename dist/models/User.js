import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new Schema({
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
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods['comparePassword'] = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this['password']);
};
userSchema.methods['toJSON'] = function () {
    const user = this['toObject']();
    delete user.password;
    return user;
};
export default mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map