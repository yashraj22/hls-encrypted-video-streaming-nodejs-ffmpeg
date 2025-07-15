import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function clearTempUploads(): Promise<void> {
  try {
    await fs.emptyDir(path.join(__dirname, '..', '..', 'temp-uploads'));
    console.log('Temp-uploads directory cleared.');
  } catch (err) {
    console.error('Error clearing temp-uploads directory:', err);
  }
}