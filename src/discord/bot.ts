import { Client, Events, GatewayIntentBits } from 'discord.js';
import { supabase } from '../lib/supabase';
import { analyzeIdea } from '../lib/gemini';

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
  // Ignore bot messages
  if (message.author.bot) return;

  // Check if message is in a designated ideas channel
  if (message.channel.name.includes('ideas') || message.channel.name.includes('projects')) {
    try {
      // Extract GitHub URLs if present
      const githubUrls = message.content.match(/https:\/\/github\.com\/[\w-]+\/[\w-]+/g) || [];

      // Get or create participant record
      const { data: participant, error: participantError } = await supabase
        .from('participants')
        .upsert({
          discord_handle: message.author.tag,
          registered_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (participantError) throw participantError;

      // Analyze the idea using Gemini
      const analysis = await analyzeIdea(message.content);

      // Store the idea in Supabase
      const { data: idea, error: ideaError } = await supabase
        .from('ideas')
        .insert([
          {
            title: message.content.split('\n')[0].slice(0, 100), // First line as title
            description: message.content,
            proposer_ids: [participant.id],
            source_channel: message.channel.name,
            linked_github_repo_url: githubUrls[0] || null,
            ai_analysis: analysis,
            engagement_score: 0,
            raw_discord_message: {
              id: message.id,
              channel_id: message.channel.id,
              timestamp: message.createdTimestamp,
            },
          },
        ])
        .select()
        .single();

      if (ideaError) throw ideaError;

      // React to acknowledge processing
      await message.react('✅');

      // If GitHub URLs were found, store project info
      for (const url of githubUrls) {
        const [owner, repo] = url.split('github.com/')[1].split('/');
        await supabase.from('github_projects').upsert({
          repo_url: url,
          owner_username: owner,
          repo_name: repo,
          last_synced_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
      await message.react('❌');
    }
  }
});

// Handle reactions to track engagement
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;

  try {
    const { data: idea } = await supabase
      .from('ideas')
      .select('*')
      .eq('raw_discord_message.id', reaction.message.id)
      .single();

    if (idea) {
      // Record the interaction
      await supabase.from('idea_interactions').insert([
        {
          idea_id: idea.id,
          participant_id: user.id,
          type: 'reaction',
          content: reaction.emoji.name,
        },
      ]);

      // Update engagement score
      await supabase.rpc('update_idea_engagement_score', { idea_id: idea.id });
    }
  } catch (error) {
    console.error('Error processing reaction:', error);
  }
});

// Login with your token
client.login(process.env.DISCORD_BOT_TOKEN);