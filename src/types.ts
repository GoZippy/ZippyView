export interface Task {
  id: string;
  description: string;
  completed: boolean;
}

export interface TaskSection {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Phase {
  id: string;
  title: string;
  weeks: string;
  sections: TaskSection[];
}

export interface ProjectPlan {
  phases: Phase[];
}

export interface NextStep extends Task {}

export interface IdeaNode {
  id: string;
  title: string;
  description: string;
  proposer_ids: string[];
  engagement_score: number;
  monetization_score: number;
  creativity_score: number;
  usefulness_score: number;
  created_at: string;
}

export interface Commit {
  id: string;
  project_id: string;
  commit_hash: string;
  author_id: string;
  timestamp: string;
  message: string;
  file_changes: {
    added: string[];
    modified: string[];
    deleted: string[];
  };
}