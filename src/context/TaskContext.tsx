import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import tasksConfig from '../config/tasks.json';
import { Task, TaskStatus } from '../types/Task';

interface TaskContextType {
  currentTask: Task | null;
  taskStatuses: TaskStatus[];
  completeTask: (taskId: string) => void;
  skipTask: (taskId: string) => void;
  isTestMode: boolean;
  setTestMode: (mode: boolean) => void;
  simulatedTime: string | null;
  setSimulatedTime: (time: string) => void;
  triggerTask: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

interface TaskProviderProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export function TaskProvider({ children, onNavigate }: TaskProviderProps) {
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState<string | null>(null);
  const [manuallyTriggeredTaskId, setManuallyTriggeredTaskId] = useState<string | null>(null);
  const previousTaskRef = useRef<Task | null>(null);

  // Add keyboard shortcut for test mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 't') {
        setIsTestMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Replace the navigation effect with this one
  useEffect(() => {
    if (!isInitialized) return;

    // Only navigate if the task actually changed from a previous value
    if (currentTask !== previousTaskRef.current) {
      console.log('TaskContext: actual task change detected:', {
        from: previousTaskRef.current?.id,
        to: currentTask?.id
      });
      
      previousTaskRef.current = currentTask;

      if (typeof onNavigate === 'function') {
        if (currentTask) {
          console.log('Navigating to prompt');
          onNavigate('/prompt');
        } else if (window.location.pathname !== '/roadmap') {  // Only navigate to roadmap if we're not already there
          console.log('Navigating to roadmap');
          onNavigate('/roadmap');
        }
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

  const getCurrentTime = () => {
    if (isTestMode && simulatedTime) {
      return simulatedTime;
    }
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Only run this effect if we're initialized and have task statuses
    if (!isInitialized || taskStatuses.length === 0) {
      console.log('Skipping task check - not initialized or no statuses', {
        isInitialized,
        statusesLength: taskStatuses.length
      });
      return;
    }

    if (isTestMode && manuallyTriggeredTaskId) {
      const task = tasksConfig.tasks.find(t => t.id === manuallyTriggeredTaskId);
      if (task) {
        const status = taskStatuses.find(s => s.id === task.id);
        if (status?.status === 'pending') {
          setCurrentTask({ 
            ...task, 
            status: 'pending',
            period: task.period as 'morning' | 'evening'
          });
          return;
        }
      }
      setManuallyTriggeredTaskId(null);
    }

    // Find current active task
    const currentTime = getCurrentTime();
    const [currentHour, currentMinutes] = currentTime.split(':').map(Number);
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    console.log('Checking for active task:', {
      currentTime,
      currentTimeInMinutes,
      taskStatusesLength: taskStatuses.length,
      isTestMode
    });

    const activeTask = tasksConfig.tasks.find(task => {
      const [startHour, startMinute] = task.startTime.split(':').map(Number);
      const [endHour, endMinute] = task.endTime.split(':').map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;

      const status = taskStatuses.find(s => s.id === task.id);
      
      const isInTimeRange = currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
      const isPending = status?.status === 'pending';

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
    setCurrentTask(activeTask ? { 
      ...activeTask, 
      status: 'pending',
      period: activeTask.period as 'morning' | 'evening'
    } : null);
  }, [taskStatuses, isInitialized, isTestMode, simulatedTime, manuallyTriggeredTaskId]);

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
      skipTask: (taskId) => updateTaskStatus(taskId, 'unchecked'),
      isTestMode,
      setTestMode: setIsTestMode,
      simulatedTime,
      setSimulatedTime,
      triggerTask: (taskId) => setManuallyTriggeredTaskId(taskId)
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => {
  console.log('useTaskContext called');
  const context = useContext(TaskContext);
  console.log('TaskContext value:', context);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}; 