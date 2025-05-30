import ffmpeg from 'fluent-ffmpeg';
import { supabase } from '@zippyview/shared';
import type { Database } from '@zippyview/shared/src/types/supabase';
import { videoGenerationSchema } from '@zippyview/shared';

interface VideoGenerationOptions {
  projectId: string;
  settings: {
    duration?: number;
    resolution?: '720p' | '1080p' | '4k';
    include_audio?: boolean;
    background_music_id?: string;
  };
}

const RESOLUTION_MAP = {
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '4k': { width: 3840, height: 2160 },
};

async function generateProjectVideo(options: VideoGenerationOptions): Promise<string> {
  const { projectId, settings } = videoGenerationSchema.parse(options);
  
  // Fetch project data
  const { data: project, error: projectError } = await supabase
    .from('github_projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (projectError || !project) {
    throw new Error('Project not found');
  }

  // Fetch commits for visualization
  const { data: commits, error: commitsError } = await supabase
    .from('commits')
    .select('*')
    .eq('project_id', projectId)
    .order('timestamp', { ascending: true });

  if (commitsError) {
    throw new Error('Failed to fetch commits');
  }

  const resolution = RESOLUTION_MAP[settings.resolution || '1080p'];
  const outputPath = `/tmp/${projectId}-${Date.now()}.mp4`;

  return new Promise((resolve, reject) => {
    const command = ffmpeg();

    // Add background canvas
    command.addInput('color=c=black:s=${resolution.width}x${resolution.height}')
      .inputFormat('lavfi')
      .duration(settings.duration || 30);

    // If including audio and background_music_id is provided
    if (settings.include_audio && settings.background_music_id) {
      command.addInput(`music/${settings.background_music_id}.mp3`);
    }

    // Add visualization elements for each commit
    commits?.forEach((commit, index) => {
      const timestamp = index * (settings.duration || 30) / (commits.length || 1);
      
      // Add commit message as text overlay
      command.addInput('color=c=transparent:s=${resolution.width}x${resolution.height}')
        .inputFormat('lavfi')
        .complexFilter([
          {
            filter: 'drawtext',
            options: {
              text: commit.message,
              fontsize: 24,
              fontcolor: 'white',
              x: '(w-text_w)/2',
              y: 'h-th-10',
              enable: `between(t,${timestamp},${timestamp + 2})`
            }
          }
        ]);
    });

    // Configure output
    command
      .outputOptions([
        '-c:v libx264',
        '-preset fast',
        '-crf 22',
        '-movflags +faststart'
      ])
      .toFormat('mp4')
      .on('end', () => {
        // Upload to Supabase Storage
        supabase.storage
          .from('videos')
          .upload(`${projectId}/${Date.now()}.mp4`, outputPath)
          .then(({ data, error }) => {
            if (error) reject(error);
            else resolve(data.path);
          });
      })
      .on('error', reject)
      .save(outputPath);
  });
}

// Start HTTP server to handle video generation requests
import express from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

app.post('/generate', async (req, res) => {
  try {
    const videoUrl = await generateProjectVideo(req.body);
    res.json({ url: videoUrl });
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate video' 
    });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Video generator service listening on port ${port}`);
});