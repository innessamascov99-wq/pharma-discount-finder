import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FileText,
  Loader2,
  BarChart3,
  Heart,
  DollarSign,
  Activity,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { searchDrugs, Drug, getAllDrugs, getUserPrograms, UserProgram } from '../services/searchService';
import { getTopPrograms, TopProgram } from '../services/adminService';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';

interface UserProfile {
  first_name: string;
  last_name: string;
}


export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topSearchedMeds, setTopSearchedMeds] = useState<TopProgram[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Drug[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [popularDrugs, setPopularDrugs] = useState<Drug[]>([]);
  const [userPrograms, setUserPrograms] = useState<UserProgram[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);

    const { data: profile } = await supabase
      .from('users')
      .select('first_name, last_name')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      setUserProfile(profile);
    }

    try {
      const [topProgs, drugsResult, programs] = await Promise.all([
        getTopPrograms(5),
        getAllDrugs(),
        getUserPrograms(user.id, 'active')
      ]);

      setTopSearchedMeds(topProgs);
      setPopularDrugs(drugsResult.slice(0, 10));
      setUserPrograms(programs);
    } catch (error) {
      console.error('Failed to load activity:', error);
    }

    setLoading(false);
  };


  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);

    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const results = await searchDrugs(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  const statCards = [
    {
      title: 'Total Searches',
      value: topSearchedMeds.reduce((sum, med) => sum + Number(med.search_count), 0),
      icon: Search,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Across all users',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      title: 'Saved Programs',
      value: 0,
      icon: Heart,
      gradient: 'from-rose-500 to-pink-500',
      description: 'Assistance programs',
      bgColor: 'bg-rose-50 dark:bg-rose-950/20'
    },
    {
      title: 'Potential Savings',
      value: '$2,450',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-500',
      description: 'Estimated annually',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20'
    },
    {
      title: 'Active Programs',
      value: userPrograms.length,
      icon: Activity,
      gradient: 'from-amber-500 to-orange-500',
      description: 'Currently enrolled',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
              {userProfile && (
                <p className="text-lg text-muted-foreground">
                  {userProfile.first_name} {userProfile.last_name}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className="w-6 h-6 text-foreground" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold tracking-tight mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Search for Medications</h2>
            <p className="text-muted-foreground">
              Find discount programs and savings opportunities
            </p>
          </div>

          <SearchBar onSearch={handleSearch} isLoading={isSearching} />

          <SearchResults
            results={searchResults}
            isLoading={isSearching}
            searchQuery={searchQuery}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Top Searched Medications</CardTitle>
                  <CardDescription>Most searched across all users</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  Loading...
                </div>
              ) : topSearchedMeds.length === 0 ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="font-semibold mb-2">No search activity yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      No searches recorded across the platform yet
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Popular Medications</h4>
                    <div className="space-y-2">
                      {popularDrugs.map((drug, index) => (
                        <div key={drug.id} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer" onClick={() => {
                          setSearchQuery(drug.medication_name);
                          handleSearch({ preventDefault: () => {} } as React.FormEvent);
                        }}>
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium flex-1">{drug.medication_name}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {topSearchedMeds.map((med, index) => {
                    const maxCount = topSearchedMeds[0]?.search_count || 1;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{med.medication_name}</span>
                          <Badge variant="secondary">{med.search_count} searches</Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(med.search_count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Popular Searches</CardTitle>
                  <CardDescription>Commonly searched medications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  Loading...
                </div>
              ) : popularDrugs.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold mb-2">No medications available</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check back later for popular medications
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {popularDrugs.slice(0, 10).map((drug, index) => (
                    <div
                      key={drug.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                      onClick={() => {
                        setSearchQuery(drug.medication_name);
                        handleSearch({ preventDefault: () => {} } as React.FormEvent);
                      }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                          {drug.medication_name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {drug.generic_name} • {drug.manufacturer}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => navigate('/programs')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold mb-1">Browse Programs</h3>
              <p className="text-sm text-muted-foreground">Explore all available discount programs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => navigate('/search')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold mb-1">Advanced Search</h3>
              <p className="text-sm text-muted-foreground">Find specific medications and programs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => navigate('/contact')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold mb-1">Get Support</h3>
              <p className="text-sm text-muted-foreground">Contact us for assistance</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
