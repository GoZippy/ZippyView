import { create } from 'zustand';
import { supabase } from '@zippyview/shared';
import type { Database } from '@zippyview/shared/src/types/supabase';

type Idea = Database['public']['Tables']['ideas']['Row'];
type NewIdea = Database['public']['Tables']['ideas']['Insert'];

interface IdeaStore {
  ideas: Idea[];
  loading: boolean;
  error: string | null;
  fetchIdeas: () => Promise<void>;
  addIdea: (idea: NewIdea) => Promise<void>;
}

export const useIdeaStore = create<IdeaStore>((set, get) => ({
  ideas: [],
  loading: false,
  error: null,

  fetchIdeas: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ ideas: data || [] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch ideas' });
    } finally {
      set({ loading: false });
    }
  },

  addIdea: async (idea) => {
    const { error } = await supabase.from('ideas').insert(idea);
    if (error) throw error;
    get().fetchIdeas();
  },
}));