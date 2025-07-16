import React, { useState } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import axios from "axios";

// Use the correct lesson _id from the backend
const LESSON_ID = "68775ee4f8422246a682efb6";
const BACKEND_URL = "http://localhost:3000";

const VideoUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setMessage("");
    setProgress(0);
    const formData = new FormData();
    formData.append("video", file);
    console.log("Uploading file:", file);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/lessons/${LESSON_ID}/video`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
          },
        }
      );
      setMessage("Upload successful!");
    } catch (err: any) {
      setMessage(
        "Upload failed: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Upload Video (Instructor)
      </Typography>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleUpload}
        disabled={!file}
      >
        Upload
      </Button>
      {progress > 0 && (
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
      )}
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default VideoUpload;
