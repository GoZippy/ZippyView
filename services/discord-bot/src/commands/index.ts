import { SlashCommandBuilder } from 'discord.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('analyze')
    .setDescription('Analyze a project idea')
    .addStringOption(option =>
      option
        .setName('idea')
        .setDescription('The project idea to analyze')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('track')
    .setDescription('Track a GitHub repository')
    .addStringOption(option =>
      option
        .setName('url')
        .setDescription('The GitHub repository URL')
        .setRequired(true)
    ),
];