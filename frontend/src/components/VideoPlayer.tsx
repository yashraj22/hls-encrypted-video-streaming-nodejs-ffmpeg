import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import Hls from "hls.js";

// Use the correct lesson _id from the backend
const LESSON_ID = "68775ee4f8422246a682efb6";

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!videoRef.current) return;
    const playlistUrl = `/api/video/stream/${LESSON_ID}`;
    let hls: Hls | null = null;
    const video = videoRef.current;

    const onVideoError = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      const errorObj = target.error;
      if (errorObj) {
        console.error("Video element error:", errorObj);
        setError(
          `Video element error: code ${errorObj.code} - ${
            errorObj.message || "No message"
          }`
        );
      } else {
        console.error("Unknown video element error", e);
        setError("Unknown video element error");
      }
    };

    video.addEventListener("error", onVideoError);

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(playlistUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event: string, data: any) => {
        console.error("Hls.js ERROR event:", { event, ...data });
        setError(
          `Hls.js error: ${data.type} - ${data.details} (fatal: ${data.fatal})`
        );
      });
      hls.on(Hls.Events.MANIFEST_PARSED, (event: string, data: any) => {
        console.log("Hls.js MANIFEST_PARSED:", data);
      });
      hls.on(Hls.Events.LEVEL_LOADED, (event: string, data: any) => {
        console.log("Hls.js LEVEL_LOADED:", data);
      });
      hls.on(Hls.Events.FRAG_LOADED, (event: string, data: any) => {
        console.log("Hls.js FRAG_LOADED:", data);
      });
      hls.on(Hls.Events.FRAG_DECRYPTED, (event: string, data: any) => {
        console.log("Hls.js FRAG_DECRYPTED:", data);
      });
      return () => {
        hls?.destroy();
        video.removeEventListener("error", onVideoError);
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = playlistUrl;
    }
    return () => {
      video.removeEventListener("error", onVideoError);
    };
  }, []);

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
