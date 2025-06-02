import React, { useState } from 'react';
import { videoGenerationSchema } from '@zippyview/shared';

interface VideoGeneratorProps {
  projectId: string;
  onVideoGenerated: (url: string) => void;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ projectId, onVideoGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const settings = {
        duration: 30,
        resolution: '1080p' as const,
        include_audio: true,
      };

      const validatedData = videoGenerationSchema.parse({
        projectId,
        settings,
      });

      // TODO: Call video generation API endpoint
      // For now, simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onVideoGenerated('https://example.com/demo-video.mp4');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Generate Project Video</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Resolution</label>
          <select
            className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-white"
            defaultValue="1080p"
          >
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
            <option value="4k">4K</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">Duration</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-white"
            defaultValue={30}
            min={10}
            max={300}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="include-audio"
            className="rounded bg-slate-700 border-slate-600 text-blue-500"
            defaultChecked
          />
          <label htmlFor="include-audio" className="ml-2 text-sm text-slate-300">
            Include background music
          </label>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Video'}
        </button>
      </div>
    </div>
  );
};