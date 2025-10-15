import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge } from './ui';
import { searchPharmaPrograms, PharmaProgram } from '../services/searchService';

interface ProgramCardProps {
  program: PharmaProgram;
  onViewDetails: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onViewDetails }) => {
  const eligibilityPoints = program.eligibility_criteria
    ? program.eligibility_criteria.split('.').filter(s => s.trim()).slice(0, 4)
    : [];
  const isRecent = program.updated_at
    ? (new Date().getTime() - new Date(program.updated_at).getTime()) / (1000 * 60 * 60 * 24) < 60
    : false;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">
              {program.medication_name}
            </CardTitle>
            <CardDescription className="text-base">
              {program.program_name}
            </CardDescription>
            {program.discount_amount && (
              <p className="text-sm text-primary font-semibold mt-2">
                {program.discount_amount}
              </p>
            )}
          </div>

          <Badge variant={isRecent ? "secondary" : "outline"} className="gap-1 py-1.5 px-3">
            {isRecent ? (
              <CheckCircle className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            <span className="text-xs">{isRecent ? 'Updated' : '60+ days'}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-3">
          {eligibilityPoints.length > 0 ? (
            eligibilityPoints.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-base text-foreground/80 leading-relaxed">
                  {item.trim()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-base text-foreground/80 leading-relaxed">
              {program.program_description || 'Contact for eligibility details'}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        {program.program_url && (
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto gap-1"
            onClick={() => window.open(program.program_url, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            Source
          </Button>
        )}

        <Button variant="default" size="sm" onClick={onViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export const ProgramPreview: React.FC = () => {
  const [programs, setPrograms] = useState<PharmaProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const results = await searchPharmaPrograms('');
      setPrograms(results.slice(0, 3));
    } catch (error) {
      console.error('Failed to load programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllPrograms = () => {
    navigate('/programs');
  };

  const scrollToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Program Examples
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-light leading-relaxed">
            See how we break down complex manufacturer programs into clear, actionable information
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {programs.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onViewDetails={scrollToSearch}
                />
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base"
                onClick={handleViewAllPrograms}
              >
                View All Programs
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};