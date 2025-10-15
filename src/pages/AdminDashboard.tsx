import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Pill,
  TrendingUp,
  Activity,
  Search,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Mail,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button, Card, Input, Badge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ProgramStats {
  total_programs: number;
  active_programs: number;
  total_users: number;
  total_searches: number;
  contact_submissions: number;
}

interface RecentProgram {
  id: string;
  medication_name: string;
  manufacturer: string;
  active: boolean;
  created_at: string;
}

interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  message: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ProgramStats>({
    total_programs: 0,
    active_programs: 0,
    total_users: 0,
    total_searches: 0,
    contact_submissions: 0
  });
  const [recentPrograms, setRecentPrograms] = useState<RecentProgram[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'programs' | 'contacts'>('programs');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);

    const [programsResult, usersResult, activityResult, contactsResult, recentProgsResult, recentContactsResult] = await Promise.all([
      supabase.from('pharma_programs').select('id, active', { count: 'exact' }),
      supabase.from('customer').select('*', { count: 'exact', head: true }),
      supabase.from('user_activity').select('*', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
      supabase
        .from('pharma_programs')
        .select('id, medication_name, manufacturer, active, created_at')
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('contact_submissions')
        .select('id, full_name, email, message, created_at')
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    if (!programsResult.error && programsResult.data) {
      const activeCount = programsResult.data.filter(p => p.active).length;
      setStats(prev => ({
        ...prev,
        total_programs: programsResult.count || 0,
        active_programs: activeCount
      }));
    }

    if (usersResult.count !== null) {
      setStats(prev => ({ ...prev, total_users: usersResult.count || 0 }));
    }

    if (activityResult.count !== null) {
      setStats(prev => ({ ...prev, total_searches: activityResult.count || 0 }));
    }

    if (contactsResult.count !== null) {
      setStats(prev => ({ ...prev, contact_submissions: contactsResult.count || 0 }));
    }

    if (!recentProgsResult.error && recentProgsResult.data) {
      setRecentPrograms(recentProgsResult.data);
    }

    if (!recentContactsResult.error && recentContactsResult.data) {
      setRecentContacts(recentContactsResult.data);
    }

    setLoading(false);
  };

  const handleDeleteProgram = async (programId: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    const { error } = await supabase
      .from('pharma_programs')
      .delete()
      .eq('id', programId);

    if (!error) {
      setRecentPrograms(prev => prev.filter(p => p.id !== programId));
      setStats(prev => ({ ...prev, total_programs: prev.total_programs - 1 }));
    }
  };

  const statCards = [
    {
      icon: Pill,
      label: 'Total Programs',
      value: stats.total_programs,
      change: '+12%',
      positive: true,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      label: 'Total Users',
      value: stats.total_users,
      change: '+23%',
      positive: true,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Activity,
      label: 'Total Searches',
      value: stats.total_searches,
      change: '+34%',
      positive: true,
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      icon: MessageSquare,
      label: 'Contact Messages',
      value: stats.contact_submissions,
      change: '+8%',
      positive: true,
      gradient: 'from-violet-500 to-purple-500'
    }
  ];

  const filteredPrograms = recentPrograms.filter(program =>
    program.medication_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = recentContacts.filter(contact =>
    contact.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateCoverage = () => {
    const totalPossible = 1000;
    return Math.round((stats.total_programs / totalPossible) * 100);
  };

  const calculateEngagement = () => {
    if (stats.total_users === 0) return 0;
    return Math.min(Math.round((stats.total_searches / stats.total_users) * 10), 100);
  };

  const calculateSuccessRate = () => {
    if (stats.total_programs === 0) return 0;
    return Math.round((stats.active_programs / stats.total_programs) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Monitor platform performance and manage resources</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  <div className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        stat.positive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold tracking-tight">{stat.value.toLocaleString()}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Program Coverage</h3>
                  <span className="text-2xl font-bold">{calculateCoverage()}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${calculateCoverage()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {stats.total_programs} of 1,000 programs added
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">User Engagement</h3>
                  <span className="text-2xl font-bold">{calculateEngagement()}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${calculateEngagement()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Average searches per user
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Active Programs</h3>
                  <span className="text-2xl font-bold">{calculateSuccessRate()}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${calculateSuccessRate()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {stats.active_programs} of {stats.total_programs} programs active
                </p>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={activeView === 'programs' ? 'default' : 'ghost'}
                      onClick={() => setActiveView('programs')}
                      className="gap-2"
                    >
                      <Pill className="w-4 h-4" />
                      Programs
                    </Button>
                    <Button
                      variant={activeView === 'contacts' ? 'default' : 'ghost'}
                      onClick={() => setActiveView('contacts')}
                      className="gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Contact Messages
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {activeView === 'programs' ? (
                <div className="p-6">
                  {filteredPrograms.length === 0 ? (
                    <div className="text-center py-12">
                      <Pill className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="font-semibold text-lg mb-2">
                        {searchQuery ? 'No programs found' : 'No programs yet'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? 'Try adjusting your search query' : 'Programs will appear here once added'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800">
                            <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">Medication</th>
                            <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">Manufacturer</th>
                            <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                            <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                            <th className="text-right py-4 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPrograms.map((program) => (
                            <tr key={program.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                                    <Pill className="w-5 h-5 text-white" />
                                  </div>
                                  <span className="font-medium">{program.medication_name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-muted-foreground">
                                {program.manufacturer}
                              </td>
                              <td className="py-4 px-4">
                                <Badge variant={program.active ? 'default' : 'secondary'} className="gap-1">
                                  {program.active ? (
                                    <><CheckCircle2 className="w-3 h-3" /> Active</>
                                  ) : (
                                    <><AlertTriangle className="w-3 h-3" /> Inactive</>
                                  )}
                                </Badge>
                              </td>
                              <td className="py-4 px-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(program.created_at)}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteProgram(program.id)}
                                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6">
                  {filteredContacts.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="font-semibold text-lg mb-2">
                        {searchQuery ? 'No messages found' : 'No contact messages yet'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? 'Try adjusting your search query' : 'Contact messages will appear here'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredContacts.map((contact) => (
                        <Card key={contact.id} className="p-5 hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                  {contact.full_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold">{contact.full_name}</h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                  <Mail className="w-3 h-3" />
                                  {contact.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {formatDate(contact.created_at)}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                            {contact.message}
                          </p>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
