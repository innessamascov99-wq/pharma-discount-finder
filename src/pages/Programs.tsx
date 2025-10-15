import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ExternalLink, Phone, FileText, Loader2 } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { getAllPharmaPrograms, PharmaProgram } from '../services/searchService';

export const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<PharmaProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<PharmaProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = programs.filter(program =>
        program.medication_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.program_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPrograms(filtered);
    } else {
      setFilteredPrograms(programs);
    }
  }, [searchQuery, programs]);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const results = await getAllPharmaPrograms();
      setPrograms(results);
      setFilteredPrograms(results);
    } catch (error) {
      console.error('Failed to load programs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            All Discount Programs
          </h1>
          <p className="text-xl text-muted-foreground">
            Browse all available pharmaceutical discount programs
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by medication, manufacturer, or program name..."
              className="pl-12 h-14 text-base"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : filteredPrograms.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground">
              {searchQuery ? `No programs found for "${searchQuery}"` : 'No programs available'}
            </p>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-base text-muted-foreground">
                Showing {filteredPrograms.length} {filteredPrograms.length === 1 ? 'program' : 'programs'}
              </p>
            </div>

            <div className="grid gap-6">
              {filteredPrograms.map((program) => (
                <Card key={program.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-primary mb-1">
                          {program.medication_name}
                        </h3>
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
          </>
        )}

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
