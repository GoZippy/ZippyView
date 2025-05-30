import React, { useState } from 'react';

interface Props {
  projectId: string;
  onVideoGenerated: (videoUrl: string) => void;
}

export const VideoGenerator: React.FC<Props> = ({ projectId, onVideoGenerated }) => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateVideo = async () => {
    setGenerating(true);
    setError(null);
    try {
      // TODO: Implement video generation logic using FFmpeg
      // This will be implemented when we add the backend service
      const mockVideoUrl = `https://example.com/videos/${projectId}.mp4`;
      onVideoGenerated(mockVideoUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Project Visualization</h3>
      <button
        onClick={handleGenerateVideo}
        disabled={generating}
        className={`px-4 py-2 rounded-lg ${
          generating
            ? 'bg-slate-600 cursor-not-allowed'
            : 'bg-sky-500 hover:bg-sky-600'
        }`}
      >
        {generating ? 'Generating...' : 'Generate Video'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};