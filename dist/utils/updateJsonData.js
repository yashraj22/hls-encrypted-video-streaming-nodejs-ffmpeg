import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function updateJsonData(title, videoPath, thumbPath) {
    const dataFilePath = path.join(__dirname, '..', '..', 'public', 'data.json');
    const data = fs.readJsonSync(dataFilePath);
    data.videos.push({
        video: videoPath,
        thumb: thumbPath,
        title,
    });
    fs.writeJsonSync(dataFilePath, data, { spaces: 2 });
}
//# sourceMappingURL=updateJsonData.js.map