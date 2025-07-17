import React, { useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import VideoUpload from './components/VideoUpload';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const [view, setView] = useState<'upload' | 'play'>('upload');

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            LMS Demo
          </Typography>
          <Button color="inherit" onClick={() => setView('upload')}>
            Upload Video
          </Button>
          <Button color="inherit" onClick={() => setView('play')}>
            Play Video
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {view === 'upload' ? <VideoUpload /> : <VideoPlayer />}
      </Container>
    </>
  );
}

export default App;