import React from 'react';
import ForceGraph2D from 'react-force-graph';

interface Node {
  id: string;
  name: string;
  val: number;
  color: string;
}

interface Link {
  source: string;
  target: string;
  strength: number;
}

interface IdeaVisualizerProps {
  ideas: Node[];
  links: Link[];
}

export const IdeaVisualizer: React.FC<IdeaVisualizerProps> = ({ ideas, links }) => {
  return (
    <div className="h-[600px] bg-slate-900 rounded-lg overflow-hidden">
      <ForceGraph2D
        graphData={{ nodes: ideas, links }}
        nodeLabel="name"
        nodeColor="color"
        nodeVal="val"
        linkColor={() => '#ffffff20'}
        backgroundColor="#0f172a"
      />
    </div>
  );
};