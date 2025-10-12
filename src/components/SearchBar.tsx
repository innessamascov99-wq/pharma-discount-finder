import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button, Input } from './ui';

export const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions] = useState([
    'Mounjaro', 'Januvia', 'Ozempic', 'Humira', 'Eliquis', 'Xarelto', 'Trulicity', 'Jardiance'
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Handle search logic here
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Find Your Brand-Name Drug Discount
          </h2>
          <p className="text-lg text-muted-foreground">
            Search thousands of verified manufacturer programs
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand (e.g., Mounjaro, Januvia)"
                className="pl-10 h-12 text-base"
                list="drug-suggestions"
              />
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
              className="h-12"
            >
              Search
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Popular searches:
            {suggestions.slice(0, 4).map((drug, index) => (
              <span key={index}>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setSearchQuery(drug)}
                  className="h-auto p-0 mx-1"
                >
                  {drug}
                </Button>
                {index < 3 && ', '}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};