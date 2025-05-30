# ZippyView: Project Task List

This document outlines granular tasks based on the `PLAN_SPEC.md`'s development phases. This is a living document and will be refined as development progresses.

## Phase 1: Foundation & Data Ingestion MVP (Weeks 1-4)

### 1.1. Core Infrastructure Setup
*   [ ] Initialize Git repository (GitHub/GitLab).
*   [ ] Set up Supabase Project:
    *   [ ] Create new Supabase project.
    *   [ ] Define `participants` table schema (basic fields: `id`, `discord_handle`, `github_username`, `registered_at`).
    *   [ ] Define `github_projects` table schema (basic fields: `id`, `repo_url`, `owner_username`, `repo_name`, `last_synced_at`).
    *   [ ] Define `commits` table schema (basic fields: `id`, `project_id`, `commit_hash`, `author_id`, `timestamp`, `message`).
    *   [ ] Define `ideas` table schema (basic fields: `id`, `proposer_ids`, `title`, `description`, `source_channel`, `timestamp`, `linked_github_repo_url`).
    *   [ ] Define `idea_interactions` table schema (basic fields: `id`, `idea_id`, `participant_id`, `type`, `timestamp`).
    *   [ ] Set up Supabase Row Level Security (RLS) for public access to relevant tables.
*   [ ] Set up Bolt.new Project:
    *   [ ] Create new Bolt.new project.
    *   [ ] Connect Bolt.new to Supabase.
    *   [ ] Configure environment variables for API keys (Discord, GitHub, Supabase).
*   [ ] Set up Netlify for Frontend:
    *   [ ] Create new Netlify site.
    *   [ ] Connect to Git repository.

### 1.2. Data Ingestion & Initial Parsing
*   [ ] **Discord Integration:**
    *   [ ] Create Discord bot application and obtain token.
    *   [ ] Develop Bolt.new function to handle Discord webhook events for new messages.
    *   [ ] Implement logic to extract `discord_handle` and message content.
    *   [ ] Store raw Discord messages in a temporary or raw `messages` table for later parsing.
    *   [ ] Initial parsing: Identify potential `github.com` URLs within messages.
*   [ ] **GitHub Integration:**
    *   [ ] Obtain GitHub API token (Personal Access Token for initial dev).
    *   [ ] Develop Bolt.new function to poll GitHub for new commits on identified repositories.
    *   [ ] Develop Bolt.new function to fetch repository metadata (languages, initial LOC).
    *   [ ] Implement logic to store `github_projects` and `commits` data in Supabase.
    *   [ ] Handle rate limits for GitHub API calls.
*   [ ] **Participant Tracking:**
    *   [ ] Automatically create/update `participants` records from Discord handles and GitHub usernames.
*   [ ] **Basic Logging & Error Handling:**
    *   [ ] Implement basic logging for ingestion processes.
    *   [ ] Set up error notifications for failed API calls or parsing.

## Phase 2: Core AI Engine & Basic Analytics (Weeks 5-8)

### 2.1. LLM Integration & Idea Processing
*   [ ] **LLM API Selection:**
    *   [ ] Choose primary LLM provider (e.g., OpenAI, Anthropic).
    *   [ ] Obtain API keys.
*   [ ] **Idea Extraction & Summarization:**
    *   [ ] Develop Bolt.new function (or Python service) to process new raw messages from `messages` table.
    *   [ ] Implement prompt engineering to instruct LLM to:
        *   Identify if a message contains a distinct idea.
        *   Extract a concise `title` and `description` for the idea.
        *   Identify proposer(s) (`participant_ids`).
    *   [ ] Store extracted ideas in the `ideas` table.
    *   [ ] Implement a basic de-duplication strategy for ideas.
*   [ ] **Initial AI Analysis (SWOT & Monetization):**
    *   [ ] Develop Bolt.new function to trigger LLM calls for new ideas.
    *   [ ] Design prompts for LLM to perform basic SWOT analysis on an idea summary.
    *   [ ] Design prompts for LLM to provide a basic monetization potential assessment/score.
    *   [ ] Store results in the `ai_analyses` table and update `ideas` table scores.
*   [ ] **Similarity Detection (Basic):**
    *   [ ] Integrate LLM embedding API (e.g., OpenAI Embeddings).
    *   [ ] Generate embeddings for new idea descriptions.
    *   [ ] Store embeddings in `ideas` table (using `pg_vector` extension).
    *   [ ] Implement basic cosine similarity search to find similar ideas when a new one is added.

### 2.2. Basic Metrics & Data Enrichment
*   [ ] **GitHub Project Metrics:**
    *   [ ] Develop Bolt.new function to calculate Lines of Code (LOC) for `github_projects` (e.g., using `cloc` or similar via a background job).
    *   [ ] Update `github_projects` table with commit count and developer count.
*   [ ] **Idea Engagement Metrics:**
    *   [ ] Aggregate reactions/comments from `idea_interactions` to calculate `current_engagement_score` for `ideas`.

## Phase 3: Frontend MVP & Initial Visualizations (Weeks 9-12)

### 3.1. Frontend Core Development
*   [ ] **Project Setup:**
    *   [ ] Create React/Vue/Angular project (e.g., `create-react-app`, `vue-cli`, `angular-cli`).
    *   [ ] Install Supabase JS SDK.
*   [ ] **Basic Authentication (Optional):**
    *   [ ] Implement basic user login/signup via Supabase Auth (if restricted access is desired).
*   [ ] **Dashboard Layout:**
    *   [ ] Design main dashboard layout (header, left sidebar/main content).
*   [ ] **Idea List View:**
    *   [ ] Fetch and display list of `ideas` from Supabase.
    *   [ ] Implement basic filtering/sorting (e.g., by date, engagement).
    *   [ ] Display basic summary, proposer, and scores for each idea.
*   [ ] **Project List View:**
    *   [ ] Fetch and display list of `github_projects`.
    *   [ ] Display basic stats (commits, devs, LOC).

### 3.2. Initial Visualizations
*   [ ] **Gource-like Video Generation (MVP):**
    *   [ ] Develop a dedicated Python service (or Bolt.new workflow) using MoviePy/FFmpeg.
    *   [ ] Input: Git repository clone and commit data from Supabase.
    *   [ ] Output: Basic MP4 video for a single project (no custom overlays yet).
    *   [ ] Store generated video in Supabase Storage.
*   [ ] **Frontend Video Player:**
    *   [ ] Embed video player in frontend to display generated Gource-like videos.
    *   [ ] Link project cards to their respective video visualizations.
*   [ ] **Idea Heatmap (2D MVP):**
    *   [ ] Use D3.js or a charting library (Chart.js) to create a simple scatter plot or bubble chart.
    *   [ ] Map idea `engagement_score` to size/color.
    *   [ ] Map `monetization_score` to another visual attribute (e.g., brightness).
    *   [ ] Implement basic hover states to show idea title and proposer.

## Phase 4: Viral & Advanced Features (Weeks 13-16)

### 4.1. Advanced AI & Analytics
*   [ ] **Enhanced AI Analysis:**
    *   [ ] Refine LLM prompts for more detailed SWOT components, specific monetization strategies, and nuanced creativity/usefulness scoring.
    *   [ ] Implement tool usage analysis (NLP on idea descriptions and commit messages to infer tools).
    *   [ ] **Multi-LLM Perspective:** Implement API calls to different LLM providers (e.g., Claude, Gemini) and compare/present their unique insights.
    *   [ ] **AI Social Media Caption Generation:** Develop Bolt.new function to generate platform-specific (Twitter, LinkedIn, TikTok, YouTube) captions, hashtags, and suggested text for sharing.

### 4.2. Viral Sharing & Social Integration
*   [ ] **Participant Profile Linking:**
    *   [ ] Develop UI for users to add/edit their social media links in their `participants` profile.
*   [ ] **Personalized Video Generation:**
    *   [ ] Develop UI allowing users to select a timeframe or specific contributions for a personalized Gource-like video export.
    *   [ ] Integrate UI for users to select background music from the `background_music` table.
    *   [ ] Trigger server-side video generation for personalized clips.
*   [ ] **Open Audio Library:**
    *   [ ] Curate initial list of royalty-free background music.
    *   [ ] Upload audio files to Supabase Storage and populate `background_music` table.
*   [ ] **Direct Share Integration:**
    *   [ ] Implement share buttons on video views and idea detail pages (e.g., "Share to Twitter", "Share to Facebook").
    *   [ ] Use platform SDKs or direct share URLs with pre-populated text and video links/thumbnails.
    *   [ ] Investigate and, if feasible, integrate TikTok for direct video uploads.
    *   [ ] Automated daily/hourly general recap video uploads to ZippyView's YouTube channel.

### 4.3. Visualization Enhancement
*   [ ] **Refined Gource-like Visuals:**
    *   [ ] Add on-video text overlays (project name, current date, key stats).
    *   [ ] Improve visual fidelity and smoothness of animations.
*   [ ] **Enhanced Idea Heatmap/Galaxy:**
    *   [ ] Implement interactive clustering of similar ideas.
    *   [ ] Add more filtering and search capabilities (by proposer, tools, channel).
    *   [ ] Implement "drill-down" functionality for idea details from the map.
*   [ ] **Comprehensive Analytics Dashboard:**
    *   [ ] Develop dedicated "Analytics" section in frontend.
    *   [ ] Implement charts for "Hackathon Pulse" (total ideas, projects over time).
    *   [ ] Bar charts for "Tool Popularity" (discussed vs. used).
    *   [ ] Leaderboards for "Participant Engagement".
    *   [ ] Distribution charts for AI scores.

### 4.4. Collaboration & Competition Facilitation
*   [ ] **Similarity Suggestions:**
    *   [ ] Display "Similar Ideas" section in idea detail view with links to other ideas and their similarity scores.
    *   [ ] Implement UI for prompting collaboration suggestions.
*   [ ] **Multi-LLM Critiques Display:**
    *   [ ] Create dedicated UI section for displaying different LLM perspectives on an idea.

### 4.5. Initial 3D Client-Side (Optional/Stretch)
*   [ ] Research and prototype client-side 3D rendering (Three.js/Babylon.js).
*   [ ] Define data format for client-side download of project/idea graph data.
*   [ ] Implement basic interactive fly-through for the code galaxy.

## Phase 5: Testing, Optimization & Deployment (Weeks 17-20+)

### 5.1. Quality Assurance & Performance
*   [ ] **Unit Testing:** Write unit tests for core backend functions, AI logic, and frontend components.
*   [ ] **Integration Testing:** Test data flow from ingestion to database, AI processing, and visualization.
*   [ ] **End-to-End Testing:** Simulate user journeys through the application.
*   [ ] **Performance Benchmarking:**
    *   [ ] Measure latency for data ingestion.
    *   [ ] Benchmark AI processing times and costs.
    *   [ ] Test video generation times and optimize FFmpeg settings.
    *   [ ] Frontend rendering performance (especially for visualizations).
*   [ ] **Load Testing:** Test system under anticipated load (concurrent users, high message/commit volume).

### 5.2. Security & Operations
*   [ ] **API Key Management:** Securely store and rotate API keys (e.g., using Bolt.new secrets).
*   [ ] **Supabase Security:** Review RLS policies, enable SSL, configure database backups.
*   [ ] **Input Validation & Sanitization:** Prevent injection attacks and malformed data.
*   [ ] **Monitoring & Alerting:** Set up monitoring for Bolt.new function execution, Supabase database performance, and frontend errors. Implement alerts for critical issues.

### 5.3. Documentation & Deployment
*   [ ] **User Documentation:** Create guides for hackathon organizers and participants on how to use ZippyView.
*   [ ] **Developer Documentation:** Update `CONTRIBUTING.md`, API documentation, and detailed setup guides.
*   [ ] **Privacy Policy & Terms of Service:** Draft and publish clear legal documents regarding data collection and usage.
*   [ ] **Production Deployment Strategy:** Finalize deployment pipelines for all components (Bolt.new, Supabase, Netlify).
*   [ ] **Launch & Marketing Plan:** Coordinate official launch activities.
