# ES Module & TypeScript Conversion

This repository has been successfully converted from CommonJS to ES modules and TypeScript.

## Changes Made

### 1. Package Configuration
- Added `"type": "module"` to `package.json` to enable ES modules
- Updated main entry point to `"dist/server.js"`
- Added TypeScript dependencies and type definitions
- Updated scripts for development and building

### 2. Project Structure
```
src/
├── server.ts              # Main server file (converted from server.js)
├── utils/
│   ├── clearTempUploads.ts    # Utility for clearing temp uploads
│   ├── ffmpeg-utils.ts        # FFmpeg processing utilities
│   └── updateJsonData.ts      # JSON data update utility
└── types/
    └── ffprobe-static.d.ts    # Type definitions for ffprobe-static
```

### 3. Code Changes
- All `require()` statements converted to `import` statements
- All `module.exports` converted to `export` statements
- Added proper TypeScript types for all functions and variables
- Added ES module compatibility for `__dirname` and `__filename`
- Added comprehensive type definitions for Express middleware

### 4. TypeScript Configuration
- Created `tsconfig.json` with ES2022 target and strict typing
- Configured source maps and declaration files
- Set up proper module resolution for ES modules

## Development

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```
This runs the TypeScript server directly with `ts-node-esm`.

### Build for Production
```bash
npm run build
```
This compiles TypeScript to JavaScript in the `dist/` directory.

### Start Production Server
```bash
npm start
```
This runs the compiled JavaScript from `dist/server.js`.

## API Endpoints

### POST /upload
Upload and process video files for HLS streaming.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: 
  - `video`: Video file (required)
  - `title`: Video title (optional)
  - `date`: Video date (optional)
  - `info`: Video description (optional)

**Response:**
```json
{
  "message": "Video uploaded and converted successfully."
}
```

### GET /data
Get the list of processed videos.

**Response:**
```json
{
  "videos": [
    {
      "video": "videos/title/index.m3u8",
      "thumb": "videos/title/thumbnail.webp",
      "title": "Video Title"
    }
  ]
}
```

## Features

- **ES Modules**: Modern JavaScript module system
- **TypeScript**: Full type safety and IntelliSense support
- **HLS Streaming**: Converts videos to HTTP Live Streaming format
- **Thumbnail Generation**: Creates WebP thumbnails for videos
- **Express Server**: RESTful API for video upload and management
- **FFmpeg Integration**: Uses FFmpeg for video processing
- **Automatic Cleanup**: Clears temporary uploads on startup

## File Processing

1. Video files are uploaded to `temp-uploads/` directory
2. FFmpeg processes the video to create HLS segments
3. Thumbnails are generated in WebP format
4. Processed files are stored in `public/videos/[title]/`
5. Video metadata is updated in `public/data.json`
6. Temporary files are automatically cleaned up

## Dependencies

### Runtime Dependencies
- `express`: Web framework
- `multer`: File upload middleware
- `fluent-ffmpeg`: FFmpeg wrapper
- `ffmpeg-static`: Static FFmpeg binary
- `ffprobe-static`: Static FFprobe binary
- `fs-extra`: Enhanced file system operations

### Development Dependencies
- `typescript`: TypeScript compiler
- `ts-node`: TypeScript execution for Node.js
- `@types/*`: Type definitions for libraries

## Browser Compatibility

The generated ES modules are compatible with modern browsers and Node.js environments that support ES2022 features.

## Build Output

The build process generates:
- Compiled JavaScript files in `dist/`
- Type declaration files (`.d.ts`)
- Source maps for debugging

## Migration Notes

- All file imports now use `.js` extensions (required for ES modules)
- `__dirname` and `__filename` are manually created using `import.meta.url`
- Strict TypeScript settings ensure type safety
- Module resolution follows Node.js ES module standards