import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface VideoData {
  video: string;
  thumb: string;
  title: string;
}

interface DataFile {
  videos: VideoData[];
}

export async function updateJsonData(title: string, videoPath: string, thumbPath: string): Promise<void> {
  const dataFilePath = path.join(__dirname, '..', '..', 'public', 'data.json');
  const data: DataFile = fs.readJsonSync(dataFilePath);

  data.videos.push({
    video: videoPath,
    thumb: thumbPath,
    title,
  });

  fs.writeJsonSync(dataFilePath, data, { spaces: 2 });
}