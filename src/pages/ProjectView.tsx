import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@zippyview/shared';
import type { Database } from '@zippyview/shared/types/supabase';
import { ProjectTimeline } from '../components/ProjectTimeline';
import { VideoGenerator } from '../components/VideoGenerator';

type Project = Database['public']['Tables']['github_projects']['Row'];
type Commit = Database['public']['Tables']['commits']['Row'];

export const ProjectView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectData() {
      if (!id) return;

      try {
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('github_projects')
          .select('*')
          .eq('id', id)
          .single();

        if (projectError) throw projectError;
        setProject(projectData);

        // Fetch commits
        const { data: commitsData, error: commitsError } = await supabase
          .from('commits')
          .select('*')
          .eq('project_id', id)
          .order('timestamp', { ascending: false });

        if (commitsError) throw commitsError;
        setCommits(commitsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project data');
      } finally {
        setLoading(false);
      }
    }

    fetchProjectData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-slate-400">{error || 'Project not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">{project.repo_name}</h1>
        <p className="text-slate-400">
          Owned by <span className="text-blue-400">{project.owner_username}</span>
        </p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Commits</h3>
            <p className="text-2xl text-blue-400">
              {project.current_stats?.commit_count || 0}
            </p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Contributors</h3>
            <p className="text-2xl text-blue-400">
              {project.current_stats?.dev_count || 0}
            </p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Lines of Code</h3>
            <p className="text-2xl text-blue-400">
              {project.current_stats?.loc?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProjectTimeline commits={commits} />
        </div>
        <div>
          <VideoGenerator
            projectId={id}
            onVideoGenerated={setVideoUrl}
          />
          
          {videoUrl && (
            <div className="mt-6 bg-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Generated Video</h2>
              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}