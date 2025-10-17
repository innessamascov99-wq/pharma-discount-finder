import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button, Input, Card } from './ui';
import { searchPharmaPrograms, PharmaProgram } from '../services/searchService';
import { SearchResults } from './SearchResults';

export const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PharmaProgram[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchMethod, setSearchMethod] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [suggestions] = useState([
    'Mounjaro', 'Januvia', 'Ozempic', 'Humira', 'Eliquis', 'Xarelto', 'Trulicity', 'Jardiance'
  ]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    setSearchError(null);
    setSearchMethod('');

    try {
      console.log(`Searching for: "${query}"`);
      const results = await searchPharmaPrograms(query, 20);
      setSearchResults(results);
      setShowResults(true);

      if (results.length > 0) {
        setSearchMethod('Vector search with semantic matching');
      } else {
        setSearchMethod('No results found');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError('Search temporarily unavailable. Please try again.');
      setSearchResults([]);
      setSearchMethod('Error occurred');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 1) {
      performSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setSearchMethod('');
    setSearchError(null);
  };

  const handleSuggestionClick = (drug: string) => {
    setSearchQuery(drug);
    performSearch(drug);
  };

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 tracking-tight px-4">
            Find Your Discount
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70 font-light px-4">
            Search thousands of verified manufacturer programs
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-primary animate-scale-pulse" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand (e.g., Mounjaro)"
                className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-12 sm:h-14 text-base sm:text-lg"
                list="drug-suggestions"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              <datalist id="drug-suggestions">
                {suggestions.map((drug, index) => (
                  <option key={index} value={drug} />
                ))}
              </datalist>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>

        {!showResults && (
          <div className="mt-8 text-center">
            <p className="text-base text-foreground/70 mb-3">
              Popular searches:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {suggestions.slice(0, 4).map((drug, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(drug)}
                  className="h-9"
                >
                  {drug}
                </Button>
              ))}
            </div>
          </div>
        )}

        {showResults && (
          <div className="mt-8 sm:mt-12">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {searchResults.length} {searchResults.length === 1 ? 'Program' : 'Programs'} Found
                </h3>
                {searchMethod && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {searchMethod}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={clearSearch}>
                Clear Results
              </Button>
            </div>

            {searchError && (
              <Card className="p-4 mb-6 bg-destructive/10 border-destructive/20">
                <p className="text-sm text-destructive">{searchError}</p>
              </Card>
            )}

            {searchResults.length === 0 && !searchError ? (
              <Card className="p-6 sm:p-8 text-center">
                <p className="text-base sm:text-lg text-muted-foreground mb-3">
                  No programs found for "{searchQuery}".
                </p>
                <p className="text-sm text-muted-foreground">
                  Try searching for:
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {suggestions.slice(0, 6).map((drug, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(drug)}
                    >
                      {drug}
                    </Button>
                  ))}
                </div>
              </Card>
            ) : searchResults.length > 0 ? (
              <SearchResults
                results={searchResults}
                isLoading={isSearching}
                searchMethod={searchMethod}
              />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
};