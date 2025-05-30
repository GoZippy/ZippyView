import { Client, Events, GatewayIntentBits, Collection } from 'discord.js';
import { supabase } from '../lib/supabase';
import { analyzeIdea } from '../lib/gemini';
import { ideaCommand } from './commands/idea';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
  ],
});

// Command handling
const commands = new Collection();
commands.set(ideaCommand.data.name, ideaCommand);

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error executing this command!',
      ephemeral: true,
    });
  }
});

// Handle regular messages
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  // Check if message is in a designated ideas channel
  if (message.channel.name.includes('ideas') || message.channel.name.includes('projects')) {
    try {
      // Extract GitHub URLs
      const githubUrls = message.content.match(/https:\/\/github\.com\/[\w-]+\/[\w-]+/g) || [];
      
      // Extract potential tags (words starting with #)
      const tags = message.content.match(/#[\w-]+/g)?.map(tag => tag.slice(1)) || [];

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

      // Analyze the idea
      const analysis = await analyzeIdea(message.content);

      // Store the idea
      const { data: idea, error: ideaError } = await supabase
        .from('ideas')
        .insert([
          {
            title: message.content.split('\n')[0].slice(0, 100),
            description: message.content,
            proposer_ids: [participant.id],
            source_channel: message.channel.name,
            linked_github_repo_url: githubUrls[0] || null,
            tags,
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

      // Create a thread for discussion
      const thread = await message.startThread({
        name: `💡 ${idea.title}`,
        autoArchiveDuration: 60,
      });

      // Post AI analysis in thread
      await thread.send({
        embeds: [{
          title: '🤖 AI Analysis',
          description: analysis,
          color: 0x00ff00,
        }],
      });

      // React to acknowledge processing
      await message.react('✅');

      // Store GitHub project info if URLs were found
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

// Handle thread messages
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.channel.isThread()) return;

  try {
    const parentMessage = await message.channel.fetchStarterMessage();
    const { data: idea } = await supabase
      .from('ideas')
      .select('*')
      .eq('raw_discord_message.id', parentMessage.id)
      .single();

    if (idea) {
      // Record thread interaction
      await supabase.from('idea_interactions').insert([
        {
          idea_id: idea.id,
          participant_id: message.author.id,
          type: 'comment',
          content: message.content,
        },
      ]);

      // Update engagement score
      await supabase.rpc('update_idea_engagement_score', { idea_id: idea.id });
    }
  } catch (error) {
    console.error('Error processing thread message:', error);
  }
});

// Handle reactions
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;

  try {
    const { data: idea } = await supabase
      .from('ideas')
      .select('*')
      .eq('raw_discord_message.id', reaction.message.id)
      .single();

    if (idea) {
      // Record reaction
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

// Login
client.login(process.env.DISCORD_BOT_TOKEN);