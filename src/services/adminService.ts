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
    const { data, error } = await supabase.rpc('get_user_statistics', {
      days_back: daysBack,
    });

    if (error) throw error;

    return (data || []) as UserStatistic[];
  } catch (error) {
    console.error('Get user statistics error:', error);
    throw error;
  }
};

export const getTopPrograms = async (
  limitCount: number = 10
): Promise<TopProgram[]> => {
  try {
    const { data, error } = await supabase.rpc('get_top_programs', {
      limit_count: limitCount,
    });

    if (error) throw error;

    return (data || []) as TopProgram[];
  } catch (error) {
    console.error('Get top programs error:', error);
    throw error;
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

export const getDashboardStats = async () => {
  try {
    const [usersResult, activityResult] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('user_activity').select('*', { count: 'exact', head: true }),
    ]);

    const totalUsers = usersResult.count || 0;
    const totalActivity = activityResult.count || 0;

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
    throw error;
  }
};
