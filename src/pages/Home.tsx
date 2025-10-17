import React, { useState, useCallback } from 'react';
import { HeroSection } from '../components/HeroSection';
import { TrustBadges } from '../components/TrustBadges';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { HowItWorks } from '../components/HowItWorks';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { ProgramPreview } from '../components/ProgramPreview';
import { TrustTransparency } from '../components/TrustTransparency';
import { DatabaseStatus } from '../components/DatabaseStatus';
import { searchDrugs, Drug } from '../services/searchService';

export const Home: React.FC = () => {
  const [results, setResults] = useState<Drug[]>([]);
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
      const drugs = await searchDrugs(query);
      setResults(drugs);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search programs');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <HeroSection />

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Find Your Medication Discount
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Search thousands of pharmaceutical assistance programs
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
      </section>

      <ProgramPreview />
      <TrustBadges />
      <HowItWorks />
      <FeaturesGrid />
      <TrustTransparency />
      <DatabaseStatus />
    </>
  );
};
