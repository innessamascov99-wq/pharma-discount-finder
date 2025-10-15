import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  Heart,
  FileText,
  TrendingDown,
  ExternalLink,
  Pill,
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button, Card, Input, Badge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SavedProgram {
  id: string;
  medication_name: string;
  manufacturer: string;
  discount_amount: string;
  saved_at: string;
}

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedPrograms, setSavedPrograms] = useState<SavedProgram[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const quickActions = [
    { icon: Search, label: 'Search Programs', action: () => navigate('/') },
    { icon: Heart, label: 'Saved Programs', count: savedPrograms.length },
    { icon: FileText, label: 'Documents', count: 0 },
    { icon: Clock, label: 'Recent Searches', count: 0 }
  ];

  const recentActivity = [
    { medication: 'Mounjaro', action: 'Viewed savings program', time: '2 hours ago' },
    { medication: 'Ozempic', action: 'Saved to favorites', time: '1 day ago' },
    { medication: 'Januvia', action: 'Downloaded information', time: '3 days ago' }
  ];

  const savingsEstimate = {
    monthly: 450,
    yearly: 5400,
    programs: 3
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={action.action}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <action.icon className="w-6 h-6 text-primary" />
                </div>
                {action.count !== undefined && (
                  <Badge variant="secondary">{action.count}</Badge>
                )}
              </div>
              <h3 className="font-semibold">{action.label}</h3>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Monthly Savings</h3>
            </div>
            <p className="text-3xl font-bold text-primary mb-2">
              ${savingsEstimate.monthly}
            </p>
            <p className="text-sm text-muted-foreground">
              Estimated from {savingsEstimate.programs} programs
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-semibold">Yearly Savings</h3>
            </div>
            <p className="text-3xl font-bold text-secondary mb-2">
              ${savingsEstimate.yearly}
            </p>
            <p className="text-sm text-muted-foreground">
              Potential annual savings
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/50 to-accent/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Pill className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Active Programs</h3>
            </div>
            <p className="text-3xl font-bold mb-2">
              {savingsEstimate.programs}
            </p>
            <p className="text-sm text-muted-foreground">
              Programs you're enrolled in
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Pill className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1">{activity.medication}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{activity.action}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Saved Programs</h2>
              <Button variant="ghost" size="sm">Manage</Button>
            </div>
            {savedPrograms.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No saved programs yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start searching for medications to save programs
                </p>
                <Button onClick={() => navigate('/')}>
                  Search Programs
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedPrograms.map((program) => (
                  <div key={program.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <h4 className="font-semibold">{program.medication_name}</h4>
                      <p className="text-sm text-muted-foreground">{program.manufacturer}</p>
                      <p className="text-sm text-primary font-medium mt-1">
                        {program.discount_amount}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6 mt-6 border-primary/20 bg-primary/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Upcoming Renewals</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You have 2 program enrollments expiring soon. Review and renew to continue saving.
              </p>
              <Button variant="default" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                View Renewals
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
