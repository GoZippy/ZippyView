import { Octokit } from '@octokit/rest';
import type { Database } from '../types/supabase';
import { supabase } from './supabase';

if (!process.env.GITHUB_TOKEN) {
  throw new Error('Missing GitHub token');
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function syncRepository(repoUrl: string) {
  const [owner, repo] = repoUrl.split('/').slice(-2);

  try {
    // Fetch basic repo info
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo
    });

    // Fetch recent commits
    const { data: commits } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 100
    });

    // Update database
    const { error } = await supabase.from('github_projects').upsert({
      repo_url: repoUrl,
      owner_username: owner,
      repo_name: repo,
      last_synced_at: new Date().toISOString(),
      current_stats: {
        commit_count: commits.length,
        dev_count: new Set(commits.map(c => c.author?.login)).size,
        stars: repoData.stargazers_count
      }
    });

    if (error) throw error;

    // Store commits
    const { error: commitsError } = await supabase.from('commits').insert(
      commits.map(commit => ({
        project_id: repoUrl,
        commit_hash: commit.sha,
        author_id: commit.author?.login || 'unknown',
        timestamp: commit.commit.author?.date,
        message: commit.commit.message
      }))
    );

    if (commitsError) throw commitsError;

    return true;
  } catch (error) {
    console.error('Failed to sync repository:', error);
    return false;
  }
}