import { TaskStats } from '../types/Achievement';

export class StatsTracker {
  private static instance: StatsTracker;
  private stats: any = {
    totalTasksCompleted: 0,
    morningTasksCompleted: 0,
    eveningTasksCompleted: 0,
    dailyTasksCompleted: 0,
  };

  private constructor() {}

  public static getInstance(): StatsTracker {
    if (!StatsTracker.instance) {
      StatsTracker.instance = new StatsTracker();
    }
    return StatsTracker.instance;
  }

  public updateStats(taskId: string): any {
    // Update relevant stats based on the completed task
    this.stats.totalTasksCompleted++;
    
    // You might want to check the task period and update accordingly
    if (taskId.includes('morning')) {
      this.stats.morningTasksCompleted++;
    } else if (taskId.includes('evening')) {
      this.stats.eveningTasksCompleted++;
    }
    
    this.stats.dailyTasksCompleted++;
    
    return { ...this.stats };
  }

  public getStats(): any {
    return { ...this.stats };
  }

  public resetStats(): void {
    this.stats = {
      totalTasksCompleted: 0,
      morningTasksCompleted: 0,
      eveningTasksCompleted: 0,
      dailyTasksCompleted: 0,
    };
  }
} 