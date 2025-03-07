import { Box, Typography, Paper } from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';

interface StatsOverlayProps {
  stats: {
    totalTasksCompleted: number;
    morningTasksCompleted: number;
    eveningTasksCompleted: number;
    dailyTasksCompleted: number;
  };
}

export default function StatsOverlay({ stats }: StatsOverlayProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          maxWidth: 200
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EqualizerIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" color="primary">
            Stats
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <StatItem
            label="Today's Tasks"
            value={stats.dailyTasksCompleted}
            total={6}
          />
          <StatItem
            label="Morning Tasks"
            value={stats.morningTasksCompleted}
            total={2}
          />
          <StatItem
            label="Evening Tasks"
            value={stats.eveningTasksCompleted}
            total={4}
          />
          <StatItem
            label="Total Completed"
            value={stats.totalTasksCompleted}
            showTotal={false}
          />
        </Box>
      </Paper>
    </Box>
  );
}

interface StatItemProps {
  label: string;
  value: number;
  total?: number;
  showTotal?: boolean;
}

function StatItem({ label, value, total, showTotal = true }: StatItemProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Typography variant="body2" fontWeight="bold" color="primary">
        {value}{showTotal && total ? `/${total}` : ''}
      </Typography>
    </Box>
  );
} 