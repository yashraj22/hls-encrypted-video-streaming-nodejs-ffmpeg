import mongoose, { Document } from 'mongoose';
export interface ICourse extends Document {
    title: string;
    description: string;
    instructor: mongoose.Types.ObjectId;
    thumbnail: string;
    price: number;
    currency: string;
    isPublished: boolean;
    isFree: boolean;
    category: string;
    tags: string[];
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    lessons: mongoose.Types.ObjectId[];
    enrolledStudents: mongoose.Types.ObjectId[];
    rating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICourse, {}, {}, {}, mongoose.Document<unknown, {}, ICourse, {}> & ICourse & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Course.d.ts.map