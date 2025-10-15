import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Phone, FileText, X } from 'lucide-react';
import { Button, Input, Card } from './ui';
import { searchPharmaPrograms, PharmaProgram } from '../services/searchService';

export const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PharmaProgram[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
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
    try {
      const results = await searchPharmaPrograms(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
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
  };

  const handleSuggestionClick = (drug: string) => {
    setSearchQuery(drug);
    performSearch(drug);
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Find Your Discount
          </h2>
          <p className="text-xl text-foreground/70 font-light">
            Search thousands of verified manufacturer programs
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary animate-scale-pulse" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand (e.g., Mounjaro, Januvia)"
                className="pl-12 pr-12 h-14 text-lg"
                list="drug-suggestions"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
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
              className="h-14 px-8 text-lg"
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
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">
                {searchResults.length} {searchResults.length === 1 ? 'Program' : 'Programs'} Found
              </h3>
              <Button variant="ghost" size="sm" onClick={clearSearch}>
                Clear Results
              </Button>
            </div>

            {searchResults.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-lg text-muted-foreground">
                  No programs found for "{searchQuery}". Try searching for a different medication name.
                </p>
              </Card>
            ) : (
              <div className="grid gap-6">
                {searchResults.map((program) => (
                  <Card key={program.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold text-primary mb-1">
                            {program.medication_name}
                          </h4>
                          {program.generic_name && (
                            <p className="text-sm text-muted-foreground mb-2">
                              Generic: {program.generic_name}
                            </p>
                          )}
                          <p className="text-lg font-semibold text-foreground mb-1">
                            {program.program_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            by {program.manufacturer}
                          </p>
                        </div>
                        {program.discount_amount && (
                          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-center">
                            <p className="text-sm font-medium">Savings</p>
                            <p className="text-lg font-bold whitespace-nowrap">
                              {program.discount_amount}
                            </p>
                          </div>
                        )}
                      </div>

                      {program.program_description && (
                        <p className="text-foreground/80">
                          {program.program_description}
                        </p>
                      )}

                      {program.eligibility_criteria && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="font-semibold mb-1 text-sm">Eligibility:</p>
                          <p className="text-sm text-foreground/80">
                            {program.eligibility_criteria}
                          </p>
                        </div>
                      )}

                      {program.enrollment_process && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="font-semibold mb-1 text-sm flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            How to Enroll:
                          </p>
                          <p className="text-sm text-foreground/80">
                            {program.enrollment_process}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-2">
                        {program.program_url && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => window.open(program.program_url, '_blank')}
                            className="gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Visit Program Website
                          </Button>
                        )}
                        {program.phone_number && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`tel:${program.phone_number}`, '_self')}
                            className="gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            {program.phone_number}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};