import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  Heart,
  FileText,
  TrendingDown,
  ExternalLink,
  Pill,
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button, Card, Input, Badge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SavedProgram {
  id: string;
  program_id: string;
  created_at: string;
  pharma_programs: {
    medication_name: string;
    manufacturer: string;
    discount_amount: string;
  };
}

interface Activity {
  id: string;
  medication_name: string;
  action_type: string;
  created_at: string;
}

interface UserProfile {
  first_name: string;
  last_name: string;
}

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedPrograms, setSavedPrograms] = useState<SavedProgram[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('first_name, last_name')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile) {
      setUserProfile(profile);
    }

    const { data: saved, error: savedError } = await supabase
      .from('saved_programs')
      .select(`
        id,
        program_id,
        created_at,
        pharma_programs (
          medication_name,
          manufacturer,
          discount_amount
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!savedError && saved) {
      setSavedPrograms(saved as SavedProgram[]);
    }

    const { data: activity, error: activityError } = await supabase
      .from('user_activity')
      .select('id, medication_name, action_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!activityError && activity) {
      setRecentActivity(activity);
    }

    setLoading(false);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  };

  const quickActions = [
    { icon: Search, label: 'Search Programs', action: () => navigate('/'), count: undefined },
    { icon: Heart, label: 'Saved Programs', count: savedPrograms.length },
    { icon: FileText, label: 'Documents', count: 0 },
    { icon: Clock, label: 'Recent Searches', count: recentActivity.length }
  ];

  const calculateSavings = () => {
    const averageSavingsPerProgram = 150;
    const monthly = savedPrograms.length * averageSavingsPerProgram;
    const yearly = monthly * 12;
    return { monthly, yearly, programs: savedPrograms.length };
  };

  const savingsEstimate = calculateSavings();

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          {userProfile && (
            <p className="text-xl font-semibold text-foreground mb-1">
              {userProfile.first_name} {userProfile.last_name}
            </p>
          )}
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={action.action}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <action.icon className="w-6 h-6 text-primary" />
                </div>
                {action.count !== undefined && (
                  <Badge variant="secondary">{action.count}</Badge>
                )}
              </div>
              <h3 className="font-semibold">{action.label}</h3>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Monthly Savings</h3>
            </div>
            <p className="text-3xl font-bold text-primary mb-2">
              ${savingsEstimate.monthly}
            </p>
            <p className="text-sm text-muted-foreground">
              Estimated from {savingsEstimate.programs} programs
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-semibold">Yearly Savings</h3>
            </div>
            <p className="text-3xl font-bold text-secondary mb-2">
              ${savingsEstimate.yearly}
            </p>
            <p className="text-sm text-muted-foreground">
              Potential annual savings
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/50 to-accent/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Pill className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Active Programs</h3>
            </div>
            <p className="text-3xl font-bold mb-2">
              {savingsEstimate.programs}
            </p>
            <p className="text-sm text-muted-foreground">
              Programs you're enrolled in
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No activity yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start searching for medications to see your activity
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Pill className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">{activity.medication_name}</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        {activity.action_type === 'viewed' && 'Viewed savings program'}
                        {activity.action_type === 'saved' && 'Saved to favorites'}
                        {activity.action_type === 'downloaded' && 'Downloaded information'}
                        {activity.action_type === 'searched' && 'Searched for program'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{getTimeAgo(activity.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Saved Programs</h2>
              <Button variant="ghost" size="sm">Manage</Button>
            </div>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : savedPrograms.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No saved programs yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start searching for medications to save programs
                </p>
                <Button onClick={() => navigate('/')}>
                  Search Programs
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedPrograms.map((program) => (
                  <div key={program.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{program.pharma_programs.medication_name}</h4>
                      <p className="text-sm text-muted-foreground">{program.pharma_programs.manufacturer}</p>
                      <p className="text-sm text-primary font-medium mt-1">
                        {program.pharma_programs.discount_amount || 'Contact for details'}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {savedPrograms.length > 0 && (
          <Card className="p-6 mt-6 border-primary/20 bg-primary/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Keep Your Programs Active</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Some discount programs require periodic renewal. Check with each program for their specific requirements.
                </p>
                <Button variant="default" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Saved Programs
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
