import React from 'react';
import { IdeaVisualizer } from './components/IdeaVisualizer';
import { ProjectTimeline } from './components/ProjectTimeline';
import { useIdeaStore } from './store/ideaStore';

const App: React.FC = () => {
  const { ideas, loading, error, fetchIdeas } = useIdeaStore();

  React.useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  // Sample data for visualization
  const ideaNodes = ideas.map(idea => ({
    id: idea.id,
    name: idea.title,
    val: idea.engagement_score || 1,
    color: getScoreColor(idea.monetization_score || 5)
  }));

  const ideaLinks = ideas.map((idea, index) => ({
    source: idea.id,
    target: ideas[(index + 1) % ideas.length]?.id,
    strength: 1
  })).filter(link => link.target);

  // Sample commit data
  const sampleCommits = [
    {
      hash: '123abc',
      message: 'Initial commit',
      timestamp: '2024-01-01T12:00:00Z',
      author: 'Developer 1'
    },
    // Add more sample commits as needed
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          ZippyView
        </h1>
        <p className="text-slate-400 mt-2">Visualizing Hackathon Innovation</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Idea Galaxy</h2>
          <IdeaVisualizer ideas={ideaNodes} links={ideaLinks} />
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Project Activity</h2>
            <ProjectTimeline commits={sampleCommits} />
          </div>
        </div>
      </div>
    </div>
  );
};

const getScoreColor = (score: number): string => {
  const colors = ['#FF4136', '#FF851B', '#FFDC00', '#2ECC40', '#0074D9'];
  const index = Math.floor((score - 1) * (colors.length / 10));
  return colors[Math.min(colors.length - 1, Math.max(0, index))];
};

export default App;