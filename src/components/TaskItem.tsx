import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  return (
    <li className="flex items-start gap-3 p-2 hover:bg-slate-700 rounded transition-colors">
      <button
        onClick={onToggle}
        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          task.completed
            ? 'bg-sky-500 border-sky-500 text-white'
            : 'border-slate-500 hover:border-sky-500'
        }`}
      >
        {task.completed && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        )}
      </button>
      <span className={`text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
        {task.description}
      </span>
    </li>
  );
};