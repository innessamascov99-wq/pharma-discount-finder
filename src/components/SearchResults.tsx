import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Phone,
  Pill,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronUp,
  Building2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Tag,
  Syringe
} from 'lucide-react';
import { Drug, Program, getProgramsForDrug } from '../services/searchService';
import { Badge } from './ui';

interface SearchResultsProps {
  results: Drug[];
  isLoading: boolean;
  searchQuery: string;
}

const DrugCard: React.FC<{ drug: Drug }> = ({ drug }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  useEffect(() => {
    if (isExpanded && programs.length === 0) {
      loadPrograms();
    }
  }, [isExpanded]);

  const loadPrograms = async () => {
    setLoadingPrograms(true);
    try {
      const data = await getProgramsForDrug(drug.id);
      setPrograms(data);
    } catch (error) {
      console.error('Failed to load programs:', error);
    } finally {
      setLoadingPrograms(false);
    }
  };

  return (
    <div className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <Pill className="w-7 h-7 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {drug.medication_name}
            </h3>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {drug.generic_name}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {drug.drug_class}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{drug.manufacturer}</span>
            </div>

            {drug.typical_retail_price && (
              <div className="flex items-center gap-2 text-base font-semibold text-orange-600 dark:text-orange-400">
                <DollarSign className="w-5 h-5" />
                <span>Typical Price: {drug.typical_retail_price}</span>
              </div>
            )}
          </div>
        </div>

        {drug.indication && (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">
                  Used For
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  {drug.indication}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {drug.dosage_forms && (
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Syringe className="w-4 h-4 text-primary" />
                <h5 className="font-semibold text-xs text-foreground">Forms Available</h5>
              </div>
              <p className="text-sm text-muted-foreground">{drug.dosage_forms}</p>
            </div>
          )}

          {drug.common_dosages && (
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4 text-primary" />
                <h5 className="font-semibold text-xs text-foreground">Common Dosages</h5>
              </div>
              <p className="text-sm text-muted-foreground">{drug.common_dosages}</p>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-4 mt-6 pt-6 border-t animate-fade-in">
            {drug.description && (
              <div>
                <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Description
                </h5>
                <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                  {drug.description}
                </p>
              </div>
            )}

            {drug.side_effects && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h5 className="font-semibold text-sm mb-2 flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
                  <AlertCircle className="w-4 h-4" />
                  Common Side Effects
                </h5>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
                  {drug.side_effects}
                </p>
              </div>
            )}

            {drug.warnings && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h5 className="font-semibold text-sm mb-2 flex items-center gap-2 text-red-900 dark:text-red-100">
                  <AlertCircle className="w-4 h-4" />
                  Important Warnings
                </h5>
                <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                  {drug.warnings}
                </p>
              </div>
            )}

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h5 className="font-bold text-base text-green-900 dark:text-green-100">
                  Available Assistance Programs
                </h5>
              </div>

              {loadingPrograms ? (
                <div className="space-y-2">
                  <div className="h-4 bg-green-200 dark:bg-green-800 rounded animate-pulse" />
                  <div className="h-4 bg-green-200 dark:bg-green-800 rounded w-3/4 animate-pulse" />
                </div>
              ) : programs.length === 0 ? (
                <p className="text-sm text-green-800 dark:text-green-200">
                  No assistance programs currently available for this medication.
                </p>
              ) : (
                <div className="space-y-3">
                  {programs.map((program) => (
                    <div
                      key={program.id}
                      className="bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h6 className="font-bold text-sm text-foreground mb-1">
                            {program.program_name}
                          </h6>
                          <Badge variant="secondary" className="text-xs mb-2">
                            {program.program_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        {program.discount_details && (
                          <div className="text-right">
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                              {program.discount_details}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {program.description}
                      </p>

                      {program.eligibility_criteria && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-foreground mb-1">Eligibility:</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {program.eligibility_criteria}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-3 border-t">
                        {program.program_url && (
                          <a
                            href={program.program_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Apply Now
                          </a>
                        )}

                        {program.phone_number && (
                          <a
                            href={`tel:${program.phone_number}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-green-600 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            {program.phone_number}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View Details & Programs
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  searchQuery
}) => {
  if (isLoading) {
    return (
      <div className="mt-12 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border rounded-xl p-6 animate-pulse"
          >
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-muted rounded-xl" />
              <div className="flex-1">
                <div className="h-6 bg-muted rounded w-1/3 mb-3" />
                <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <Pill className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold mb-3">No medications found</h3>
        <p className="text-muted-foreground max-w-md mx-auto text-lg">
          We couldn't find any medications matching "{searchQuery}". Try searching with a different name or check the spelling.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold">
            {results.length} {results.length === 1 ? 'Medication' : 'Medications'} Found
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Showing results for "<span className="font-semibold text-foreground">{searchQuery}</span>"
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {results.map((drug) => (
          <DrugCard key={drug.id} drug={drug} />
        ))}
      </div>
    </div>
  );
};
