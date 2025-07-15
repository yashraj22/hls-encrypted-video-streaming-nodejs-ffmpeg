export interface ProcessingResult {
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
    keyId: string;
    encryptionKey: string;
}
export declare class VideoProcessingService {
    private static readonly STORAGE_PATH;
    private static readonly KEYS_PATH;
    static initialize(): Promise<void>;
    static generateEncryptionKey(): {
        key: string;
        keyId: string;
    };
    static saveEncryptionKey(keyId: string, key: string): Promise<string>;
    static processVideo(filePath: string, lessonId: string, title: string): Promise<ProcessingResult>;
    private static getVideoDuration;
    private static generateThumbnail;
    private static generateEncryptedHLS;
    static deleteVideo(lessonId: string): Promise<void>;
    static getKeyPath(keyId: string): Promise<string>;
    static validateVideoAccess(userId: string, lessonId: string): Promise<boolean>;
}
export default VideoProcessingService;
//# sourceMappingURL=VideoProcessingService.d.ts.map