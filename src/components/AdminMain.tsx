import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  Activity,
  Calendar,
  BarChart3,
  LineChart,
  Award,
  Clock,
  Pill
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui';
import {
  getUserStatistics,
  getTopPrograms,
  getDashboardStats,
  getRecentActivity,
  UserStatistic,
  TopProgram,
  RecentActivity,
} from '../services/adminService';

export const AdminMain: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActivity: 0,
    todayUsers: 0,
    weekUsers: 0,
  });
  const [userStats, setUserStats] = useState<UserStatistic[]>([]);
  const [topPrograms, setTopPrograms] = useState<TopProgram[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashStats, userStatsData, topProgsData, recentActData] = await Promise.all([
        getDashboardStats(),
        getUserStatistics(timeRange),
        getTopPrograms(10),
        getRecentActivity(20),
      ]);

      setStats(dashStats);
      setUserStats(userStatsData);
      setTopPrograms(topProgsData);
      setRecentActivity(recentActData);
    } catch (error) {
      console.error('Error loading admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaxValue = (data: UserStatistic[]) => {
    return Math.max(...data.map((d) => d.new_users), 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  const maxUsers = getMaxValue(userStats);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <p className="text-muted-foreground">Platform analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange(7)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 7
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange(30)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 30
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange(90)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 90
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Users
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                New Today
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {stats.todayUsers.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20">
                <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                New This Week
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {stats.weekUsers.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/20">
                <Activity className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Activity
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {stats.totalActivity.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <LineChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">New User Registrations</CardTitle>
                <CardDescription className="text-xs">
                  Daily signups over the last {timeRange} days
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {userStats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No data available for this period
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-64 flex items-end justify-between gap-1">
                  {userStats
                    .slice()
                    .reverse()
                    .map((stat, index) => {
                      const height = (stat.new_users / maxUsers) * 100;
                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center gap-2 group"
                        >
                          <div className="relative w-full">
                            <div
                              className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                              style={{ height: `${Math.max(height, 4)}%` }}
                              title={`${stat.new_users} users on ${formatDate(stat.date)}`}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {stat.new_users}
                          </span>
                        </div>
                      );
                    })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>{formatDate(userStats[userStats.length - 1]?.date || '')}</span>
                  <span>Today</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">Top Programs</CardTitle>
                <CardDescription className="text-xs">
                  Most searched medications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {topPrograms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No search data available yet
              </div>
            ) : (
              <div className="space-y-3">
                {topPrograms.map((program, index) => {
                  const maxCount = topPrograms[0]?.search_count || 1;
                  const percentage = (program.search_count / maxCount) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium truncate max-w-[200px]">
                            {program.medication_name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">
                          {program.search_count}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">Platform Insights</CardTitle>
              <CardDescription className="text-xs">
                Key performance indicators
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">
                {stats.totalUsers > 0
                  ? ((stats.weekUsers / stats.totalUsers) * 100).toFixed(1)
                  : '0'}
                %
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Weekly Growth Rate
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">
                {stats.totalUsers > 0
                  ? (stats.totalActivity / stats.totalUsers).toFixed(1)
                  : '0'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Avg Actions Per User
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">
                {topPrograms.length > 0 ? topPrograms[0].search_count : 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Top Program Searches
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">Recent User Activity</CardTitle>
              <CardDescription className="text-xs">
                Latest searches and views across the platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold">{activity.medication_name || 'Unknown'}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {getTimeAgo(activity.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {activity.user_email || 'Anonymous user'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 rounded bg-background">
                        {activity.action_type === 'viewed' && 'Viewed medication'}
                        {activity.action_type === 'search' && 'Searched'}
                        {activity.action_type === 'clicked_program' && 'Clicked program'}
                      </span>
                      {activity.search_query && (
                        <span className="text-xs">Query: {activity.search_query}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
