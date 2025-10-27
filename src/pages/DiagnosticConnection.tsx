import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const DiagnosticConnection: React.FC = () => {
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    const checkConnection = async () => {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      setInfo({
        url,
        keyPrefix: key?.substring(0, 50),
        env: import.meta.env,
      });

      // Try to login and check user ID
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@pharma.com',
          password: 'Admin123!'
        });

        if (data?.user) {
          setInfo((prev: any) => ({
            ...prev,
            loggedIn: true,
            userId: data.user.id,
            userEmail: data.user.email,
          }));

          // Try to query users table
          const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, email')
            .limit(1);

          setInfo((prev: any) => ({
            ...prev,
            usersQuery: usersError ? `Error: ${usersError.message}` : `Success: ${users?.length} users`,
          }));
        } else {
          setInfo((prev: any) => ({
            ...prev,
            loggedIn: false,
            error: error?.message,
          }));
        }
      } catch (err: any) {
        setInfo((prev: any) => ({
          ...prev,
          exception: err.message,
        }));
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Database Connection Diagnostic
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Environment Variables
            </h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(info, null, 2)}
            </pre>
          </div>

          {info.url && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Expected Database
              </h3>
              <p className="text-blue-600 dark:text-blue-400">
                https://nuhfqkhplldontxtoxkg.supabase.co
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Expected Admin User ID: 13a6a599-2cda-441b-9d39-54eabb8c08ad
              </p>
            </div>
          )}

          {info.userId && (
            <div className={`mt-4 p-4 rounded ${
              info.userId === '13a6a599-2cda-441b-9d39-54eabb8c08ad'
                ? 'bg-green-100 dark:bg-green-900'
                : 'bg-red-100 dark:bg-red-900'
            }`}>
              <h3 className="font-semibold">
                {info.userId === '13a6a599-2cda-441b-9d39-54eabb8c08ad'
                  ? '✅ Connected to CORRECT database!'
                  : '❌ Connected to WRONG database!'}
              </h3>
              <p className="text-sm mt-2">
                Actual User ID: {info.userId}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Note about Bolt Hosting
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            If the app is connecting to the wrong database, you need to update the environment
            variables in Bolt's deployment settings, not just the .env file. The .env file is
            only used during local development.
          </p>
        </div>
      </div>
    </div>
  );
};
