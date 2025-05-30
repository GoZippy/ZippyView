# ZippyView

## Overview
ZippyView is a comprehensive platform for visualizing and analyzing hackathon projects and ideas. It combines real-time data ingestion from Discord and GitHub with AI-powered analysis and dynamic visualizations.

## Features
- Real-time idea tracking from Discord
- GitHub repository monitoring and visualization
- AI-powered project analysis
- Interactive idea visualization
- Video generation for project progress

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Services

### Web Interface
The main web application for visualizing and interacting with hackathon data.

### Discord Bot
Monitors Discord channels for new ideas and GitHub repository links.

### Video Generator
Creates visual representations of project progress and contributions.

### Shared Package
Common utilities, types, and database interactions used across services.

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License
GNU General Public License v3.0