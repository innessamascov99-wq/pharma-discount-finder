import React, { useState } from 'react';
import { Search, Filter, Clock, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';

interface Program {
  id: string;
  brand: string;
  programName: string;
  bullets: string[];
  freshness: string;
  fetchedDate: string;
  source: string;
  eligibility: 'insured' | 'uninsured' | 'both';
  isSaved: boolean;
}

const mockPrograms: Program[] = [
  {
    id: '1',
    brand: 'Mounjaro',
    programName: 'Mounjaro Savings Card',
    bullets: [
      'Pay as little as $25 per fill',
      'For commercially insured patients only',
      'Maximum 12 fills per year',
      'Expires December 31, 2024'
    ],
    freshness: 'Updated 3 days ago',
    fetchedDate: '2024-01-15',
    source: 'lilly.com',
    eligibility: 'insured',
    isSaved: false
  },
  {
    id: '2',
    brand: 'Mounjaro',
    programName: 'Lilly Cares Foundation',
    bullets: [
      'Free medication for qualifying patients',
      'For uninsured patients only',
      'Income requirements apply',
      'Application required'
    ],
    freshness: 'Updated 1 week ago',
    fetchedDate: '2024-01-08',
    source: 'lilly.com',
    eligibility: 'uninsured',
    isSaved: true
  },
  {
    id: '3',
    brand: 'Ozempic',
    programName: 'Ozempic Savings Card',
    bullets: [
      'Pay as little as $25 per month',
      'For commercial insurance patients only',
      'Maximum $150 savings per prescription',
      'Valid for up to 24 months'
    ],
    freshness: 'Updated 1 week ago',
    fetchedDate: '2024-01-08',
    source: 'ozempic.com',
    eligibility: 'insured',
    isSaved: false
  }
];

export function SearchResults() {
  const [searchQuery, setSearchQuery] = useState('Mounjaro');
  const [programs, setPrograms] = useState<Program[]>(mockPrograms);
  const [filters, setFilters] = useState({
    brand: 'all',
    eligibility: 'all',
    freshness: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a new search
    console.log('Searching for:', searchQuery);
  };

  const handleSaveProgram = (programId: string) => {
    setPrograms(programs.map(program => 
      program.id === programId 
        ? { ...program, isSaved: !program.isSaved }
        : program
    ));
  };

  const filteredPrograms = programs.filter(program => {
    if (filters.brand !== 'all' && program.brand.toLowerCase() !== filters.brand) {
      return false;
    }
    if (filters.eligibility !== 'all' && program.eligibility !== filters.eligibility && program.eligibility !== 'both') {
      return false;
    }
    return true;
  });

  const uniqueBrands = Array.from(new Set(programs.map(p => p.brand)));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand (e.g., Mounjaro, Januvia)"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="border border-slate-300 text-slate-700 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 sticky top-32">
              <h3 className="font-bold text-slate-800 mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters({...filters, brand: e.target.value})}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Brands</option>
                    {uniqueBrands.map(brand => (
                      <option key={brand} value={brand.toLowerCase()}>{brand}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Eligibility</label>
                  <select
                    value={filters.eligibility}
                    onChange={(e) => setFilters({...filters, eligibility: e.target.value})}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Patients</option>
                    <option value="insured">With Insurance</option>
                    <option value="uninsured">Without Insurance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Freshness</label>
                  <select
                    value={filters.freshness}
                    onChange={(e) => setFilters({...filters, freshness: e.target.value})}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Programs</option>
                    <option value="recent">Updated This Week</option>
                    <option value="month">Updated This Month</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={() => setFilters({ brand: 'all', eligibility: 'all', freshness: 'all' })}
                className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Discount Programs for "{searchQuery}"
              </h1>
              <p className="text-slate-600">
                Found {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredPrograms.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-slate-200">
                <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No programs found</h3>
                <p className="text-slate-600 mb-4">
                  No programs found for your search. Please try another brand name.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search and browse all programs
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPrograms.map((program) => (
                  <div key={program.id} className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{program.brand}</h3>
                        <p className="text-emerald-600 font-semibold">{program.programName}</p>
                      </div>
                      <button
                        onClick={() => handleSaveProgram(program.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          program.isSaved 
                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title={program.isSaved ? 'Remove from saved' : 'Save program'}
                      >
                        {program.isSaved ? (
                          <BookmarkCheck className="h-5 w-5" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {program.bullets.map((bullet, index) => (
                        <li key={index} className="text-slate-700 flex items-start">
                          <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <div className="flex items-center text-emerald-600 mr-4">
                          <Clock className="h-4 w-4 mr-1" />
                          {program.freshness}
                        </div>
                        <span className="text-slate-500">Fetched: {program.fetchedDate}</span>
                      </div>
                      <a 
                        href="#" 
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Source: {program.source}
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}