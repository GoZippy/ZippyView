export interface Database {
  public: {
    Tables: {
      ideas: {
        Row: {
          id: string;
          title: string;
          description: string;
          proposer_ids: string[];
          source_channel: string;
          linked_github_repo_url?: string;
          raw_analysis: string;
          engagement_score: number;
          monetization_score: number;
          creativity_score: number;
          usefulness_score: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ideas']['Row'], 'id' | 'created_at'>;
      };
      github_projects: {
        Row: {
          id: string;
          repo_url: string;
          owner_username: string;
          repo_name: string;
          last_synced_at: string;
          current_stats?: {
            loc: number;
            commit_count: number;
            dev_count: number;
          };
        };
        Insert: Omit<Database['public']['Tables']['github_projects']['Row'], 'id'>;
      };
    };
  };
}