import { ProjectPlan, NextStep } from './types';

export const PROJECT_PLAN_DATA: ProjectPlan = {
  phases: [
    {
      id: "phase-1",
      title: "Phase 1: Foundation & Data Ingestion MVP",
      weeks: "Weeks 1-4",
      sections: [
        {
          id: "phase-1-section-1.1",
          title: "1.1. Core Infrastructure Setup",
          tasks: [
            { id: "p1-s1.1-t1", description: "Initialize Git repository (GitHub/GitLab).", completed: false },
            { id: "p1-s1.1-t2", description: "Set up Supabase Project: Create new Supabase project.", completed: false },
            // ... (rest of the tasks from TASK_LIST.md)
          ],
        },
        // ... (rest of the sections)
      ],
    },
    // ... (rest of the phases)
  ],
};

export const NEXT_IMMEDIATE_STEPS_DATA: NextStep[] = [
  { id: "next-1", description: "Set up the core GitHub Repository: Create the `zippyview` repository on GitHub.", completed: false },
  { id: "next-2", description: "Initialize Supabase Project: Get the database up and running with the initial schemas defined in Phase 1.1.", completed: false },
  { id: "next-3", description: "Basic Bolt.new Setup: Get your Bolt.new environment ready to deploy your first functions.", completed: false },
  { id: "next-4", description: "Connect Discord: Start with the Discord bot setup to begin ingesting messages as the first data stream.", completed: false },
];