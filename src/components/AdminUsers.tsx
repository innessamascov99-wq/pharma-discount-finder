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
import { AdminUsersManagement } from './AdminUsersManagement';

export const AdminUsers: React.FC = () => {
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
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            View new registrations and manage user accounts
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
                <UserPlus className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
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
              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/20">
                <TrendingUp className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                This Week
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {stats.weekUsers.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registration Trend Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">New User Registrations</CardTitle>
              <CardDescription className="text-xs">
                Daily registration trends over time
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange(7)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === 7
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange(30)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === 30
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange(90)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === 90
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                90 Days
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {userStats.map((stat, index) => {
              const height = maxUsers > 0 ? (stat.new_users / maxUsers) * 100 : 0;
              const isToday =
                new Date(stat.date).toDateString() === new Date().toDateString();

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1">
                    {stat.new_users > 0 && (
                      <span className="text-xs font-semibold text-muted-foreground">
                        {stat.new_users}
                      </span>
                    )}
                    <div
                      className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                        isToday
                          ? 'bg-gradient-to-t from-blue-500 to-cyan-500'
                          : 'bg-gradient-to-t from-blue-400/60 to-cyan-400/60'
                      }`}
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${stat.date}: ${stat.new_users} new users`}
                    />
                  </div>
                  {index % Math.ceil(userStats.length / 8) === 0 && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(stat.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* User Management Table */}
      <AdminUsersManagement />
    </div>
  );
};
