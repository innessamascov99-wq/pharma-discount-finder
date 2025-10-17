import React, { useState } from 'react';
import {
  ExternalLink,
  Phone,
  Pill,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronUp,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { PharmaProgram } from '../services/searchService';

interface SearchResultsProps {
  results: PharmaProgram[];
  isLoading: boolean;
  searchQuery: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  searchQuery
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mt-12 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border rounded-xl p-6 animate-pulse"
          >
            <div className="h-6 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-2/3 mb-3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!searchQuery) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="mt-12 text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Pill className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No programs found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find any discount programs for "{searchQuery}". Try searching with a different medication name or check the spelling.
        </p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {results.length} {results.length === 1 ? 'Program' : 'Programs'} Found
          </h2>
          <p className="text-muted-foreground mt-1">
            Showing results for "{searchQuery}"
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {results.map((program) => {
          const isExpanded = expandedId === program.id;

          return (
            <div
              key={program.id}
              className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Pill className="w-6 h-6 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {program.medication_name}
                        </h3>
                        {program.generic_name && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Generic: {program.generic_name}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="w-4 h-4" />
                          <span>{program.manufacturer}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-4">
                      {program.discount_amount && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="text-lg font-semibold text-green-600">
                            {program.discount_amount}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Active Program</span>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-sm mb-2 text-foreground">
                        {program.program_name}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {program.program_description}
                      </p>
                    </div>

                    {isExpanded && (
                      <div className="space-y-4 animate-fade-in">
                        {program.eligibility_criteria && (
                          <div>
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Eligibility Criteria
                            </h5>
                            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                              {program.eligibility_criteria}
                            </p>
                          </div>
                        )}

                        {program.enrollment_process && (
                          <div>
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              How to Enroll
                            </h5>
                            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                              {program.enrollment_process}
                            </p>
                          </div>
                        )}

                        {program.required_documents && (
                          <div>
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Required Documents
                            </h5>
                            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                              {program.required_documents}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t">
                  {program.program_url && (
                    <a
                      href={program.program_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Program Website
                    </a>
                  )}

                  {program.phone_number && (
                    <a
                      href={`tel:${program.phone_number}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {program.phone_number}
                    </a>
                  )}

                  <button
                    onClick={() => toggleExpand(program.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-colors ml-auto"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show More Details
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
