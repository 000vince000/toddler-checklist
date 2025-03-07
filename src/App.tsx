import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import TaskPrompt from './components/TaskPrompt';
import Roadmap from './components/Roadmap';
import TouchControls from './components/common/TouchControls';
import { TaskProvider } from './context/TaskContext';

// Create a navigation wrapper component
function NavigationWrapper() {
  const navigate = useNavigate();

  // Memoize the navigation function to prevent unnecessary re-renders
  const handleNavigate = React.useCallback((path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
  }, [navigate]);

  return (
    <TaskProvider onNavigate={handleNavigate}>
      <Routes>
        <Route path="/prompt" element={<TaskPrompt />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/" element={<Navigate to="/prompt" replace />} />
      </Routes>
      <TouchControls />
    </TaskProvider>
  );
}

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
      <Router>
        <NavigationWrapper />
      </Router>
    </ThemeProvider>
  );
}

export default App; 