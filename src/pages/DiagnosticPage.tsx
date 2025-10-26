import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

export const DiagnosticPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [authUser, setAuthUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthUser(session?.user || null);

        if (session?.user) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching user from database:', error);
          }

          setDbUser(data);
        }
      } catch (err) {
        console.error('Diagnostic error:', err);
      } finally {
        setLoading(false);
      }
    };

    runDiagnostics();
  }, []);

  const handleClearSession = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-200 group mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to home</span>
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
          <h1 className="text-3xl font-bold mb-6">Authentication Diagnostic</h1>

          {loading ? (
            <p>Loading diagnostics...</p>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Auth Context Status</h2>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 font-mono text-sm">
                  <p><strong>User exists:</strong> {user ? 'Yes' : 'No'}</p>
                  <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                  <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
                  <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Auth.users Status</h2>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 font-mono text-sm">
                  {authUser ? (
                    <>
                      <p><strong>Email:</strong> {authUser.email}</p>
                      <p><strong>ID:</strong> {authUser.id}</p>
                      <p><strong>Created:</strong> {new Date(authUser.created_at).toLocaleString()}</p>
                      <p><strong>Last Sign In:</strong> {authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at).toLocaleString() : 'Never'}</p>
                      <p><strong>Email Confirmed:</strong> {authUser.email_confirmed_at ? 'Yes' : 'No'}</p>
                    </>
                  ) : (
                    <p className="text-red-600">No active session found</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Public.users Table Status</h2>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 font-mono text-sm">
                  {dbUser ? (
                    <>
                      <p><strong>Email:</strong> {dbUser.email}</p>
                      <p><strong>ID:</strong> {dbUser.id}</p>
                      <p><strong>Name:</strong> {dbUser.first_name} {dbUser.last_name}</p>
                      <p><strong>Is Admin:</strong> {dbUser.is_admin ? 'Yes' : 'No'}</p>
                      <p><strong>Created:</strong> {new Date(dbUser.created_at).toLocaleString()}</p>
                    </>
                  ) : (
                    <p className="text-red-600">User record not found in database!</p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <h2 className="text-xl font-semibold mb-3">Diagnosis</h2>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  {!authUser && (
                    <p className="text-amber-800 dark:text-amber-200">
                      ❌ You are not logged in. Please sign up or log in.
                    </p>
                  )}
                  {authUser && !dbUser && (
                    <p className="text-amber-800 dark:text-amber-200">
                      ⚠️ Auth session exists but user record is missing! The trigger may have failed. Try signing out and back in.
                    </p>
                  )}
                  {authUser && dbUser && !dbUser.is_admin && dbUser.email === 'pharmadiscountfinder@gmail.com' && (
                    <p className="text-red-800 dark:text-red-200">
                      ❌ Email is pharmadiscountfinder@gmail.com but is_admin is FALSE! Database trigger failed.
                    </p>
                  )}
                  {authUser && dbUser && dbUser.is_admin && (
                    <p className="text-green-800 dark:text-green-200">
                      ✅ Everything looks correct! You should be redirected to /admin
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleClearSession} variant="outline">
                  Clear Session & Logout
                </Button>
                {dbUser && !dbUser.is_admin && dbUser.email === 'pharmadiscountfinder@gmail.com' && (
                  <Button onClick={async () => {
                    await supabase.from('users').update({ is_admin: true }).eq('id', dbUser.id);
                    window.location.reload();
                  }}>
                    Fix Admin Status
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
