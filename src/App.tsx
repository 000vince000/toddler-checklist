import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import TaskPrompt from './components/TaskPrompt';
import Roadmap from './components/Roadmap';
import TouchControls from './components/common/TouchControls';
import ProgressIndicator from './components/feedback/ProgressIndicator';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#FFC107',
    },
  },
  typography: {
    fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TaskPrompt />} />
          <Route path="/roadmap" element={<Roadmap />} />
        </Routes>
        <TouchControls />
        <ProgressIndicator />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 