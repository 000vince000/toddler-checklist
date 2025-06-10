import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { RoadmapScene } from './Roadmap/RoadmapScene';

export default function Roadmap() {
  const navigate = useNavigate();
  const { taskStatuses, currentTask } = useTaskContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<RoadmapScene | null>(null);

  useEffect(() => {
    if (!containerRef.current || !taskStatuses.length) return;

    const scene = new RoadmapScene(containerRef.current);
    sceneRef.current = scene;

    taskStatuses.forEach((task, index) => {
      const taskForScene = {
        id: task.id,
        status: task.status === 'pending' ? 'unchecked' : task.status
      };
      scene.addTask(taskForScene, index, currentTask?.id === task.id);
    });

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
    };
  }, [taskStatuses, currentTask, navigate]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100vh', backgroundColor: '#87CEEB' }}
    >
      <div style={{ position: 'fixed', top: 0, left: 0, padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white' }}>
        Tasks: {taskStatuses.length}
      </div>
    </div>
  );
} 