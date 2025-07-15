import mongoose, { Document } from 'mongoose';
export interface IEnrollment extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    enrolledAt: Date;
    completedLessons: mongoose.Types.ObjectId[];
    progress: number;
    lastAccessedLesson?: mongoose.Types.ObjectId;
    lastAccessedAt?: Date;
    isActive: boolean;
    completedAt?: Date;
    certificateIssued: boolean;
}
declare const _default: mongoose.Model<IEnrollment, {}, {}, {}, mongoose.Document<unknown, {}, IEnrollment, {}> & IEnrollment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Enrollment.d.ts.map