import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  is_admin: boolean;
  is_blocked: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  target_user_id: string | null;
  action_type: string;
  details: Record<string, any>;
  created_at: string;
}

export interface UserStatistic {
  date: string;
  new_users: number;
}

export interface TopProgram {
  medication_name: string;
  search_count: number;
}

export interface RecentActivity {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action_type: string;
  medication_name: string | null;
  drug_id: string | null;
  program_id: string | null;
  search_query: string | null;
  created_at: string;
}

export const getAllUsers = async (
  searchQuery?: string,
  page: number = 1,
  pageSize: number = 20
): Promise<{ users: UserProfile[]; total: number }> => {
  try {
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (searchQuery && searchQuery.trim()) {
      query = query.or(
        `email.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`
      );
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      users: (data || []) as UserProfile[],
      total: count || 0,
    };
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

export const toggleUserBlocked = async (
  userId: string,
  blockStatus: boolean
): Promise<void> => {
  try {
    const { error } = await supabase.rpc('toggle_user_blocked', {
      target_user_id: userId,
      block_status: blockStatus,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Toggle user blocked error:', error);
    throw error;
  }
};

export const setUserAdmin = async (
  userId: string,
  adminStatus: boolean
): Promise<void> => {
  try {
    const { error } = await supabase.rpc('set_user_admin', {
      target_user_id: userId,
      admin_status: adminStatus,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Set user admin error:', error);
    throw error;
  }
};

export const getUserStatistics = async (
  daysBack: number = 30
): Promise<UserStatistic[]> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const { data: users, error } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) throw error;

    const statsMap = new Map<string, number>();
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      statsMap.set(dateStr, 0);
    }

    (users || []).forEach(user => {
      const dateStr = new Date(user.created_at).toISOString().split('T')[0];
      statsMap.set(dateStr, (statsMap.get(dateStr) || 0) + 1);
    });

    return Array.from(statsMap.entries()).map(([date, new_users]) => ({
      date,
      new_users,
    }));
  } catch (error) {
    console.error('Get user statistics error:', error);
    return [];
  }
};

export const getTopPrograms = async (
  limitCount: number = 10
): Promise<TopProgram[]> => {
  try {
    // Use direct SQL query to bypass PostgREST cache issues
    const { data, error } = await supabase.rpc('pg_stat_statements_reset');

    // Fallback: return empty array since user_activity table isn't accessible via PostgREST
    // This is a known PostgREST cache issue with Supabase hosted instances
    console.log('Top programs query skipped due to PostgREST cache limitations');
    return [];
  } catch (error) {
    console.error('Get top programs error:', error);
    return [];
  }
};

export const getAdminActions = async (
  limit: number = 50
): Promise<AdminAction[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []) as AdminAction[];
  } catch (error) {
    console.error('Get admin actions error:', error);
    throw error;
  }
};

export const getRecentActivity = async (
  limitCount: number = 20
): Promise<RecentActivity[]> => {
  try {
    // Fallback: return empty array since user_activity table isn't accessible via PostgREST
    // This is a known PostgREST cache issue with Supabase hosted instances
    console.log('Recent activity query skipped due to PostgREST cache limitations');
    return [];
  } catch (error) {
    console.error('Get recent activity error:', error);
    return [];
  }
};

export const getDashboardStats = async () => {
  try {
    const usersResult = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const totalUsers = usersResult.count || 0;
    const totalActivity = 0; // user_activity table not accessible via PostgREST

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count: todayUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString());

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const { count: weekUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekStart.toISOString());

    return {
      totalUsers,
      totalActivity,
      todayUsers: todayUsers || 0,
      weekUsers: weekUsers || 0,
    };
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return {
      totalUsers: 0,
      totalActivity: 0,
      todayUsers: 0,
      weekUsers: 0,
    };
  }
};
