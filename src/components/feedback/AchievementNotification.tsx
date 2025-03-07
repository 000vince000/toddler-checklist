import { Snackbar, Alert, Box } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface AchievementNotificationProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export default function AchievementNotification({
  open,
  message,
  onClose,
}: AchievementNotificationProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        icon={<EmojiEventsIcon sx={{ color: '#FFD700' }} />}
        severity="success"
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          '& .MuiAlert-icon': {
            fontSize: 40,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {message}
        </Box>
      </Alert>
    </Snackbar>
  );
} 