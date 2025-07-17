import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import Hls from "hls.js";

// Use the correct lesson _id from the backend
const LESSON_ID = "6877bc07e4e52f7c19d4a7ba";

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const cleanup = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playlistUrl = `/api/video/stream/${LESSON_ID}`;
    
    const onVideoError = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      const errorObj = target.error;
      if (errorObj) {
        console.error("Video element error:", errorObj);
        setError(`Video element error: code ${errorObj.code} - ${errorObj.message || "No message"}`);
      } else {
        console.error("Unknown video element error", e);
        setError("Unknown video element error");
      }
      setIsLoading(false);
    };

    video.addEventListener("error", onVideoError);

    if (Hls.isSupported()) {
      // Clean up any existing HLS instance
      cleanup();
      
      hlsRef.current = new Hls({
        debug: true,
        enableWorker: true,
        lowLatencyMode: false,
        startLevel: -1,
        capLevelToPlayerSize: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 3,
        maxFragLookUpTolerance: 0.25,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        enableSoftwareAES: true,
        enableWebVTT: false,
        enableCEA708Captions: false,
        stretchShortVideoTrack: true,
        maxAudioFramesDrift: 1,
        forceKeyFrameOnDiscontinuity: true,
        abrEwmaFastLive: 3.0,
        abrEwmaSlowLive: 9.0,
        abrEwmaFastVoD: 3.0,
        abrEwmaSlowVoD: 9.0,
        abrEwmaDefaultEstimate: 500000,
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.7,
        abrMaxWithRealBitrate: false,
        maxStarvationDelay: 4,
        maxLoadingDelay: 4,
        minAutoBitrate: 0,
        emeEnabled: false,
        widevineLicenseUrl: undefined,
        requestMediaKeySystemAccessFunc: undefined,
        // Basic retry configuration - reduced to prevent infinite loops
        fragLoadingMaxRetry: 2,
        fragLoadingMaxRetryTimeout: 10000,
        fragLoadingRetryDelay: 1000,
        manifestLoadingMaxRetry: 2,
        manifestLoadingMaxRetryTimeout: 10000,
        manifestLoadingRetryDelay: 1000,
        levelLoadingMaxRetry: 2,
        levelLoadingMaxRetryTimeout: 10000,
        levelLoadingRetryDelay: 1000,
        xhrSetup: function(xhr, url) {
          console.log('XHR request to:', url);
          xhr.setRequestHeader('Cache-Control', 'no-cache');
          xhr.setRequestHeader('Pragma', 'no-cache');
        },
      });
      
      const hls = hlsRef.current;
      
      // Set up error handling
      hls.on(Hls.Events.ERROR, (event: string, data: any) => {
        console.error("Hls.js ERROR event:", { event, ...data });
        
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Network error, trying to recover...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error, trying to recover...");
              hls.recoverMediaError();
              break;
            default:
              console.log("Fatal error, destroying HLS instance");
              setError(`Fatal HLS error: ${data.type} - ${data.details}`);
              setIsLoading(false);
              break;
          }
        } else {
          // For non-fatal errors, log them but don't show to user
          console.log(`Non-fatal HLS error: ${data.type} - ${data.details}`);
          
          // Special handling for key loading errors
          if (data.details === 'keyLoadError') {
            console.error('Key loading error:', data);
            setError('Failed to load encryption key. Please check server configuration.');
            setIsLoading(false);
            return;
          }
          
          // Special handling for fragment parsing errors
          if (data.details === 'fragParsingError') {
            console.log(`Fragment parsing error for: ${data.frag?.url || 'unknown fragment'}`);
            if (data.frag) {
              console.log(`Fragment details:`, {
                url: data.frag.url,
                sn: data.frag.sn,
                level: data.frag.level,
                start: data.frag.start,
                duration: data.frag.duration
              });
            }
          }
          
          // If too many fragment load errors, stop retrying
          if (data.details === 'fragLoadError' && data.frag?.loadCounter > 3) {
            console.error('Too many fragment load errors, stopping playback');
            setError('Failed to load video segments. Please try again.');
            setIsLoading(false);
            hls.destroy();
          }
        }
      });
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Manifest parsed successfully");
        setIsLoading(false);
      });
      
      hls.on(Hls.Events.LEVEL_LOADED, (event: string, data: any) => {
        console.log("Level loaded:", data);
      });
      
      hls.on(Hls.Events.FRAG_LOADED, (event: string, data: any) => {
        console.log("Fragment loaded:", data.frag.url);
      });
      
      hls.on(Hls.Events.FRAG_PARSED, (event: string, data: any) => {
        console.log("Fragment parsed successfully:", data.frag.url);
      });
      
      hls.loadSource(playlistUrl);
      hls.attachMedia(video);
      
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = playlistUrl;
      setIsLoading(false);
    } else {
      setError("HLS is not supported in this browser");
      setIsLoading(false);
    }

    return () => {
      video.removeEventListener("error", onVideoError);
      cleanup();
    };
  }, [cleanup]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Play Video (Student)
      </Typography>
      {isLoading && <Typography>Loading video...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <video 
        ref={videoRef} 
        controls 
        width="100%" 
        style={{ maxWidth: 600 }} 
        preload="metadata"
      />
    </Box>
  );
};

export default VideoPlayer;
