
export interface Task {
  id: string;
  description: string;
  completed: boolean;
}

export interface TaskSection {
  id:string;
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
