import create from 'zustand';
import { supabase } from '../lib/supabase';
import { analyzeIdea } from '../lib/gemini';

interface IdeaState {
  ideas: any[];
  loading: boolean;
  error: string | null;
  fetchIdeas: () => Promise<void>;
  addIdea: (idea: any) => Promise<void>;
}

export const useIdeaStore = create<IdeaState>((set) => ({
  ideas: [],
  loading: false,
  error: null,
  
  fetchIdeas: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      set({ ideas: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  addIdea: async (idea) => {
    set({ loading: true });
    try {
      const analysis = await analyzeIdea(idea.description);
      
      const { data, error } = await supabase
        .from('ideas')
        .insert([{ ...idea, ai_analysis: analysis }])
        .select();
        
      if (error) throw error;
      
      set(state => ({
        ideas: [data[0], ...state.ideas],
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));