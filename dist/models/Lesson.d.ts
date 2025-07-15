import mongoose, { Document } from 'mongoose';
export interface ILesson extends Document {
    title: string;
    description: string;
    course: mongoose.Types.ObjectId;
    order: number;
    duration: number;
    videoUrl: string;
    thumbnailUrl: string;
    isPublished: boolean;
    isFree: boolean;
    encryptionKey: string;
    keyId: string;
    resources: {
        name: string;
        url: string;
        type: 'pdf' | 'doc' | 'link' | 'other';
    }[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ILesson, {}, {}, {}, mongoose.Document<unknown, {}, ILesson, {}> & ILesson & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Lesson.d.ts.map