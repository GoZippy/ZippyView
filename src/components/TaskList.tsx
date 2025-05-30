import React from 'react';
import { Phase } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  phase: Phase;
  onToggleTask: (phaseId: string, sectionId: string, taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ phase, onToggleTask }) => {
  return (
    <div className="space-y-8">
      {phase.sections.map((section) => (
        <div key={section.id} className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-sky-400">{section.title}</h3>
          <ul className="space-y-2">
            {section.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(phase.id, section.id, task.id)}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};