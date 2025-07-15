import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { clearTempUploads } from './utils/clearTempUploads.js';
import { generateThumbnail, generateVideoSegments } from './utils/ffmpeg-utils.js';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const upload = multer({ dest: 'temp-uploads/' });

app.use(express.static('public'));
app.use('/videos', express.static(path.join(__dirname, '..', 'public', 'videos')));
app.use(express.json());

// Clear temp-uploads directory on server startup for half finished upload.
clearTempUploads();

interface UploadRequestBody {
  title?: string;
  date?: string;
  info?: string;
}

app.post('/upload', upload.single('video'), async (req: Request<{}, {}, UploadRequestBody>, res: Response): Promise<void> => {
  if (!req.file) {
    res
      .status(400)
      .json({ message: 'No file selected. Please select a file to upload.' });
    return;
  }

  let { title, date, info } = req.body;
  const filePath = req.file.path;

  console.log(title);

  if (!date) date = '';
  if (!title) title = path.parse(req.file.originalname).name;
  if (!info) info = '';

  const outputDir = path.join(__dirname, '..', 'public', 'videos', title);
  await fs.ensureDir(outputDir);

  try {
    await generateThumbnail(filePath, outputDir);
    await generateVideoSegments(filePath, outputDir, title, res);
  } catch (error) {
    res.status(500).json({ message: 'Error processing video.' });
  }
});

app.get('/data', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'data.json'));
});

const PORT = process.env['PORT'] || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});