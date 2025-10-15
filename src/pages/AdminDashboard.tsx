import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Pill,
  TrendingUp,
  Activity,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Database,
  Settings,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Button, Card, Input, Badge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ProgramStats {
  total_programs: number;
  active_programs: number;
  total_users: number;
  total_searches: number;
}

interface RecentProgram {
  id: string;
  medication_name: string;
  manufacturer: string;
  active: boolean;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ProgramStats>({
    total_programs: 0,
    active_programs: 0,
    total_users: 0,
    total_searches: 0
  });
  const [recentPrograms, setRecentPrograms] = useState<RecentProgram[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);

    const [programsResult, usersResult, activityResult, recentProgsResult] = await Promise.all([
      supabase.from('pharma_programs').select('id, active', { count: 'exact' }),
      supabase.from('customer').select('*', { count: 'exact', head: true }),
      supabase.from('user_activity').select('*', { count: 'exact', head: true }),
      supabase
        .from('pharma_programs')
        .select('id, medication_name, manufacturer, active, created_at')
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

    if (!recentProgsResult.error && recentProgsResult.data) {
      setRecentPrograms(recentProgsResult.data);
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
      color: 'primary'
    },
    {
      icon: Users,
      label: 'Total Users',
      value: stats.total_users,
      change: '+23%',
      positive: true,
      color: 'secondary'
    },
    {
      icon: Activity,
      label: 'Active Programs',
      value: stats.active_programs,
      change: '+8%',
      positive: true,
      color: 'primary'
    },
    {
      icon: TrendingUp,
      label: 'Total Searches',
      value: stats.total_searches,
      change: '+34%',
      positive: true,
      color: 'secondary'
    }
  ];

  const filteredPrograms = recentPrograms.filter(program =>
    program.medication_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateCoverage = () => {
    const totalPossible = 1000;
    return Math.round((stats.total_programs / totalPossible) * 100);
  };

  const calculateEngagement = () => {
    if (stats.total_users === 0) return 0;
    return Math.round((stats.total_searches / stats.total_users) * 10);
  };

  const calculateSuccessRate = () => {
    if (stats.total_searches === 0) return 0;
    return Math.round((stats.active_programs / stats.total_programs) * 100);
  };

  const quickActions = [
    { icon: Plus, label: 'Add Program', action: () => {} },
    { icon: Database, label: 'Manage Data', action: () => {} },
    { icon: BarChart3, label: 'View Analytics', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} }
  ];

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage programs and monitor platform activity</p>
          </div>
          <Button variant="default">
            <Plus className="w-4 h-4 mr-2" />
            Add Program
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading dashboard data...</div>
        ) : (
          <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.color === 'primary' ? 'text-primary' : 'text-secondary'
                  }`} />
                </div>
                <Badge variant={stat.positive ? 'default' : 'secondary'}>
                  {stat.change}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3"
              onClick={action.action}
            >
              <action.icon className="w-8 h-8 text-primary" />
              <span className="font-semibold">{action.label}</span>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Programs</h2>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {filteredPrograms.length === 0 ? (
              <div className="text-center py-12">
                <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">
                  {searchQuery ? 'No programs found' : 'No programs yet'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Add programs to see them listed here'}
                </p>
              </div>
            ) : (
              <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Medication</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Manufacturer</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrograms.map((program) => (
                    <tr key={program.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Pill className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{program.medication_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {program.manufacturer}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={program.active ? 'default' : 'secondary'}>
                          {program.active ? (
                            <><CheckCircle2 className="w-3 h-3 mr-1" /> Active</>
                          ) : (
                            <><AlertTriangle className="w-3 h-3 mr-1" /> Inactive</>
                          )}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
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
                            title="Delete"
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

            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPrograms.length} of {stats.total_programs} programs
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
            </>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">System Health</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-medium">Database</span>
                  </div>
                  <Badge variant="default">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-medium">API</span>
                  </div>
                  <Badge variant="default">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-medium">Search</span>
                  </div>
                  <Badge variant="default">Healthy</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Program Coverage</span>
                    <span className="text-sm font-semibold">{calculateCoverage()}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${calculateCoverage()}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">User Engagement</span>
                    <span className="text-sm font-semibold">{Math.min(calculateEngagement(), 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-500"
                      style={{ width: `${Math.min(calculateEngagement(), 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Active Programs</span>
                    <span className="text-sm font-semibold">{calculateSuccessRate()}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${calculateSuccessRate()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {stats.active_programs < stats.total_programs && (
          <Card className="p-6 border-primary/20 bg-primary/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Action Required</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {stats.total_programs - stats.active_programs} programs are inactive. Review and update them to ensure accuracy.
                </p>
                <Button variant="default" size="sm">
                  Review Programs
                </Button>
              </div>
            </div>
          </Card>
        )}
          </>
        )}
      </div>
    </div>
  );
};
