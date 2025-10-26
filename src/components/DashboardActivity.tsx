import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Pill, Search as SearchIcon, MousePointer } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Input, Badge } from './ui';
import { getRecentActivity, RecentActivity } from '../services/adminService';

export const DashboardActivity: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [filter, setFilter] = useState('');
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    setLoading(true);
    try {
      const activityData = await getRecentActivity(100);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivity = useMemo(() => {
    let filtered = recentActivity;

    if (filter) {
      const lowerFilter = filter.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.medication_name?.toLowerCase().includes(lowerFilter) ||
          a.user_email?.toLowerCase().includes(lowerFilter) ||
          a.search_query?.toLowerCase().includes(lowerFilter)
      );
    }

    return filtered.slice(0, limit);
  }, [recentActivity, filter, limit]);

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'search': return SearchIcon;
      case 'clicked_program': return MousePointer;
      default: return Pill;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'search': return 'blue';
      case 'clicked_program': return 'emerald';
      default: return 'violet';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold">Activity Feed</h2>
          <p className="text-sm text-muted-foreground">
            {filteredActivity.length} of {recentActivity.length} activities
          </p>
        </div>
        <div className="flex gap-2">
          {[20, 50, 100].map((count) => (
            <button
              key={count}
              onClick={() => setLimit(count)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                limit === count
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-600" />
              <CardTitle className="text-sm">Recent Actions</CardTitle>
            </div>
            <Input
              type="text"
              placeholder="Filter..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-xs h-8 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredActivity.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              {filter ? 'No matching activities' : 'No recent activity'}
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {filteredActivity.map((activity, index) => {
                const Icon = getActionIcon(activity.action_type);
                const color = getActionColor(activity.action_type);

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-${color}-50 dark:bg-${color}-950/20 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 text-${color}-600 dark:text-${color}-400`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm truncate">
                          {activity.medication_name || 'Unknown'}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {getTimeAgo(activity.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1.5">
                        {activity.user_email || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {activity.action_type === 'viewed' && 'Viewed'}
                          {activity.action_type === 'search' && 'Searched'}
                          {activity.action_type === 'clicked_program' && 'Clicked Program'}
                        </Badge>
                        {activity.search_query && (
                          <span className="text-xs text-muted-foreground truncate">
                            "{activity.search_query}"
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
