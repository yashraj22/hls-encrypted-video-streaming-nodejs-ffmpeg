import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map