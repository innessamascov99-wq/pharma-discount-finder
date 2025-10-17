import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  FileText,
  ExternalLink,
  Pill,
  Phone,
  Loader2,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { searchDrugs, Drug } from '../services/searchService';

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

interface ActivityStats {
  medication_name: string;
  count: number;
}

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Drug[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user]);

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

    const { data: activity, error: activityError } = await supabase
      .from('user_activity')
      .select('id, medication_name, action_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!activityError && activity) {
      setRecentActivity(activity);
      calculateActivityStats(activity);
    }

    setLoading(false);
  };

  const calculateActivityStats = (activities: Activity[]) => {
    const statsMap = new Map<string, number>();

    activities.forEach(activity => {
      const count = statsMap.get(activity.medication_name) || 0;
      statsMap.set(activity.medication_name, count + 1);
    });

    const stats = Array.from(statsMap.entries())
      .map(([medication_name, count]) => ({ medication_name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setActivityStats(stats);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const results = await searchDrugs(searchQuery);
      setSearchResults(results);

      if (user && searchQuery.trim()) {
        await supabase.from('user_activity').insert({
          user_id: user.id,
          medication_name: searchQuery,
          action_type: 'searched',
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
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

  const maxCount = Math.max(...activityStats.map(s => s.count), 1);

  const quickActions = [
    { icon: FileText, label: 'All Programs', action: () => navigate('/programs'), count: undefined },
    { icon: Clock, label: 'Recent Searches', count: recentActivity.length },
    { icon: TrendingUp, label: 'Activity Stats', count: activityStats.length }
  ];

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

        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Search Discount Programs</h2>
            <p className="text-muted-foreground">
              Find savings on your medications
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by medication name, manufacturer, or condition..."
                className="pl-12 h-14 text-base"
                disabled={searching}
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10"
                disabled={searching}
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </Button>
            </div>
          </form>

          {searchResults.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
              <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2">
                {searchResults.map((program) => (
                  <Card key={program.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-primary mb-1">
                            {program.medication_name}
                          </h3>
                          {program.generic_name && (
                            <p className="text-sm text-muted-foreground mb-2">
                              Generic: {program.generic_name}
                            </p>
                          )}
                          <p className="text-lg font-semibold text-foreground mb-1">
                            {program.program_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            by {program.manufacturer}
                          </p>
                        </div>
                        {program.discount_amount && (
                          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-center">
                            <p className="text-sm font-medium">Savings</p>
                            <p className="text-lg font-bold whitespace-nowrap">
                              {program.discount_amount}
                            </p>
                          </div>
                        )}
                      </div>

                      {program.program_description && (
                        <p className="text-foreground/80">
                          {program.program_description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 pt-2">
                        {program.program_url && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => window.open(program.program_url, '_blank')}
                            className="gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Visit Program Website
                          </Button>
                        )}
                        {program.phone_number && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`tel:${program.phone_number}`, '_self')}
                            className="gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            {program.phone_number}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <span className="text-2xl font-bold text-primary">{action.count}</span>
                )}
              </div>
              <h3 className="font-semibold">{action.label}</h3>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Top Searched Medications</h2>
            </div>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : activityStats.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No search activity yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start searching for medications to see your activity stats
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activityStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{stat.medication_name}</span>
                      <span className="text-sm text-muted-foreground">{stat.count} searches</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                        style={{ width: `${(stat.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Recent Activity</h2>
              </div>
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
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
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
        </div>
      </div>
    </div>
  );
};
