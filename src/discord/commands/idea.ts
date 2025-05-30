import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../../lib/supabase';
import { analyzeIdea } from '../../lib/gemini';
import { z } from 'zod';

const ideaSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  githubUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

export const ideaCommand = {
  data: new SlashCommandBuilder()
    .setName('idea')
    .setDescription('Submit a new hackathon idea')
    .addStringOption(option =>
      option
        .setName('title')
        .setDescription('Title of your idea')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('description')
        .setDescription('Detailed description of your idea')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('github_url')
        .setDescription('GitHub repository URL (optional)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('tags')
        .setDescription('Comma-separated tags (optional)')
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description');
      const githubUrl = interaction.options.getString('github_url');
      const tags = interaction.options.getString('tags')?.split(',').map(t => t.trim()) || [];

      // Validate input
      const validatedData = ideaSchema.parse({
        title,
        description,
        githubUrl,
        tags,
      });

      // Get or create participant record
      const { data: participant, error: participantError } = await supabase
        .from('participants')
        .upsert({
          discord_handle: interaction.user.tag,
          registered_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (participantError) throw participantError;

      // Analyze the idea
      const analysis = await analyzeIdea(description);

      // Store the idea
      const { data: idea, error: ideaError } = await supabase
        .from('ideas')
        .insert([
          {
            title: validatedData.title,
            description: validatedData.description,
            proposer_ids: [participant.id],
            source_channel: interaction.channel.name,
            linked_github_repo_url: validatedData.githubUrl,
            tags: validatedData.tags,
            ai_analysis: analysis,
            engagement_score: 0,
            raw_discord_message: {
              id: interaction.id,
              channel_id: interaction.channelId,
              timestamp: Date.now(),
            },
          },
        ])
        .select()
        .single();

      if (ideaError) throw ideaError;

      // Create a thread for discussion
      const thread = await interaction.channel.threads.create({
        name: `💡 ${validatedData.title}`,
        autoArchiveDuration: 60,
        reason: 'Idea discussion thread',
      });

      // Post initial message in thread
      await thread.send({
        embeds: [{
          title: '🚀 New Idea Submitted',
          description: validatedData.description,
          fields: [
            {
              name: 'AI Analysis',
              value: analysis.substring(0, 1024), // Discord has a 1024 char limit for field values
            },
            {
              name: 'Tags',
              value: validatedData.tags.length ? validatedData.tags.join(', ') : 'No tags',
              inline: true,
            },
          ],
          color: 0x00ff00,
        }],
      });

      await interaction.editReply({
        content: `✅ Idea submitted successfully! Continue the discussion in ${thread}`,
      });

    } catch (error) {
      console.error('Error processing idea command:', error);
      await interaction.editReply({
        content: '❌ Error submitting idea. Please try again.',
      });
    }
  },
};