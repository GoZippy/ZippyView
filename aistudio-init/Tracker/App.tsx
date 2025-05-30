
import React, { useState, useMemo, useCallback } from 'react';
import { PROJECT_PLAN_DATA, NEXT_IMMEDIATE_STEPS_DATA } from './constants';
import { Phase, ProjectPlan, NextStep, Task } from './types';
import { PhaseSelector } from './components/PhaseSelector';
import { TaskList } from './components/TaskList';
import { TaskItem } from './components/TaskItem';
import { ProgressBar } from './components/ProgressBar';
import { ChevronDownIcon, ChevronUpIcon } from './components/Icons';

const App: React.FC = () => {
  const [projectPlan, setProjectPlan] = useState<ProjectPlan>(PROJECT_PLAN_DATA);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(PROJECT_PLAN_DATA.phases[0]?.id || '');
  const [nextSteps, setNextSteps] = useState<NextStep[]>(NEXT_IMMEDIATE_STEPS_DATA);
  const [showNextSteps, setShowNextSteps] = useState<boolean>(true);

  const handleToggleTask = useCallback((phaseId: string, sectionId: string, taskId: string) => {
    setProjectPlan(prevPlan => ({
      ...prevPlan,
      phases: prevPlan.phases.map(phase =>
        phase.id === phaseId
          ? {
              ...phase,
              sections: phase.sections.map(section =>
                section.id === sectionId
                  ? {
                      ...section,
                      tasks: section.tasks.map(task =>
                        task.id === taskId
                          ? { ...task, completed: !task.completed }
                          : task
                      ),
                    }
                  : section
              ),
            }
          : phase
      ),
    }));
  }, []);

  const handleToggleNextStep = useCallback((taskId: string) => {
    setNextSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === taskId ? { ...step, completed: !step.completed } : step
      )
    );
  }, []);

  const selectedPhase = useMemo(() => {
    return projectPlan.phases.find(phase => phase.id === selectedPhaseId);
  }, [projectPlan.phases, selectedPhaseId]);

  const overallProgress = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    projectPlan.phases.forEach(phase => {
      phase.sections.forEach(section => {
        totalTasks += section.tasks.length;
        completedTasks += section.tasks.filter(task => task.completed).length;
      });
    });
    // Include next steps in overall progress
    totalTasks += nextSteps.length;
    completedTasks += nextSteps.filter(step => step.completed).length;

    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  }, [projectPlan, nextSteps]);

  const totalTasksCount = useMemo(() => {
     let count = projectPlan.phases.reduce((acc, p) => acc + p.sections.reduce((sAcc, s) => sAcc + s.tasks.length, 0), 0);
     count += nextSteps.length;
     return count;
  }, [projectPlan, nextSteps]);

  const completedTasksCount = useMemo(() => {
    let count = projectPlan.phases.reduce((acc, p) => acc + p.sections.reduce((sAcc, s) => sAcc + s.tasks.filter(t => t.completed).length, 0), 0);
    count += nextSteps.filter(s => s.completed).length;
    return count;
  }, [projectPlan, nextSteps]);


  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
          ZippyView: Project Task List
        </h1>
        <p className="mt-2 text-slate-400 text-lg">Track your project's progress through all phases.</p>
      </header>

      <div className="mb-8 p-4 bg-slate-800 rounded-lg shadow-xl">
         <ProgressBar progress={overallProgress} label={`Overall Project Progress: ${completedTasksCount} / ${totalTasksCount} tasks completed`} />
      </div>

      <PhaseSelector
        phases={projectPlan.phases}
        selectedPhaseId={selectedPhaseId}
        onSelectPhase={setSelectedPhaseId}
      />

      {selectedPhase && (
        <TaskList phase={selectedPhase} onToggleTask={handleToggleTask} />
      )}

      <div className="mt-12 pt-8 border-t border-slate-700">
        <button 
          onClick={() => setShowNextSteps(!showNextSteps)}
          className="w-full flex justify-between items-center text-left mb-4 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg shadow-md focus:outline-none"
        >
          <h2 className="text-2xl font-semibold text-sky-400">Next Immediate Steps</h2>
          {showNextSteps ? <ChevronUpIcon className="w-6 h-6 text-slate-400" /> : <ChevronDownIcon className="w-6 h-6 text-slate-400" />}
        </button>
        
        {showNextSteps && (
          <div className="bg-slate-800 p-4 md:p-6 rounded-lg shadow-lg">
            <ul className="space-y-1">
              {nextSteps.map(step => (
                <TaskItem key={step.id} task={step} onToggle={handleToggleNextStep} />
              ))}
            </ul>
          </div>
        )}
      </div>
      <footer className="mt-16 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} ZippyView Task Manager. All tasks are important!</p>
      </footer>
    </div>
  );
};

export default App;
