import VideoProcessingService from './src/services/VideoProcessingService.js';

async function testEncryption() {
    try {
        console.log('Initializing VideoProcessingService...');
        await VideoProcessingService.initialize();
        
        console.log('Processing video with encryption...');
        const result = await VideoProcessingService.processVideo(
            'temp-uploads/test-video.mp4',
            '6877bc07e4e52f7c19d4a7ba',
            'Test Video with Encryption'
        );
        
        console.log('Processing completed successfully!');
        console.log('Video URL:', result.videoUrl);
        console.log('Thumbnail URL:', result.thumbnailUrl);
        console.log('Duration:', result.duration);
        console.log('Key ID:', result.keyId);
        console.log('Encryption Key:', result.encryptionKey);
        
    } catch (error) {
        console.error('Error processing video:', error);
    }
}

testEncryption();
