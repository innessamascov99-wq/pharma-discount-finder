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
    <section className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Find Your Discount
          </h2>
          <p className="text-xl text-foreground/70 font-light">
            Search thousands of verified manufacturer programs
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand (e.g., Mounjaro, Januvia)"
                className="pl-12 h-14 text-lg"
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
              className="h-14 px-8 text-lg"
            >
              Search
            </Button>
          </div>
        </form>

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
                onClick={() => setSearchQuery(drug)}
                className="h-9"
              >
                {drug}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};