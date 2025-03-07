import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { UnlockedAchievement } from '../../types/Achievement';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { AchievementManager } from '../../utils/AchievementManager';

interface AchievementsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function AchievementsDrawer({ open, onClose }: AchievementsDrawerProps) {
  const achievementManager = AchievementManager.getInstance();
  const achievements = achievementManager.getUnlockedAchievements();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 300,
          bgcolor: 'background.paper',
          p: 2
        }
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <EmojiEventsIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
        <Typography variant="h6" sx={{ mt: 1 }}>
          Achievements
        </Typography>
      </Box>

      <List>
        {achievements.length > 0 ? (
          achievements.map((achievement) => (
            <ListItem key={achievement.id}>
              <ListItemText
                primary={achievement.name}
                secondary={achievement.description}
                primaryTypographyProps={{
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText
              primary="No achievements yet!"
              secondary="Complete tasks to earn achievements"
              sx={{ textAlign: 'center' }}
            />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
} 