import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Processing OAuth callback');
        console.log('Current URL:', window.location.href);

        // The Supabase client with detectSessionInUrl: true will automatically
        // detect and process the OAuth callback. We just need to wait a moment
        // for it to complete, then check for the session.
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Get the current session (should be established by now)
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(sessionError.message);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (data.session) {
          console.log('Session established:', data.session.user.email);
          const user = data.session.user;

          // Wait for the trigger to create the user record
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check admin status from database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', user.id)
            .maybeSingle();

          if (userError) {
            console.error('Error fetching user data:', userError);
            console.log('User not found in database, they might be new');
          }

          const isAdmin = userData?.is_admin || false;
          console.log('User admin status:', isAdmin);

          // Update last login
          try {
            await supabase.rpc('update_last_login');
          } catch (err) {
            console.error('Error updating last login (may not exist yet):', err);
          }

          console.log('Redirecting to:', isAdmin ? '/admin' : '/dashboard');
          navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
        } else {
          console.log('No session found after OAuth, redirecting to login');
          setTimeout(() => navigate('/login', { replace: true }), 1000);
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
