import React, { useState } from 'react';
import { ideaSchema } from '@zippyview/shared';
import { useIdeaStore } from '../store/ideaStore';

export const IdeaForm: React.FC = () => {
  const addIdea = useIdeaStore(state => state.addIdea);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const ideaData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      proposer_ids: ['user-1'], // TODO: Get from auth
      source_channel: 'web',
      engagement_score: 0,
      monetization_score: 0,
      creativity_score: 0,
      usefulness_score: 0,
    };

    try {
      const validated = ideaSchema.parse(ideaData);
      await addIdea(validated);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Submit New Idea</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-white"
            placeholder="Enter your idea title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-white"
            placeholder="Describe your idea in detail"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Idea'}
        </button>
      </form>
    </div>
  );
};