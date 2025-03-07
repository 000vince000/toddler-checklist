import React, { createContext, useContext, useEffect, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import tasksConfig from '../config/tasks.json';
import { Task, TaskStatus } from '../types/Task';

interface TaskContextType {
  currentTask: Task | null;
  taskStatuses: TaskStatus[];
  completeTask: (taskId: string) => void;
  skipTask: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

interface TaskProviderProps {
  children: React.ReactNode;
  onNavigate: NavigateFunction;
}

export function TaskProvider({ children, onNavigate }: TaskProviderProps) {
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Add navigation effect
  useEffect(() => {
    // Only navigate if we're initialized and have a valid navigation function
    if (isInitialized && typeof onNavigate === 'function') {
      console.log('TaskContext: currentTask changed:', currentTask);
      if (currentTask) {
        console.log('Navigating to prompt');
        onNavigate('/prompt');
      } else {
        console.log('Navigating to roadmap');
        onNavigate('/roadmap');
      }
    }
  }, [currentTask, isInitialized, onNavigate]);

  // Add debug effect
  useEffect(() => {
    console.log('taskStatuses changed:', taskStatuses);
  }, [taskStatuses]);

  useEffect(() => {
    // Initialize daily tasks
    const today = new Date().toISOString().split('T')[0];
    const savedStatuses = localStorage.getItem(`tasks-${today}`);
    
    console.log('Initializing tasks for:', today);
    console.log('Saved statuses:', savedStatuses);
    
    if (!savedStatuses) {
      console.log('No saved statuses found, creating initial statuses');
      const initialStatuses = tasksConfig.tasks.map(task => ({
        id: task.id,
        date: today,
        status: 'pending' as const
      }));
      console.log('Setting initial statuses:', initialStatuses);
      localStorage.setItem(`tasks-${today}`, JSON.stringify(initialStatuses));
      setTaskStatuses(initialStatuses);
    } else {
      console.log('Loading saved statuses');
      const parsedStatuses = JSON.parse(savedStatuses);
      console.log('Parsed statuses:', parsedStatuses);
      setTaskStatuses(parsedStatuses);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // Only run this effect if we're initialized and have task statuses
    if (!isInitialized || taskStatuses.length === 0) {
      console.log('Skipping task check - not initialized or no statuses', {
        isInitialized,
        statusesLength: taskStatuses.length
      });
      return;
    }

    // Find current active task
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    console.log('Checking for active task:', {
      currentTime: `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`,
      currentTimeInMinutes,
      taskStatusesLength: taskStatuses.length
    });

    const activeTask = tasksConfig.tasks.find(task => {
      const [startHour, startMinute] = task.startTime.split(':').map(Number);
      const [endHour, endMinute] = task.endTime.split(':').map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;

      const status = taskStatuses.find(s => s.id === task.id);
      
      const isInTimeRange = currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
      const isPending = status?.status === 'pending';

      console.log(`Checking task ${task.id}:`, {
        startTime: task.startTime,
        endTime: task.endTime,
        startTimeInMinutes,
        endTimeInMinutes,
        currentTimeInMinutes,
        status: status?.status,
        isInTimeRange,
        isPending,
        willBeSelected: isInTimeRange && isPending
      });
      
      if (!isPending) {
        console.log(`Task ${task.id} skipped: not pending`);
        return false;
      }
      
      if (!isInTimeRange) {
        console.log(`Task ${task.id} skipped: not in time range`);
        return false;
      }
      
      return true;
    });

    console.log('Found active task:', activeTask);
    setCurrentTask(activeTask || null);
  }, [taskStatuses, isInitialized]);

  const updateTaskStatus = (taskId: string, status: 'checked' | 'unchecked') => {
    const today = new Date().toISOString().split('T')[0];
    const newStatuses = taskStatuses.map(t => 
      t.id === taskId ? { ...t, status } : t
    );
    
    localStorage.setItem(`tasks-${today}`, JSON.stringify(newStatuses));
    setTaskStatuses(newStatuses);
  };

  return (
    <TaskContext.Provider value={{
      currentTask,
      taskStatuses,
      completeTask: (taskId) => updateTaskStatus(taskId, 'checked'),
      skipTask: (taskId) => updateTaskStatus(taskId, 'unchecked')
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext must be used within TaskProvider');
  return context;
}; 