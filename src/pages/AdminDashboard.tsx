import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Database,
  Shield,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AdminMain } from '../components/AdminMain';
import { AdminUsers } from '../components/AdminUsers';
import { AdminDatabase } from '../components/AdminDatabase';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [user, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Manage platform operations and users
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full sm:w-auto grid-cols-3 sm:inline-flex">
              <TabsTrigger value="dashboard" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="gap-2">
                <Database className="w-4 h-4" />
                <span>Database</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AdminMain />
            </TabsContent>

            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>

            <TabsContent value="database">
              <AdminDatabase />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
