import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Pill,
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
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Database,
  BarChart3,
  FileText,
  Shield
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Badge
} from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase, searchSupabase } from '../lib/supabase';

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
      searchSupabase.from('drugs').select('id, active', { count: 'exact' }),
      supabase.from('customer').select('*', { count: 'exact', head: true }),
      supabase.from('user_activity').select('*', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
      searchSupabase
        .from('drugs')
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

    const { error } = await searchSupabase
      .from('drugs')
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
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      description: 'Active discount programs'
    },
    {
      icon: Users,
      label: 'Total Users',
      value: stats.total_users,
      change: '+23%',
      positive: true,
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      description: 'Registered users'
    },
    {
      icon: Activity,
      label: 'Total Searches',
      value: stats.total_searches,
      change: '+34%',
      positive: true,
      gradient: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      description: 'Platform searches'
    },
    {
      icon: MessageSquare,
      label: 'Contact Messages',
      value: stats.contact_submissions,
      change: '+8%',
      positive: true,
      gradient: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-50 dark:bg-violet-950/20',
      description: 'User inquiries'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage platform operations</p>
            </div>
          </div>
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
                <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className="w-6 h-6 text-foreground" />
                      </div>
                      <Badge className={`${
                        stat.positive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      } border-0 gap-1`}>
                        {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stat.change}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold tracking-tight mb-1">{stat.value.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Program Coverage</CardTitle>
                      <CardDescription className="text-xs">Database completeness</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-bold">{calculateCoverage()}%</span>
                    <span className="text-sm text-muted-foreground">of target</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-out rounded-full"
                      style={{ width: `${calculateCoverage()}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats.total_programs} of 1,000 programs
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">User Engagement</CardTitle>
                      <CardDescription className="text-xs">Platform activity</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-bold">{calculateEngagement()}%</span>
                    <span className="text-sm text-muted-foreground">active rate</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 ease-out rounded-full"
                      style={{ width: `${calculateEngagement()}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Avg searches per user
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Active Programs</CardTitle>
                      <CardDescription className="text-xs">Program status</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-bold">{calculateSuccessRate()}%</span>
                    <span className="text-sm text-muted-foreground">active</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-out rounded-full"
                      style={{ width: `${calculateSuccessRate()}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats.active_programs} of {stats.total_programs}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="border-b bg-muted/30">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Button
                        variant={activeView === 'programs' ? 'default' : 'ghost'}
                        onClick={() => setActiveView('programs')}
                        className="gap-2"
                        size="sm"
                      >
                        <Pill className="w-4 h-4" />
                        Programs
                      </Button>
                      <Button
                        variant={activeView === 'contacts' ? 'default' : 'ghost'}
                        onClick={() => setActiveView('contacts')}
                        className="gap-2"
                        size="sm"
                      >
                        <Mail className="w-4 h-4" />
                        Messages
                      </Button>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9"
                      />
                    </div>
                  </div>
                </CardHeader>
              </div>

              {activeView === 'programs' ? (
                <CardContent className="p-6">
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
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Medication</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Manufacturer</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPrograms.map((program) => (
                            <tr key={program.id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                                    <Pill className="w-5 h-5 text-white" />
                                  </div>
                                  <span className="font-medium">{program.medication_name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground text-sm">
                                {program.manufacturer}
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant={program.active ? 'default' : 'secondary'} className="gap-1">
                                  {program.active ? (
                                    <><CheckCircle2 className="w-3 h-3" /> Active</>
                                  ) : (
                                    <><AlertTriangle className="w-3 h-3" /> Inactive</>
                                  )}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(program.created_at)}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteProgram(program.id)}
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
                </CardContent>
              ) : (
                <CardContent className="p-6">
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
                        <Card key={contact.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
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
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                              {contact.message}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
