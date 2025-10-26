import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui';
import {
  getUserStatistics,
  UserStatistic,
  getDashboardStats,
} from '../services/adminService';

export const AdminNewUsers: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStatistic[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayUsers: 0,
    weekUsers: 0,
  });
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    try {
      const [dashStats, userStatsData] = await Promise.all([
        getDashboardStats(),
        getUserStatistics(timeRange),
      ]);
      setStats({
        totalUsers: dashStats.totalUsers,
        todayUsers: dashStats.todayUsers,
        weekUsers: dashStats.weekUsers,
      });
      setUserStats(userStatsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getMaxValue = (data: UserStatistic[]) => {
    return Math.max(...data.map((d) => d.new_users), 1);
  };

  const maxUsers = getMaxValue(userStats);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">New User Registrations</h2>
          <p className="text-muted-foreground">
            Track new user sign-ups and registration trends
          </p>
        </div>
      </div>

      {/* New User Registration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20">
                <UserPlus className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                New Today
              </p>
              <p className="text-3xl font-bold">{stats.todayUsers}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                This Week
              </p>
              <p className="text-3xl font-bold">{stats.weekUsers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registration Trend Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Registration Trend</CardTitle>
              <CardDescription className="text-xs">
                Daily new user sign-ups over time
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange(7)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeRange === 7
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange(30)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeRange === 30
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange(90)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeRange === 90
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                90 Days
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userStats.map((stat, index) => {
              const barHeight = (stat.new_users / maxUsers) * 100;
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-muted-foreground">
                    {new Date(stat.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex-1 relative h-8 bg-muted rounded-md overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(barHeight, 3)}%` }}
                    >
                      {stat.new_users > 0 && (
                        <span className="text-xs font-semibold text-white">
                          {stat.new_users}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
