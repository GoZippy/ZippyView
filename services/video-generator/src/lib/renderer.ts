import ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
import type { Commit } from '@zippyview/shared';

interface RenderOptions {
  width: number;
  height: number;
  duration: number;
  commits: Commit[];
  outputPath: string;
  backgroundMusic?: string;
}

export async function renderProjectVideo(options: RenderOptions): Promise<string> {
  const {
    width,
    height,
    duration,
    commits,
    outputPath,
    backgroundMusic
  } = options;

  return new Promise((resolve, reject) => {
    const command = ffmpeg();

    // Add base canvas
    command.addInput(`color=c=rgb(15,23,42):s=${width}x${height}`)
      .inputFormat('lavfi')
      .duration(duration);

    // Add background music if provided
    if (backgroundMusic) {
      command.addInput(backgroundMusic)
        .audioFilters('volume=0.2');
    }

    // Calculate timing for commit animations
    const timePerCommit = duration / commits.length;
    
    // Add commit visualizations
    commits.forEach((commit, index) => {
      const startTime = index * timePerCommit;
      
      command.complexFilter([
        {
          filter: 'drawtext',
          options: {
            text: commit.message,
            fontsize: 24,
            fontcolor: 'white',
            x: '(w-text_w)/2',
            y: 'h/2',
            enable: `between(t,${startTime},${startTime + timePerCommit})`
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
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .save(outputPath);
  });
}