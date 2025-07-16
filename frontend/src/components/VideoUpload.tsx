import React, { useState } from 'react';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';

// TODO: Fetch the actual lessonId from backend for real use. For demo, set manually after seeding.
const LESSON_ID = 'seedkeyid'; // Use the seeded lesson's keyId or _id

const VideoUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setMessage('');
    setProgress(0);
    const formData = new FormData();
    formData.append('video', file);
    try {
      const res = await axios.post(`/api/lessons/${LESSON_ID}/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
        },
        withCredentials: true,
      });
      setMessage('Upload successful!');
    } catch (err: any) {
      setMessage('Upload failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Upload Video (Instructor)
      </Typography>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
      {progress > 0 && <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />}
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default VideoUpload;