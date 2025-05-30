import { z } from 'zod';

export const ideaSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  proposer_ids: z.array(z.string()),
  source_channel: z.string(),
  linked_github_repo_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  engagement_score: z.number(),
  monetization_score: z.number(),
  creativity_score: z.number(),
  usefulness_score: z.number(),
});

export const videoGenerationSchema = z.object({
  projectId: z.string(),
  settings: z.object({
    duration: z.number().optional(),
    resolution: z.enum(['720p', '1080p', '4k']).optional(),
    include_audio: z.boolean().optional(),
    background_music_id: z.string().optional(),
  }),
});