import React, { useState, useEffect, useMemo } from 'react';
import { Pill, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Input, Badge } from './ui';
import { getAllDrugs, Drug } from '../services/searchService';

export const DashboardMedications: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    loadDrugs();
  }, []);

  const loadDrugs = async () => {
    setLoading(true);
    try {
      const allDrugs = await getAllDrugs();
      setDrugs(allDrugs);
    } catch (error) {
      console.error('Error loading drugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrugs = useMemo(() => {
    let filtered = drugs;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (drug) =>
          drug.medication_name?.toLowerCase().includes(query) ||
          drug.manufacturer?.toLowerCase().includes(query) ||
          drug.drug_class?.toLowerCase().includes(query) ||
          drug.generic_name?.toLowerCase().includes(query)
      );
    }

    return filtered.slice(0, displayCount);
  }, [drugs, searchQuery, displayCount]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold">Medications</h2>
          <p className="text-sm text-muted-foreground">
            Showing {filteredDrugs.length} of {drugs.length} medications
          </p>
        </div>
        <div className="flex gap-2">
          {[20, 50, 100].map((count) => (
            <button
              key={count}
              onClick={() => setDisplayCount(count)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                displayCount === count
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-600" />
              <CardTitle className="text-sm">All Medications</CardTitle>
            </div>
            <div className="relative max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDrugs.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              {searchQuery ? 'No matching medications' : 'No medications in database'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredDrugs.map((drug, index) => (
                <div
                  key={drug.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1 truncate">
                      {drug.medication_name}
                    </h4>
                    <div className="space-y-1">
                      {drug.generic_name && (
                        <p className="text-xs text-muted-foreground truncate">
                          Generic: {drug.generic_name}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {drug.manufacturer && (
                          <Badge variant="secondary" className="text-xs">
                            {drug.manufacturer}
                          </Badge>
                        )}
                        {drug.drug_class && (
                          <Badge variant="outline" className="text-xs">
                            {drug.drug_class}
                          </Badge>
                        )}
                      </div>
                    </div>
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
