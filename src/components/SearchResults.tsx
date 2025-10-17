import React from 'react';
import { ExternalLink, Phone, FileText, Sparkles } from 'lucide-react';
import { Button, Card } from './ui';
import { PharmaProgram } from '../services/searchService';

interface SearchResultsProps {
  results: PharmaProgram[];
  isLoading?: boolean;
  searchMethod?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 sm:p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      {results.map((program, index) => (
        <Card
          key={program.id}
          className="p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
          style={{
            animationDelay: `${index * 50}ms`,
            animation: 'fadeInUp 0.3s ease-out forwards'
          }}
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-start gap-2 mb-2">
                  <h4 className="text-xl sm:text-2xl font-bold text-primary">
                    {program.medication_name}
                  </h4>
                  {program.similarity && program.similarity > 0.85 && (
                    <span
                      className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      title="High relevance match"
                    >
                      <Sparkles className="w-3 h-3" />
                      Best Match
                    </span>
                  )}
                </div>

                {program.generic_name && (
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    Generic: {program.generic_name}
                  </p>
                )}

                <p className="text-base sm:text-lg font-semibold text-foreground mb-1">
                  {program.program_name}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  by {program.manufacturer}
                </p>
              </div>

              {program.discount_amount && (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary px-3 sm:px-4 py-2 rounded-lg text-center self-start sm:self-auto border border-primary/20">
                  <p className="text-xs sm:text-sm font-medium">Savings</p>
                  <p className="text-base sm:text-lg font-bold whitespace-nowrap">
                    {program.discount_amount}
                  </p>
                </div>
              )}
            </div>

            {program.program_description && (
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                {program.program_description}
              </p>
            )}

            {program.eligibility_criteria && (
              <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border border-muted">
                <p className="font-semibold mb-1 text-xs sm:text-sm">Eligibility:</p>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                  {program.eligibility_criteria}
                </p>
              </div>
            )}

            {program.enrollment_process && (
              <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border border-muted">
                <p className="font-semibold mb-1 text-xs sm:text-sm flex items-center gap-2">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  How to Enroll:
                </p>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                  {program.enrollment_process}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-2">
              {program.program_url && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.open(program.program_url, '_blank')}
                  className="gap-2 w-full sm:w-auto text-sm"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  Visit Program Website
                </Button>
              )}
              {program.phone_number && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${program.phone_number}`, '_self')}
                  className="gap-2 w-full sm:w-auto text-sm"
                >
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  {program.phone_number}
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
