import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { supabase } from '@zippyview/shared';
import { analyzeIdea } from '@zippyview/shared';

if (!process.env.DISCORD_BOT_TOKEN) {
  throw new Error('Missing Discord bot token');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  // Check if message contains a GitHub URL
  const githubUrlMatch = message.content.match(/https:\/\/github\.com\/[\w-]+\/[\w-]+/);
  
  if (githubUrlMatch) {
    const repoUrl = githubUrlMatch[0];
    
    // Store in github_projects table
    const { error: projectError } = await supabase
      .from('github_projects')
      .upsert({
        repo_url: repoUrl,
        owner_username: repoUrl.split('/')[3],
        repo_name: repoUrl.split('/')[4],
        last_synced_at: new Date().toISOString(),
      });

    if (projectError) {
      console.error('Error storing GitHub project:', projectError);
    }
  }

  // Check if message might contain a project idea
  if (message.content.length > 50) {
    try {
      const analysis = await analyzeIdea(message.content);
      
      // Store in ideas table
      const { error: ideaError } = await supabase
        .from('ideas')
        .insert({
          title: message.content.slice(0, 100),
          description: message.content,
          proposer_ids: [message.author.id],
          source_channel: message.channel.id,
          linked_github_repo_url: githubUrlMatch?.[0],
          raw_analysis: analysis,
        });

      if (ideaError) {
        console.error('Error storing idea:', ideaError);
      }
    } catch (error) {
      console.error('Error analyzing idea:', error);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);