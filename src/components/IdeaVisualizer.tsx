import React, { useEffect, useRef } from 'react';
import ForceGraph3D from 'react-force-graph';
import * as d3 from 'd3';

interface IdeaNode {
  id: string;
  name: string;
  val: number; // size based on engagement
  color?: string; // based on category/score
}

interface IdeaLink {
  source: string;
  target: string;
  strength: number;
}

interface Props {
  ideas: IdeaNode[];
  links: IdeaLink[];
}

export const IdeaVisualizer: React.FC<Props> = ({ ideas, links }) => {
  const fgRef = useRef();

  useEffect(() => {
    // Add 3D force graph initialization here
    if (fgRef.current) {
      fgRef.current
        .d3Force('link')
        .distance(link => 100 / (link.strength || 1));
    }
  }, []);

  return (
    <div className="w-full h-[600px] bg-slate-900 rounded-lg">
      <ForceGraph3D
        ref={fgRef}
        graphData={{ nodes: ideas, links }}
        nodeLabel="name"
        nodeColor="color"
        nodeVal="val"
        linkWidth={1}
        linkColor={() => '#ffffff30'}
        backgroundColor="#0f172a"
      />
    </div>
  );
};