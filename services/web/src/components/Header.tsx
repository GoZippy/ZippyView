import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 shadow-lg py-6 px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ZippyView
          </h1>
          <p className="text-slate-400 mt-1">Visualizing Hackathon Innovation</p>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#ideas" className="text-slate-300 hover:text-white transition">Ideas</a>
            </li>
            <li>
              <a href="#projects" className="text-slate-300 hover:text-white transition">Projects</a>
            </li>
            <li>
              <a href="#visualizations" className="text-slate-300 hover:text-white transition">Visualizations</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};