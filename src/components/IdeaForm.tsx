import React, { useState } from 'react';
import { useIdeaStore } from '../store/ideaStore';

export const IdeaForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { addIdea, loading } = useIdeaStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    await addIdea({
      title,
      description,
      proposer_ids: [], // Will be populated from auth context
      engagement_score: 0,
      monetization_score: 0,
      creativity_score: 0,
      usefulness_score: 0,
    });

    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Submit New Idea</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-white"
            placeholder="Enter idea title"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-white"
            placeholder="Describe your idea"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg ${
            loading
              ? 'bg-slate-600 cursor-not-allowed'
              : 'bg-sky-500 hover:bg-sky-600'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Idea'}
        </button>
      </div>
    </form>
  );
};