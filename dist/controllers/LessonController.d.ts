import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare class LessonController {
    static createLesson(req: AuthRequest, res: Response): Promise<void>;
    static uploadVideo(req: AuthRequest, res: Response): Promise<void>;
    static getLesson(req: AuthRequest, res: Response): Promise<void>;
    static updateLesson(req: AuthRequest, res: Response): Promise<void>;
    static deleteLesson(req: AuthRequest, res: Response): Promise<void>;
    static getCourseLessons(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=LessonController.d.ts.map