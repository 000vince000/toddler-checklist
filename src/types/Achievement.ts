export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: any) => boolean;
  reward?: string;
}

export interface TaskStats {
  totalCompleted: number;
  streak: number;
  dailyCompletions: number;
  weeklyCompletions: number;
  taskTypeCompletions: Record<string, number>;
}

export interface UnlockedAchievement extends Achievement {
  unlockedAt: string;
} 