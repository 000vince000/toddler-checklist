import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { RoadmapScene } from './Roadmap/RoadmapScene';

export default function Roadmap() {
  const navigate = useNavigate();
  const { taskStatuses, currentTask } = useTaskContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<RoadmapScene | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current || !taskStatuses.length) {
      console.log('Roadmap: Waiting for container or task statuses', {
        hasContainer: !!containerRef.current,
        taskCount: taskStatuses.length
      });
      return;
    }

    console.log('Roadmap: Initializing scene');
    const scene = new RoadmapScene(containerRef.current);
    sceneRef.current = scene;

    taskStatuses.forEach((task, index) => {
      const taskForScene = {
        id: task.id,
        status: task.status === 'pending' ? 'unchecked' : task.status
      };
      scene.addTask(taskForScene, index, currentTask?.id === task.id);
    });

    setIsInitialized(true);

    const handleResize = () => {
      if (!sceneRef.current) return;
      const { width, height } = containerRef.current!.getBoundingClientRect();
      sceneRef.current.resize(width, height);
    };

    window.addEventListener('resize', handleResize);

    const handleClick = (event: MouseEvent) => {
      if (!sceneRef.current) return;
      const taskId = sceneRef.current.getClickedTaskId(event);
      if (taskId && taskId === currentTask?.id) {
        navigate('/prompt');
      }
    };
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      if (sceneRef.current) {
        sceneRef.current.dispose();
      }
      setIsInitialized(false);
    };
  }, [taskStatuses, currentTask, navigate]); // Add dependencies

  // Update task statuses
  useEffect(() => {
    if (!sceneRef.current || !isInitialized) return;

    console.log('Roadmap: Updating task statuses', taskStatuses);

    // Check if all tasks are pending
    const allPending = taskStatuses.every(task => task.status === 'pending');
    if (allPending) {
      console.log('Roadmap: All tasks are pending, resetting character position');
      return;
    }

    taskStatuses.forEach(task => {
      console.log('Roadmap: Updating task', task.id, task.status);
      const status = task.status === 'pending' ? 'unchecked' : task.status;
      sceneRef.current?.updateTaskStatus(task.id, status);
    });
  }, [taskStatuses, isInitialized]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100vh', backgroundColor: '#87CEEB' }}
    >
      {!isInitialized && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.7)', 
          color: 'white',
          padding: '20px',
          borderRadius: '10px'
        }}>
          Loading roadmap...
        </div>
      )}
      <div style={{ position: 'fixed', top: 0, left: 0, padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white' }}>
        Tasks: {taskStatuses.length}
      </div>
    </div>
  );
} 