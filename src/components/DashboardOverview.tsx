import React, { useState, useEffect, useMemo } from 'react';
import { Users, TrendingUp, Activity, Calendar, LineChart, BarChart3, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui';
import {
  getUserStatistics,
  getTopPrograms,
  getDashboardStats,
  UserStatistic,
  TopProgram,
} from '../services/adminService';

export const DashboardOverview: React.FC = () => {
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

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashStats, userStatsData, topProgsData] = await Promise.all([
        getDashboardStats(),
        getUserStatistics(timeRange),
        getTopPrograms(5),
      ]);

      setStats(dashStats);
      setUserStats(userStatsData);
      setTopPrograms(topProgsData);
    } catch (error) {
      console.error('Error loading overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    const maxUsers = Math.max(...userStats.map((d) => d.new_users), 1);
    return userStats.slice().reverse().map((stat, index) => ({
      ...stat,
      height: (stat.new_users / maxUsers) * 100,
      index,
    }));
  }, [userStats]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold">Overview</h2>
          <p className="text-sm text-muted-foreground">Platform performance metrics</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days as 7 | 30 | 90)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeRange === days
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'blue' },
          { icon: TrendingUp, label: 'New Today', value: stats.todayUsers, color: 'emerald' },
          { icon: Calendar, label: 'This Week', value: stats.weekUsers, color: 'amber' },
          { icon: Activity, label: 'Total Activity', value: stats.totalActivity, color: 'violet' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg bg-${color}-50 dark:bg-${color}-950/20 flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-blue-600" />
              <CardTitle className="text-sm">User Registrations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No data available
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-48 flex items-end justify-between gap-1">
                  {chartData.map((stat) => (
                    <div key={stat.index} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all hover:opacity-80"
                        style={{ height: `${Math.max(stat.height, 3)}%` }}
                        title={`${stat.new_users} users`}
                      />
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {stat.new_users}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>{formatDate(userStats[userStats.length - 1]?.date || '')}</span>
                  <span>Today</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <CardTitle className="text-sm">Top Medications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {topPrograms.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No search data yet
              </div>
            ) : (
              <div className="space-y-3">
                {topPrograms.map((program, index) => {
                  const percentage = (program.search_count / topPrograms[0].search_count) * 100;
                  return (
                    <div key={index} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="font-medium truncate">{program.medication_name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {program.search_count}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <CardTitle className="text-sm">Key Metrics</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xl font-bold text-primary">
                {stats.totalUsers > 0 ? ((stats.weekUsers / stats.totalUsers) * 100).toFixed(1) : '0'}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Weekly Growth</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xl font-bold text-primary">
                {stats.totalUsers > 0 ? (stats.totalActivity / stats.totalUsers).toFixed(1) : '0'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Avg Actions/User</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xl font-bold text-primary">
                {topPrograms[0]?.search_count || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Top Searches</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
