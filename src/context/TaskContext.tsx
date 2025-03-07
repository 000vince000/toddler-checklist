import React, { createContext, useContext, useEffect, useState } from 'react';
import tasksConfig from '../config/tasks.json';
import { Task, TaskStatus } from '../types/Task';

interface TaskContextType {
  currentTask: Task | null;
  taskStatuses: TaskStatus[];
  completeTask: (taskId: string) => void;
  skipTask: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    // Initialize daily tasks
    const today = new Date().toISOString().split('T')[0];
    const savedStatuses = localStorage.getItem(`tasks-${today}`);
    
    if (!savedStatuses) {
      const initialStatuses = tasksConfig.tasks.map(task => ({
        id: task.id,
        date: today,
        status: 'pending' as const
      }));
      localStorage.setItem(`tasks-${today}`, JSON.stringify(initialStatuses));
      setTaskStatuses(initialStatuses);
    } else {
      setTaskStatuses(JSON.parse(savedStatuses));
    }
  }, []);

  useEffect(() => {
    // Find current active task
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

    const activeTask = tasksConfig.tasks.find(task => {
      const status = taskStatuses.find(s => s.id === task.id);
      if (status?.status !== 'pending') return false;
      
      return currentTime >= task.startTime && currentTime <= task.endTime;
    });

    setCurrentTask(activeTask || null);
  }, [taskStatuses]);

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