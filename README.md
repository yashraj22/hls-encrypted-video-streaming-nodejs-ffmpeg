# HLS Video Streaming using Node.js and FFmpeg

This project demonstrates how to upload a video, convert it into HLS streaming segments using FFmpeg, and play the video using HLS.js. The project is built with Node.js, Express, and FFmpeg.

> Note: You don't need to download `ffmpeg` on your machine; as we are using npm packages for the binaries.

## File Structure

```
project
├── public
│   ├── videos            // Stores converted videos with FFmpeg
│   ├── data.json         // Stores video data
│   ├── index.html        // Upload and display videos
│   └── script.js         // Upload and render videos in HTML
├── temp-uploads
├── utils
│   ├── clearTempUploads.js // Clears temp-uploads directory
│   ├── ffmpeg-utils.js     // FFmpeg functions
│   └── updateJsonData.js   // Updates public/data.json file
└── server.js               // Backend APIs
```

## Prerequisites

- Node.js
- Basic Node and JavaScript Knowledge

Dependencies

- express: Web framework for Node.js.
- multer: Middleware for handling multipart/form-data, used for file uploads.
- fluent-ffmpeg: A fluent API to ffmpeg, a powerful media processing tool.
- ffmpeg-static: Static ffmpeg binaries for macOS, Linux, Windows.
- ffprobe-static: Static binaries for ffprobe.
- fs-extra: Module for filesystem operations.
- path: Node.js module for handling and transforming file paths.

## Installation

Follow these steps to install and run the application:

```bash
git clone https://github.com/sushantrahate/hls-video-streaming-nodejs-ffmpeg.git
cd hls-video-streaming-nodejs-ffmpeg
npm Install
npm run start
```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## Usage

- Navigate to [http://localhost:3000](http://localhost:3000) to upload a video.
- The video will be uploaded to the `temp-uploads` directory using Multer, then converted and segmented into the `public/videos` directory using ffmpeg. The metadata will be saved in `data.json`. The video will be rendered using an HLS player on the HTML page.

If you liked it then please show your love by ⭐ the repo
