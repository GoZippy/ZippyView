import React from 'react';

interface Commit {
  hash: string;
  message: string;
  timestamp: string;
  author: string;
}

interface ProjectTimelineProps {
  commits: Commit[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ commits }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Project Timeline</h2>
      <div className="space-y-4">
        {commits.map((commit) => (
          <div
            key={commit.hash}
            className="flex items-start space-x-4 p-4 bg-slate-700 rounded-lg"
          >
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500" />
            <div>
              <div className="flex items-center space-x-2">
                <code className="text-sm text-slate-300">{commit.hash.slice(0, 7)}</code>
                <span className="text-sm text-slate-400">by {commit.author}</span>
              </div>
              <p className="mt-1 text-slate-200">{commit.message}</p>
              <time className="text-sm text-slate-400">
                {new Date(commit.timestamp).toLocaleString()}
              </time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};