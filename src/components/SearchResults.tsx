import React from 'react';
import { ExternalLink, Phone } from 'lucide-react';
import { Button } from './ui';
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
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 text-center text-muted-foreground">
          Searching programs...
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
        <p className="text-lg font-medium text-foreground mb-2">
          No programs found
        </p>
        <p className="text-sm text-muted-foreground">
          Try searching with a different medication name or manufacturer
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-12">
                No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                Medication
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                Program Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                Savings
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted">
            {results.map((program, index) => (
              <tr
                key={program.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-4 text-sm font-medium text-muted-foreground">
                  {index + 1}
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {program.medication_name}
                    </p>
                    {program.generic_name && (
                      <p className="text-xs text-muted-foreground">
                        {program.generic_name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {program.manufacturer}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1 max-w-md">
                    <p className="text-sm font-medium text-foreground">
                      {program.program_name}
                    </p>
                    {program.program_description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {program.program_description}
                      </p>
                    )}
                    {program.eligibility_criteria && (
                      <p className="text-xs text-muted-foreground/80 line-clamp-1">
                        Eligibility: {program.eligibility_criteria}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {program.discount_amount ? (
                    <span className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      {program.discount_amount}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Contact program
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    {program.program_url && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => window.open(program.program_url, '_blank')}
                        className="gap-1.5 text-xs h-8 whitespace-nowrap"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Visit Program
                      </Button>
                    )}
                    {program.phone_number && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`tel:${program.phone_number}`, '_self')}
                        className="gap-1.5 text-xs h-8 whitespace-nowrap"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
