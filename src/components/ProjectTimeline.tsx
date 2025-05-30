import React from 'react';
import * as d3 from 'd3';

interface Commit {
  hash: string;
  message: string;
  timestamp: string;
  author: string;
}

interface Props {
  commits: Commit[];
}

export const ProjectTimeline: React.FC<Props> = ({ commits }) => {
  const timelineRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!timelineRef.current || !commits.length) return;

    const svg = d3.select(timelineRef.current);
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = timelineRef.current.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // Create scales
    const timeExtent = d3.extent(commits, d => new Date(d.timestamp));
    const xScale = d3.scaleTime()
      .domain(timeExtent)
      .range([0, width]);

    // Add visualization elements
    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .selectAll('circle')
      .data(commits)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(new Date(d.timestamp)))
      .attr('cy', height / 2)
      .attr('r', 5)
      .attr('fill', '#60A5FA')
      .attr('class', 'hover:r-6 transition-all duration-200 cursor-pointer')
      .append('title')
      .text(d => `${d.message}\nBy: ${d.author}`);
  }, [commits]);

  return (
    <div className="w-full bg-slate-800 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Project Timeline</h3>
      <svg
        ref={timelineRef}
        className="w-full h-[200px]"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};