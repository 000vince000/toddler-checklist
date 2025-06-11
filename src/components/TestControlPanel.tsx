import React from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { Task } from '../types/Task';

interface TestControlPanelProps {
  tasks: Task[];
  onTimeChange: (time: string) => void;
  onTaskTrigger: (taskId: string) => void;
  currentTime: string;
}

const TestControlPanel: React.FC<TestControlPanelProps> = ({ 
  tasks, 
  onTimeChange, 
  onTaskTrigger,
  currentTime 
}) => {
  return (
    <Paper 
      elevation={3}
      sx={{ 
        position: 'fixed', 
        top: 16, 
        right: 16, 
        p: 2, 
        bgcolor: 'rgba(255,255,255,0.95)',
        zIndex: 1000,
        maxWidth: 300,
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Test Mode Controls
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Current Time: {currentTime}
        </Typography>
        <TextField
          type="time"
          label="Set Time"
          onChange={(e) => onTimeChange(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        />
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Trigger Tasks:
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {tasks.map(task => (
          <Button
            key={task.id}
            variant="outlined"
            size="small"
            onClick={() => onTaskTrigger(task.id)}
            sx={{ justifyContent: 'flex-start' }}
          >
            {task.name} ({task.startTime}-{task.endTime})
          </Button>
        ))}
      </Box>
    </Paper>
  );
};

export default TestControlPanel; 