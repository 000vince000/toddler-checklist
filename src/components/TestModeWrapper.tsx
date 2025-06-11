import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import TestControlPanel from './TestControlPanel';
import tasksConfig from '../config/tasks.json';
import { Task } from '../types/Task';

interface TestModeWrapperProps {
  children: React.ReactNode;
}

const TestModeWrapper: React.FC<TestModeWrapperProps> = ({ children }) => {
  const { 
    isTestMode, 
    setTestMode, 
    simulatedTime, 
    setSimulatedTime,
    triggerTask 
  } = useTaskContext();

  const tasksWithStatus: Task[] = tasksConfig.tasks.map(task => ({
    ...task,
    status: 'pending',
    period: task.period as 'morning' | 'evening'
  }));

  return (
    <>
      {children}
      {isTestMode && (
        <TestControlPanel
          tasks={tasksWithStatus}
          currentTime={simulatedTime || new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          onTimeChange={setSimulatedTime}
          onTaskTrigger={triggerTask}
        />
      )}
    </>
  );
};

export default TestModeWrapper; 