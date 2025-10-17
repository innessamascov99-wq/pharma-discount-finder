import React, { useState, useCallback } from 'react';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { searchPharmaPrograms, PharmaProgram } from '../services/searchService';

export const Search: React.FC = () => {
  const [results, setResults] = useState<PharmaProgram[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

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
      const programs = await searchPharmaPrograms(query);
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
        </div>
      </div>
    </div>
  );
};
