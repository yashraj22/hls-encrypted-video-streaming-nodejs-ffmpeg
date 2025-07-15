import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare class VideoController {
    static getEncryptionKey(req: AuthRequest, res: Response): Promise<void>;
    static getVideoPlaylist(req: AuthRequest, res: Response): Promise<void>;
    static getVideoSegment(req: AuthRequest, res: Response): Promise<void>;
    static getVideoThumbnail(req: AuthRequest, res: Response): Promise<void>;
    static generateVideoToken(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=VideoController.d.ts.map