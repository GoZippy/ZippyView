import React, { useEffect, useRef, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

interface IdeaNode {
  id: string;
  name: string;
  val: number;
  color?: string;
  description?: string;
  scores?: {
    monetization: number;
    creativity: number;
    usefulness: number;
  };
}

interface IdeaLink {
  source: string;
  target: string;
  strength: number;
}

interface Props {
  ideas: IdeaNode[];
  links: IdeaLink[];
  onNodeClick?: (node: IdeaNode) => void;
}

export const IdeaVisualizer: React.FC<Props> = ({ ideas, links, onNodeClick }) => {
  const fgRef = useRef();
  const containerRef = useRef();

  const nodeThreeObject = useMemo(() => (node: IdeaNode) => {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(node.val),
      new THREE.MeshPhongMaterial({
        color: node.color || '#ffffff',
        transparent: true,
        opacity: 0.8
      })
    );

    const label = document.createElement('div');
    label.textContent = node.name;
    label.className = 'bg-slate-800 px-2 py-1 rounded text-xs text-white whitespace-nowrap';
    
    const labelObject = new CSS2DObject(label);
    labelObject.position.set(0, node.val + 2, 0);

    const group = new THREE.Group();
    group.add(sphere);
    group.add(labelObject);

    return group;
  }, []);

  useEffect(() => {
    if (!fgRef.current) return;

    // Add lights
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 50);
    fgRef.current.scene().add(light);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    fgRef.current.scene().add(ambientLight);

    // Configure force simulation
    fgRef.current
      .d3Force('link')
      .distance(link => 50 / (link.strength || 1));

    fgRef.current
      .d3Force('charge')
      .strength(-100);

    // Add CSS2D renderer for labels
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    containerRef.current.appendChild(labelRenderer.domElement);

    // Update camera position
    fgRef.current.cameraPosition({ z: 200 });

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(labelRenderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[600px] relative bg-slate-900 rounded-lg">
      <ForceGraph3D
        ref={fgRef}
        graphData={{ nodes: ideas, links }}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={true}
        linkWidth={1}
        linkColor={() => '#ffffff30'}
        backgroundColor="#0f172a"
        onNodeClick={(node) => onNodeClick?.(node)}
        controlType="orbit"
      />
    </div>
  );
};