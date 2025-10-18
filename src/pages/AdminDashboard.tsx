import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Database,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AdminMain } from '../components/AdminMain';
import { AdminUsers } from '../components/AdminUsers';
import { AdminDatabase } from '../components/AdminDatabase';

type TabType = 'main' | 'users' | 'database';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('main');

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

  const tabs = [
    {
      id: 'main' as TabType,
      label: 'Main',
      icon: LayoutDashboard,
      description: 'Dashboard overview and analytics'
    },
    {
      id: 'users' as TabType,
      label: 'Users',
      icon: Users,
      description: 'User management and permissions'
    },
    {
      id: 'database' as TabType,
      label: 'Database',
      icon: Database,
      description: 'Data uploads and management'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
              <p className="text-muted-foreground">Manage platform operations and users</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 border-b border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-t-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-background border-t-2 border-x border-primary text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                  <div className="text-left">
                    <div className={`font-semibold ${isActive ? 'text-primary' : ''}`}>
                      {tab.label}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="animate-in fade-in duration-300">
          {activeTab === 'main' && <AdminMain />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'database' && <AdminDatabase />}
        </div>
      </div>
    </div>
  );
};
