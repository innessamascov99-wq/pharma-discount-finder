import React, { useState, useCallback, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { searchDrugs, Drug, getAllDrugs } from '../services/searchService';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';

export const Search: React.FC = () => {
  const [results, setResults] = useState<Drug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [popularDrugs, setPopularDrugs] = useState<Drug[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  useEffect(() => {
    loadPopularDrugs();
  }, []);

  const loadPopularDrugs = async () => {
    setLoadingPopular(true);
    try {
      const drugs = await getAllDrugs();
      setPopularDrugs(drugs.slice(0, 12));
    } catch (error) {
      console.error('Failed to load popular drugs:', error);
    } finally {
      setLoadingPopular(false);
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);

    if (!query || query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const programs = await searchDrugs(query);
      setResults(programs);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search programs');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-24 pb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Find Your Medication Discount
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Search thousands of pharmaceutical assistance programs to save on your prescriptions
            </p>
          </div>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {error && (
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
                <p className="text-destructive font-medium">{error}</p>
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          <SearchResults
            results={results}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />

          {!searchQuery && !isLoading && results.length === 0 && (
            <div className="mt-16 max-w-6xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Popular Medications</CardTitle>
                      <CardDescription>
                        Browse commonly searched prescription drugs
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingPopular ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p>Loading medications...</p>
                    </div>
                  ) : popularDrugs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No medications available</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {popularDrugs.map((drug, index) => (
                        <div
                          key={drug.id}
                          className="group p-4 rounded-lg border border-border hover:border-primary bg-card hover:shadow-md transition-all cursor-pointer"
                          onClick={() => handleSearch(drug.medication_name)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                                {drug.medication_name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-1">
                                {drug.generic_name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="px-2 py-1 rounded bg-muted">{drug.drug_class}</span>
                                <span>•</span>
                                <span>{drug.manufacturer}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400">
                  <Sparkles className="w-4 h-4" />
                  <p className="text-sm font-medium">
                    Click any medication to search for discount programs
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
