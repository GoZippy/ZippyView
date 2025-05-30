import { Client, Events } from 'discord.js';
import { analyzeIdea } from '@zippyview/shared';
import { supabase } from '@zippyview/shared';

export function setupCommandHandlers(client: Client) {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
      case 'analyze': {
        const idea = interaction.options.getString('idea', true);
        await interaction.deferReply();

        try {
          const analysis = await analyzeIdea(idea);
          await interaction.editReply({
            content: `Analysis Results:\n\`\`\`\n${analysis}\n\`\`\``,
          });
        } catch (error) {
          await interaction.editReply({
            content: 'Failed to analyze idea. Please try again later.',
          });
        }
        break;
      }

      case 'track': {
        const url = interaction.options.getString('url', true);
        await interaction.deferReply();

        try {
          const { error } = await supabase.from('github_projects').insert({
            repo_url: url,
            owner_username: url.split('/')[3],
            repo_name: url.split('/')[4],
            last_synced_at: new Date().toISOString(),
          });

          if (error) throw error;

          await interaction.editReply({
            content: `Now tracking repository: ${url}`,
          });
        } catch (error) {
          await interaction.editReply({
            content: 'Failed to track repository. Please try again later.',
          });
        }
        break;
      }
    }
  });
}