import { supabase } from './supabase';

interface VideoGenerationSettings {
  duration?: number;
  resolution?: '720p' | '1080p' | '4k';
  include_audio?: boolean;
  background_music_id?: string;
}

export async function generateProjectVideo(
  projectId: string,
  settings: VideoGenerationSettings = {}
) {
  const { data: project, error: projectError } = await supabase
    .from('github_projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (projectError) throw projectError;

  const { data: commits, error: commitsError } = await supabase
    .from('commits')
    .select('*')
    .eq('project_id', projectId)
    .order('timestamp', { ascending: true });

  if (commitsError) throw commitsError;

  // Create a video generation job
  const { data: job, error: jobError } = await supabase
    .from('video_generation_jobs')
    .insert([
      {
        project_id: projectId,
        settings: {
          duration: settings.duration || 30,
          resolution: settings.resolution || '1080p',
          include_audio: settings.include_audio ?? true,
          background_music_id: settings.background_music_id
        },
        status: 'pending',
        progress: 0,
        commit_data: commits
      }
    ])
    .select()
    .single();

  if (jobError) throw jobError;

  return job;
}

export async function getVideoGenerationStatus(jobId: string) {
  const { data: job, error } = await supabase
    .from('video_generation_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) throw error;
  return job;
}