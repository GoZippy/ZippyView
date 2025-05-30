import React from 'react';

interface ProgressBarProps {
  progress: number;
  label: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-slate-400">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};