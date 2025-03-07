import * as React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useTaskContext } from '../../context/TaskContext';

export default function ProgressIndicator() {
  const { taskStatuses } = useTaskContext();
  
  const completedTasks = taskStatuses.filter(t => t.status === 'checked').length;
  const progress = (completedTasks / taskStatuses.length) * 100;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="body2" align="center" gutterBottom>
        Daily Progress
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 10,
          borderRadius: 5,
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
          },
        }}
      />
      <Typography variant="caption" align="center" sx={{ mt: 1, display: 'block' }}>
        {completedTasks} of {taskStatuses.length} tasks completed
      </Typography>
    </Box>
  );
} 