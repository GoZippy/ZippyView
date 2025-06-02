import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { IdeaVisualizer } from '../components/IdeaVisualizer';
import { ProjectTimeline } from '../components/ProjectTimeline';
import { useIdeaStore } from '../store/ideaStore';

export const Dashboard: React.FC = () => {
  const session = useSession();
  const { ideas, loading, error, fetchIdeas } = useIdeaStore();

  React.useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-500/10 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Active Projects</h3>
            <p className="text-3xl font-bold text-sky-400">{ideas.length}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Total Commits</h3>
            <p className="text-3xl font-bold text-emerald-400">0</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Contributors</h3>
            <p className="text-3xl font-bold text-purple-400">0</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Project Visualization</h2>
        <div className="bg-slate-800 p-6 rounded-lg">
          <IdeaVisualizer ideas={[]} links={[]} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-slate-800 p-6 rounded-lg">
          <ProjectTimeline commits={[]} />
        </div>
      </section>
    </div>
  );
};