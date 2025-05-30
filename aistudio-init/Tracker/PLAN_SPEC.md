# ZippyView: Project Plan Specification

## 1. Project Vision

**ZippyView** aims to be the definitive platform for hackathon observation and engagement. By leveraging modern cloud tools (Bolt.new, Supabase, Netlify) and advanced AI, ZippyView will transform hackathon activity – from emergent ideas in chat channels to real-time code contributions on GitHub – into dynamic, insightful, and highly shareable visualizations. Beyond mere tracking, the platform seeks to foster enhanced collaboration, provide deep analytical insights into project viability, and empower participants to virally showcase their contributions, ultimately becoming an essential tool for hackathon participants, organizers, and potential investors.

## 2. Key Goals

*   **Automated & Comprehensive Data Capture:** Reliably and continuously ingest ideas, discussions, code commits, and participant data from diverse public communication channels (Discord, Slack, forums) and GitHub.
*   **Rich & Diverse Visualizations:** Deliver intuitive and dynamic visual representations of code contributions (Gource-like animations), idea evolution (interactive heatmaps/galaxy views), and overall hackathon trends, available both as pre-rendered videos and potential client-side interactive 3D experiences.
*   **AI-Powered Deep Insights:** Generate actionable, objective analyses for each unique idea, including concise summaries, comprehensive SWOT analyses focused on monetization potential, creativity/usefulness scores, and detailed tool usage insights.
*   **Facilitate Community Engagement & Collaboration:** Identify similar ideas to encourage collaboration or friendly competition, provide multi-LLM perspective critiques for constructive feedback, and offer analytics that foster a healthy hackathon environment.
*   **Enable Viral Marketing & Social Sharing:** Empower participants to easily generate and share personalized, engaging visualizations of their contributions across major social media platforms (YouTube, Twitter, TikTok, etc.) with AI-generated captions and pre-selected audio.
*   **Scalable, Robust & Deployable:** Build using a modern, integrated serverless-first tech stack suitable for rapid development, efficient scaling, and reliable deployment, prioritizing Bolt.new, Netlify, and Supabase.
*   **User & Participant Focus:** Ensure the platform provides tangible value to participants (showcasing their work) and organizers (understanding event dynamics).

## 3. Architectural Components & Proposed Technologies

### 3.1. Data Ingestion & Orchestration Layer
*   **Purpose:** The primary interface for collecting raw data from external sources and orchestrating subsequent processing workflows.
*   **Technologies:**
    *   **Bolt.new:** The core backend orchestrator for:
        *   Scheduling recurrent tasks (e.g., polling GitHub, scanning older chat history).
        *   Handling real-time event-driven functions (e.g., Discord webhooks).
        *   Managing data flow pipelines to the database and subsequent processing steps.
        *   Potentially managing long-running tasks for video generation.
    *   **Discord API, Slack API, Forum APIs/Scraping:** Programmatic interfaces to designated public channels for message monitoring, reactions, and user activity. Prioritize webhooks for real-time where available.
    *   **GitHub API:** For comprehensive tracking of shared repositories: commits, contributors, branches, file changes, and new repo creation events.
    *   **Python/Node.js Functions (within Bolt.new or Supabase Edge Functions):** Lightweight, serverless functions to handle API integrations, data parsing, initial sanitization, and pushing raw data to the database.
    *   **Social Media Profile Integration:**
        *   User-facing form for participants to voluntarily link their social media profiles (Twitter, LinkedIn, YouTube, TikTok, Facebook).
        *   (Future/Stretch Goal - Highly Sensitive): Exploration of social media search APIs to attempt programmatic association based on common identifiers (Discord handle, GitHub username), with strict privacy adherence and user consent.

### 3.2. Data Storage & Real-time Backbone
*   **Purpose:** To durably store all raw and processed hackathon data, and provide real-time updates to connected frontends.
*   **Technologies:**
    *   **Supabase (PostgreSQL Database):** Central, scalable, and real-time-enabled data repository.
        *   **`ideas` table:** `id (PK), proposer_ids (FK to participants), title, description (AI-summarized), raw_source_url, source_channel, proposed_tools, final_tools_used, linked_github_repo_url (FK), timestamp, current_engagement_score, monetization_score, creativity_score, usefulness_score`.
        *   **`idea_interactions` table:** `id (PK), idea_id (FK), participant_id (FK), type (comment/reaction/share), content, timestamp`.
        *   **`github_projects` table:** `id (PK), repo_url (UNIQUE), owner_username, repo_name, current_stats (LOC, commit_count, dev_count), languages (JSONB), last_synced_at`.
        *   **`commits` table:** `id (PK), project_id (FK), commit_hash, author_id (FK to participants), timestamp, message, file_changes (JSONB - added/modified/deleted files)`.
        *   **`participants` table:** `id (PK), discord_handle, github_username, email (optional), social_media_links (JSONB - {twitter_url, linkedin_url, tiktok_url, youtube_url, etc.}), registered_at`.
        *   **`ai_analyses` table:** `id (PK), idea_id (FK), type (summary, swot, monetization_explanation, multi_llm_critique), content (TEXT), llm_model_used, analysis_timestamp`.
        *   **`media_assets` table:** `id (PK), related_entity_id (FK to project/idea/participant), asset_type (video/thumbnail), storage_path (Supabase Storage URL), associated_social_media_caption (TEXT), background_music_id (FK), generated_at`.
        *   **`background_music` table:** `id (PK), title, artist, storage_path, license_info`.
    *   **Supabase Realtime:** For real-time synchronization of data changes to the frontend, crucial for dynamic visualizations and immediate updates.
    *   **Supabase Storage:** For storing generated video files and making them accessible via CDN.

### 3.3. AI & Analytics Engine
*   **Purpose:** To perform deep analysis on collected textual data, extract insights, generate summaries, evaluate ideas, detect relationships, and craft engaging social media content.
*   **Technologies:**
    *   **Python (with FastAPI/Flask):** For developing a scalable API layer that orchestrates LLM calls and complex data transformations. Can run as a separate service or integrated with Bolt.new.
    *   **Large Language Models (LLMs):**
        *   **Idea Extraction & Summarization:** Advanced prompt engineering to distill concise ideas and generate summaries from chat data.
        *   **SWOT Analysis & Monetization:** Structured prompting for business-centric evaluations of ideas.
        *   **Creativity & Usefulness Metrics:** LLM-driven scoring based on predefined criteria, augmented by community interactions.
        *   **Tool Usage Analysis:** NLP to identify and compare discussed vs. used tools.
        *   **Similarity Detection:** LLM embeddings (e.g., OpenAI Embeddings API) stored with `pg_vector` in Supabase for cosine similarity search to identify similar ideas.
        *   **Multi-LLM Perspective Generation:** Route idea summaries through different LLM providers/models for varied critiques.
        *   **Automated Social Media Caption Generation:** LLMs generate compelling short video descriptions, hashtags, and suggested text, tailored for different platforms and viral potential.
    *   **NLTK/spaCy/Scikit-learn:** For complementary traditional NLP tasks like tokenization, named entity recognition, and text classification for initial data cleaning/feature extraction.

### 3.4. Visualization & Frontend
*   **Purpose:** To render interactive dashboards and compelling dynamic visualizations, make complex data easily digestible, and provide tools for viral content creation and sharing.
*   **Technologies:**
    *   **Netlify:** For high-performance static site hosting of the frontend web application.
    *   **React/Vue/Angular:** A robust JavaScript framework for building a responsive and interactive user interface.
    *   **D3.js / p5.js:** For creating highly customized and dynamic 2D visualizations (Idea Heatmap, analytics charts).
    *   **Three.js / Babylon.js:** For future client-side interactive 3D visualizations (e.g., the 3D Code Galaxy view).
    *   **Chart.js / Plotly:** For standard statistical charts and graphs.
    *   **Supabase Realtime SDK:** To subscribe to database changes and update frontend visualizations in real-time.
    *   **Social Media SDKs/APIs:** For embedding share buttons and facilitating direct content sharing to platforms.

### 3.5. Server-Side Video Generation Service
*   **Purpose:** To programmatically produce high-quality, animated video files of code contributions and other dynamic visualizations.
*   **Technologies:**
    *   **Python:** The primary language for video processing.
    *   **MoviePy / FFmpeg:** Essential libraries for programmatic video creation, merging, overlaying text/graphics, adding audio tracks, and performing efficient video encoding.
    *   **Bolt.new / Cloud Compute:** To orchestrate video generation tasks, potentially spinning up dedicated, ephemeral compute instances for heavy processing if necessary.
    *   **Supabase Storage:** The destination for generated video files.

## 4. High-Level Feature Breakdown

*   **4.1. Core Hackathon Activity Monitoring:**
    *   Configurable connections to public Discord, Slack channels, and specified forums for message intake.
    *   Scheduled scanning and real-time webhook processing for new messages, discussions, and reactions.
    *   Intelligent extraction of potential ideas (titles, descriptions, linked GitHub repo URLs) from raw chat data.
    *   Tracking of user profiles (Discord handle, GitHub username) and enabling users to link social media accounts.
*   **4.2. Project Progress Visualization (Gource-Inspired):**
    *   Automated, periodic (e.g., daily/hourly) fetching and processing of commit data for all identified public GitHub repositories.
    *   **Server-Side Video Generation:** Continuous generation of animated videos (like Gource) showcasing code contributions, new developers, file changes, and overall project evolution.
        *   Overall hackathon summary videos.
        *   Individual project videos.
        *   Personalized developer contribution videos.
    *   **Integrated Audio:** Selection of background music from a curated, royalty-free library for generated videos.
    *   **Web-based Viewing:** An interface to view and explore these videos.
    *   **Interactive 3D Code Galaxy (Future/Advanced):** A client-side web application or downloadable tool allowing users to navigate an immersive 3D visualization of all projects, contributors, and files, with direct links to GitHub artifacts and locally rendered summary statistics.
*   **4.3. Idea Stream Tracking & Heatmap:**
    *   A consolidated, filterable list of all extracted ideas, attributed to proposer(s) and source channels.
    *   An interactive "heat map" or "galaxy" visualization where ideas are represented as nodes, with their size/color correlating to community engagement, discussion volume, or AI-derived scores (e.g., monetization potential).
    *   Ability to drill down into each idea for detailed analysis.
*   **4.4. AI-Powered Idea Analysis & Scoring:**
    *   **Idea Summarization:** Concise, AI-generated summaries for each distinct idea.
    *   **SWOT Analysis:** Automated SWOT analysis focusing on business case, market viability, and monetization potential.
    *   **Creativity & Usefulness Metrics:** Quantifiable scores for ideas based on defined criteria, augmented by community feedback.
    *   **Tool Usage Analysis:** Identification and visualization of discussed tools versus actual tools used (inferred from codebases/descriptions).
    *   **Similarity Detection:** Automated identification and visualization of similar or duplicate ideas, with a "similarity score" to encourage collaboration or challenge.
*   **4.5. Collaboration & Competition Facilitation:**
    *   Proactive suggestions to participants with similar ideas to collaborate or initiate friendly "build-off" challenges.
    *   Option to request multi-LLM perspective reviews on an idea, offering diverse viewpoints and constructive criticism.
*   **4.6. Viral Sharing & Social Media Integration:**
    *   **Participant Profile Management:** User interface for participants to voluntarily provide their social media links.
    *   **Personalized Content Generation:** Easy-to-use tools for participants to generate short, custom video clips of their individual contributions or project highlights from the ZippyView platform.
    *   **AI-Generated Share Prompts:** LLM-generated social media captions, hashtags, and suggested text optimized for viral sharing (e.g., "Look what I built in 24 hours with Bolt.new!").
    *   **Direct Share Options:** Seamless integration with social media APIs (where permissible) to enable direct sharing to Twitter, Facebook, LinkedIn, TikTok, and YouTube, pre-populating content.
    *   **Automated Platform Publishing:** Scheduled uploads of general hackathon recap videos and key highlight reels to ZippyView's official social media channels.
*   **4.7. Comprehensive Analytics Dashboard:**
    *   High-level overview of hackathon engagement (total ideas, active projects, participant activity, total LOC).
    *   Breakdowns of popular ideas, trending tools, and top contributing teams/individuals.
    *   Exportable data and summary reports for organizers.

## 5. High-Level Development Phases

### Phase 1: Foundation & Data Ingestion MVP (Weeks 1-4)
*   **Goal:** Establish core infrastructure and reliably ingest raw data from Discord and GitHub.
*   **Tasks:**
    *   **Project Setup:**
        *   Initialize Git repository.
        *   Create Supabase project and define initial database schema (`participants`, `github_projects`, `commits`, `ideas`, `idea_interactions`).
        *   Set up initial Bolt.new project.
        *   Configure Netlify for frontend deployment.
    *   **Data Ingestion:**
        *   Implement Discord API integration (webhooks for real-time messages).
        *   Implement GitHub API integration (polling for repo creation, commits, PRs, file changes).
        *   Develop Bolt.new functions to parse raw Discord messages and GitHub events, storing them in Supabase.
        *   Set up basic logging and error handling for data ingestion.

### Phase 2: Core AI Engine & Basic Analytics (Weeks 5-8)
*   **Goal:** Process raw data into initial insights using AI and implement basic idea/project metrics.
*   **Tasks:**
    *   **LLM Integration:** Integrate with chosen LLM APIs (e.g., OpenAI).
    *   **Idea Processing:**
        *   Develop Bolt.new function (or Python service) to process new raw messages from `messages` table.
        *   Implement prompt engineering to instruct LLM to:
            *   Identify if a message contains a distinct idea.
            *   Extract a concise `title` and `description` for the idea.
            *   Identify proposer(s) (`participant_ids`).
        *   Store extracted ideas in the `ideas` table.
        *   Implement a basic de-duplication strategy for ideas.
    *   **Initial AI Analysis (SWOT & Monetization):**
        *   Develop Bolt.new function to trigger LLM calls for new ideas.
        *   Design prompts for LLM to perform basic SWOT analysis on an idea summary.
        *   Design prompts for LLM to provide a basic monetization potential assessment/score.
        *   Store results in the `ai_analyses` table and update `ideas` table scores.
    *   **Similarity Detection (Basic):**
        *   Integrate LLM embedding API (e.g., OpenAI Embeddings).
        *   Generate embeddings for new idea descriptions.
        *   Store embeddings in `ideas` table (using `pg_vector` extension).
        *   Implement basic cosine similarity search to find similar ideas when a new one is added.

### Phase 3: Frontend MVP & Initial Visualizations (Weeks 9-12)
*   **Goal:** Build a functional web application with basic views and the first interactive visualizations.
*   **Tasks:**
    *   **Frontend Development:**
        *   Set up React/Vue/Angular frontend project.
        *   Connect frontend to Supabase via SDK (including Realtime).
        *   Implement basic authentication (if required).
        *   Create a simple dashboard view showing recent ideas and top projects.
    *   **Gource-like Video Generation (MVP):**
        *   Develop a dedicated Python service (or Bolt.new workflow) using MoviePy/FFmpeg.
        *   Input: Git repository clone and commit data from Supabase.
        *   Output: Basic MP4 video for a single project (no custom overlays yet).
        *   Store generated video in Supabase Storage.
    *   **Frontend Video Player:**
        *   Embed video player in frontend to display generated Gource-like videos.
        *   Link project cards to their respective video visualizations.
    *   **Idea Heatmap (2D MVP):**
        *   Use D3.js or a charting library (Chart.js) to create a simple scatter plot or bubble chart.
        *   Map idea `engagement_score` to size/color.
        *   Map `monetization_score` to another visual attribute (e.g., brightness).
        *   Implement basic hover states to show idea title and proposer.

### Phase 4: Viral & Advanced Features (Weeks 13-16)
*   **Goal:** Enhance AI, refine visualizations, implement viral sharing capabilities, and build out advanced analytics.
*   **Tasks:**
    *   **Advanced AI:**
        *   Refine LLM prompts for more detailed SWOT components, specific monetization strategies, and nuanced creativity/usefulness scoring.
        *   Implement tool usage analysis (NLP on idea descriptions and commit messages to infer tools).
        *   **Multi-LLM Perspective:** Implement API calls to different LLM providers (e.g., Claude, Gemini) and compare/present their unique insights.
        *   **AI Social Media Caption Generation:** Develop Bolt.new function to generate platform-specific (Twitter, LinkedIn, TikTok, YouTube) captions, hashtags, and suggested text for sharing.
    *   **Viral Sharing:**
        *   Implement participant profile management allowing social media link input.
        *   Develop UI for users to select timeframe or specific contributions for personalized Gource-like video export.
        *   Integrate UI for users to select background music from the `background_music` table.
        *   Trigger server-side video generation for personalized clips.
        *   **Open Audio Library:** Curate initial list of royalty-free background music. Upload audio files to Supabase Storage and populate `background_music` table.
        *   **Direct Share Integration:** Implement share buttons on video views and idea detail pages (e.g., "Share to Twitter", "Share to Facebook"). Use platform SDKs or direct share URLs with pre-populated text and video links/thumbnails.
        *   (If feasible) Investigate and implement TikTok API integration.
        *   Automate daily/hourly general recap video uploads to ZippyView's YouTube channel.
    *   **Visualization Enhancement:**
        *   Refine Gource-like video generation (overlays, transitions).
        *   Enhance Idea Heatmap with more interactive filters and clustering.
        *   Develop comprehensive analytics dashboard with various charts (tool popularity, participant engagement, score distribution).
    *   **Collaboration & Competition Facilitation:**
        *   Implement UI for suggesting collaborations or challenges based on similar ideas.
        *   Display multi-LLM critiques directly in the idea detail view.
    *   **Initial 3D Client-Side (Optional/Stretch):**
        *   Research and prototype client-side 3D rendering (Three.js/Babylon.js).
        *   Define data format for client-side download of project/idea graph data.
        *   Implement basic interactive fly-through for the code galaxy.

### 5. Testing, Optimization & Deployment (Weeks 17-20+)
*   **Goal:** Ensure robustness, performance, security, and prepare for public launch.
*   **Tasks:**
    *   Comprehensive unit, integration, and end-to-end testing.
    *   Performance optimization for data ingestion, AI processing, and video generation.
    *   Security audits (Supabase RLS, API key management, input sanitization).
    *   Monitoring and alerting setup.
    *   Documentation for users and developers.
    *   Prepare for public launch and ongoing maintenance plan.

## 6. Potential Challenges & Considerations

*   **API Rate Limits & Compliance:** Managing interactions with Discord, GitHub, and social media APIs to avoid rate limits and adhere to terms of service. Social media APIs, particularly TikTok, have strict guidelines and often require approval for content publishing.
*   **Data Volume & Cost:** Managing the storage of large amounts of raw chat data, commit history, and the computational cost of extensive LLM API calls and video generation, especially as the number of hackathons/participants grows.
*   **AI Model Accuracy & Bias:** Ensuring LLM outputs (summaries, SWOT, scores, social media captions) are accurate, relevant, unbiased, and free from undesirable hallucinations. Requires robust prompt engineering, potential fine-tuning, and human-in-the-loop validation for critical outputs.
*   **User Privacy & Data Consent:** Absolutely critical to clearly communicate what public data is collected, how it's analyzed, and how it will be presented/shared. Obtaining explicit consent for linking social media profiles and for user-specific content generation/sharing is paramount.
*   **Real-time Performance & Scalability:** Optimizing the entire pipeline from ingestion to visualization for near real-time updates without overwhelming system resources. This will influence infrastructure choices (serverless vs. dedicated compute for video).
*   **Custom Visualization Complexity:** Developing and optimizing complex Gource-like and interactive 3D visualizations that perform well across diverse web environments and client devices.
*   **Open Audio Licensing:** Diligently ensuring all background music options offered are truly free-to-use under appropriate open licenses (e.g., Creative Commons) to avoid legal issues.
*   **Content Moderation:** Implementing a system to review user-generated text or custom video inputs to ensure they align with community guidelines and platform values.

---