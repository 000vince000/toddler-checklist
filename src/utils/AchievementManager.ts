import { Achievement } from '../types/Achievement';

export class AchievementManager {
  private static instance: AchievementManager;
  private unlockedAchievements: Achievement[] = [];

  private constructor() {}

  public static getInstance(): AchievementManager {
    if (!AchievementManager.instance) {
      AchievementManager.instance = new AchievementManager();
    }
    return AchievementManager.instance;
  }

  public checkAchievements(stats: any): Achievement[] {
    const newAchievements: Achievement[] = [];
    
    // Define achievement conditions
    const achievements = [
      {
        id: 'first_task',
        name: 'First Step!',
        description: 'Complete your first task',
        condition: (stats: any) => stats.totalTasksCompleted >= 1
      },
      {
        id: 'morning_master',
        name: 'Morning Master',
        description: 'Complete all morning tasks',
        condition: (stats: any) => stats.morningTasksCompleted >= 2
      },
      {
        id: 'evening_expert',
        name: 'Evening Expert',
        description: 'Complete all evening tasks',
        condition: (stats: any) => stats.eveningTasksCompleted >= 4
      },
      {
        id: 'perfect_day',
        name: 'Perfect Day',
        description: 'Complete all tasks in one day',
        condition: (stats: any) => stats.dailyTasksCompleted >= 6
      }
    ];

    // Check each achievement
    achievements.forEach(achievement => {
      if (
        achievement.condition(stats) && 
        !this.unlockedAchievements.some(a => a.id === achievement.id)
      ) {
        newAchievements.push(achievement);
        this.unlockedAchievements.push(achievement);
      }
    });

    return newAchievements;
  }

  public getUnlockedAchievements(): Achievement[] {
    return [...this.unlockedAchievements];
  }

  public resetAchievements(): void {
    this.unlockedAchievements = [];
  }
} 