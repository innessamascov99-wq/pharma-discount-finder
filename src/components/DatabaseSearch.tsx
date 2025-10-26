import React, { useState, useCallback, useEffect } from 'react';
import { Search, Pill, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Input, Button, Badge } from './ui';
import { searchDrugs, Drug } from '../services/searchService';

export const DatabaseSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Drug[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      handleSearch(debouncedQuery);
    } else {
      setSearchResults([]);
      setSearchError(null);
    }
  }, [debouncedQuery]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setSearching(true);
    setSearchError(null);

    try {
      const results = await searchDrugs(query);
      setSearchResults(results);

      if (results.length === 0) {
        setSearchError('No medications found');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Search Database</h2>
        <p className="text-sm text-muted-foreground">Find medications by name, manufacturer, or class</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            <CardTitle className="text-sm">Medication Search</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
            )}
          </div>

          {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
            <p className="text-sm text-muted-foreground">Type at least 2 characters to search</p>
          )}

          {searchError && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-700 dark:text-amber-300">{searchError}</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              <p className="text-sm font-medium text-muted-foreground">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </p>

              {searchResults.map((drug) => (
                <div
                  key={drug.id}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center flex-shrink-0">
                    <Pill className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base mb-2">{drug.medication_name}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                      {drug.manufacturer && (
                        <div>
                          <span className="text-muted-foreground">Manufacturer:</span>{' '}
                          <span className="font-medium">{drug.manufacturer}</span>
                        </div>
                      )}
                      {drug.drug_class && (
                        <div>
                          <span className="text-muted-foreground">Class:</span>{' '}
                          <span className="font-medium">{drug.drug_class}</span>
                        </div>
                      )}
                      {drug.dosage_form && (
                        <div>
                          <span className="text-muted-foreground">Form:</span>{' '}
                          <span className="font-medium">{drug.dosage_form}</span>
                        </div>
                      )}
                      {drug.strength && (
                        <div>
                          <span className="text-muted-foreground">Strength:</span>{' '}
                          <span className="font-medium">{drug.strength}</span>
                        </div>
                      )}
                    </div>
                    {drug.generic_name && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Generic: {drug.generic_name}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
