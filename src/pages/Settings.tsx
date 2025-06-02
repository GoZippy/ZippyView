import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuthStore } from '../store/authStore';

export const Settings: React.FC = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { githubToken, setGithubToken } = useAuthStore();
  const [token, setToken] = React.useState(githubToken || '');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSave = async () => {
    if (!session?.user) return;
    
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          github_token: token,
        });

      if (updateError) throw updateError;

      setGithubToken(token);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">GitHub Integration</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="github-token" className="block text-sm font-medium mb-2">
              Personal Access Token
            </label>
            <input
              id="github-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ghp_************************************"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm">Settings saved successfully!</div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};