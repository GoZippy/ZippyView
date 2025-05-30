import React from 'react';
import { Phase } from '../types';

interface PhaseSelectorProps {
  phases: Phase[];
  selectedPhaseId: string;
  onSelectPhase: (phaseId: string) => void;
}

export const PhaseSelector: React.FC<PhaseSelectorProps> = ({
  phases,
  selectedPhaseId,
  onSelectPhase,
}) => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => onSelectPhase(phase.id)}
            className={`p-4 rounded-lg text-left transition-all ${
              selectedPhaseId === phase.id
                ? 'bg-sky-500 text-white shadow-lg scale-105'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <h3 className="font-semibold mb-1">{phase.title}</h3>
            <p className="text-sm opacity-80">{phase.weeks}</p>
          </button>
        ))}
      </div>
    </div>
  );
};