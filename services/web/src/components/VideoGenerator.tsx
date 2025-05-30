import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Props {
  projectId: string;
  onVideoGenerated: (videoUrl: string) => void;
}

export const VideoGenerator: React.FC<Props> = ({ projectId, onVideoGenerated }) => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleGenerateVideo = async () => {
    setGenerating(true);
    setError(null);
    setProgress(0);

    try {
      // Start the video generation process
      const { data: jobData, error: jobError } = await supabase
        .from('video_generation_jobs')
        .insert([
          {
            project_id: projectId,
            status: 'pending',
            settings: {
              duration: 30,
              resolution: '1080p',
              include_audio: true
            }
          }
        ])
        .select()
        .single();

      if (jobError) throw jobError;

      // Subscribe to job progress updates
      const subscription = supabase
        .channel(`job-${jobData.id}`)
        .on('progress', payload => {
          setProgress(payload.progress);
        })
        .on('completed', payload => {
          onVideoGenerated(payload.video_url);
          setGenerating(false);
          subscription.unsubscribe();
        })
        .on('error', payload => {
          setError(payload.error);
          setGenerating(false);
          subscription.unsubscribe();
        })
        .subscribe();

    } catch (err) {
      setError(err.message);
      setGenerating(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Project Visualization</h3>
      
      <div className="space-y-4">
        {generating && (
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-sky-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          onClick={handleGenerateVideo}
          disabled={generating}
          className={`w-full px-4 py-2 rounded-lg transition-colors ${
            generating
              ? 'bg-slate-600 cursor-not-allowed'
              : 'bg-sky-500 hover:bg-sky-600'
          }`}
        >
          {generating ? `Generating (${progress}%)` : 'Generate Video'}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2">
            Error: {error}
          </p>
        )}
      </div>
    </div>
  );
};