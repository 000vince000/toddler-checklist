import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { RoadmapScene } from './roadmap/RoadmapScene';

export default function Roadmap() {
  const navigate = useNavigate();
  const { taskStatuses, currentTask } = useTaskContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<RoadmapScene | null>(null);

  useEffect(() => {
    if (!containerRef.current || !taskStatuses.length) return;

    // Create scene
    const scene = new RoadmapScene(containerRef.current);
    sceneRef.current = scene;

    // Add tasks to scene
    taskStatuses.forEach((task, index) => {
      scene.addTask(task, index, currentTask?.id === task.id);
    });

    // Handle window resize
    const handleResize = () => {
      if (!sceneRef.current) return;
      const { width, height } = containerRef.current!.getBoundingClientRect();
      sceneRef.current.resize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Handle task clicks
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
    };
  }, [taskStatuses, currentTask, navigate]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100vh',
        backgroundColor: '#87CEEB' // Sky blue background
      }} 
    />
  );
} 