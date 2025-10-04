import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from './ui';

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
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text mb-4">
            Find Your Brand-Name Drug Discount
          </h2>
          <p className="text-lg text-gray-600">
            Search thousands of verified manufacturer programs
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-200 focus-within:ring-opacity-50 transition-all duration-200">
            <div className="pl-6 pr-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brand (e.g., Mounjaro, Januvia)"
              className="flex-1 py-4 px-2 text-lg bg-transparent border-none outline-none placeholder-gray-500"
              list="drug-suggestions"
            />
            
            <datalist id="drug-suggestions">
              {suggestions.map((drug, index) => (
                <option key={index} value={drug} />
              ))}
            </datalist>
            
            <div className="pr-2">
              <Button 
                type="submit"
                variant="primary" 
                size="lg"
                className="px-8 py-3"
              >
                Search
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Popular searches: 
            {suggestions.slice(0, 4).map((drug, index) => (
              <span key={index}>
                <button 
                  onClick={() => setSearchQuery(drug)}
                  className="text-primary hover:text-primary-700 mx-1 underline"
                >
                  {drug}
                </button>
                {index < 3 && ', '}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};