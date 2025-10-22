import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const popularMeds = [
    'Ozempic',
    'Mounjaro',
    'Trulicity',
    'Jardiance',
    'Humira',
    'Enbrel',
    'Stelara',
    'Lantus'
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        onSearch(query.trim());
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleQuickSearch = (med: string) => {
    setQuery(med);
    onSearch(med);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div
          className={`relative transition-all duration-300 ${
            isFocused ? 'scale-105' : 'scale-100'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50" />

          <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-5">
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin flex-shrink-0" />
              ) : (
                <Search className="w-6 h-6 text-primary flex-shrink-0" />
              )}

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search by medication name..."
                className="flex-1 bg-transparent text-lg font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoComplete="off"
              />

              {query && !isLoading && (
                <button
                  onClick={() => {
                    setQuery('');
                    onSearch('');
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {query.length > 0 && query.length < 2 && (
              <div className="px-6 pb-4 text-sm text-muted-foreground">
                Type at least 2 characters to search
              </div>
            )}
          </div>
        </div>
      </div>

      {!query && (
        <div className="mt-8 text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>Popular searches</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {popularMeds.map((med) => (
              <button
                key={med}
                onClick={() => handleQuickSearch(med)}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
              >
                {med}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
