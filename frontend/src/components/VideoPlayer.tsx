import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Hls from 'hls.js';
import axios from 'axios';

// TODO: Fetch the actual lessonId from backend for real use. For demo, set manually after seeding.
const LESSON_ID = 'seedkeyid'; // Use the seeded lesson's keyId or _id

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get video access token
    axios.post(`/api/video/token/${LESSON_ID}`, {}, { withCredentials: true })
      .then(res => setToken(res.data.token))
      .catch(err => setError('Failed to get video token: ' + (err.response?.data?.message || err.message)));
  }, []);

  useEffect(() => {
    if (!token || !videoRef.current) return;
    const playlistUrl = `/api/video/stream/${LESSON_ID}?token=${token}`;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(playlistUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.ERROR, (event, data) => {
        setError('Video playback error: ' + data.details);
      });
      return () => {
        hls.destroy();
      };
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = playlistUrl;
    }
  }, [token]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Play Video (Student)
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <video ref={videoRef} controls width="100%" style={{ maxWidth: 600 }} />
    </Box>
  );
};

export default VideoPlayer;