import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ADMIN_EMAIL = 'pharmadiscountfinder@gmail.com';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error: authError } = await supabase.auth.getSession();

        if (authError) {
          console.error('Auth callback error:', authError);
          setError(authError.message);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (data.session) {
          console.log('Session established:', data.session);
          const user = data.session.user;

          // Check if user profile exists, if not create one
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!existingProfile) {
            console.log('Creating user profile for OAuth user');
            // Extract name from user metadata (Google OAuth provides this)
            const fullName = user.user_metadata?.full_name || '';
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0] || user.email?.split('@')[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                user_id: user.id,
                first_name: firstName,
                last_name: lastName,
              });

            if (profileError) {
              console.error('Failed to create profile:', profileError);
            } else {
              console.log('User profile created successfully');
            }
          }

          const isAdmin = user.email === ADMIN_EMAIL;
          navigate(isAdmin ? '/admin' : '/dashboard');
        } else {
          console.log('No session found, redirecting to login');
          navigate('/login');
        }
      } catch (err) {
        console.error('Unexpected callback error:', err);
        setError('An unexpected error occurred during authentication.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Authentication Error</h2>
          <p className="text-muted-foreground text-center mb-4">{error}</p>
          <p className="text-sm text-muted-foreground text-center">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-center mb-2">Completing Sign In</h2>
        <p className="text-muted-foreground text-center">Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
};
