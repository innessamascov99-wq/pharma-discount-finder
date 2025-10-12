import React from 'react';
import { ExternalLink, Clock, CheckCircle } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge } from './ui';

interface ProgramCardProps {
  brandName: string;
  programName: string;
  eligibility: string[];
  isRecent: boolean;
  sourceUrl: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  brandName,
  programName,
  eligibility,
  isRecent,
  sourceUrl
}) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">
              {brandName}
            </CardTitle>
            <CardDescription className="text-sm">
              {programName}
            </CardDescription>
          </div>

          <Badge variant={isRecent ? "secondary" : "outline"} className="gap-1">
            {isRecent ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <Clock className="w-3 h-3" />
            )}
            {isRecent ? 'Updated' : '60+ days'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-2">
          {eligibility.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground">
                {item}
              </p>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto gap-1"
          onClick={() => window.open(sourceUrl, '_blank')}
        >
          <ExternalLink className="w-4 h-4" />
          Source
        </Button>

        <Button variant="default" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export const ProgramPreview: React.FC = () => {
  const programs = [
    {
      brandName: "Mounjaro",
      programName: "Mounjaro Savings Card",
      eligibility: [
        "Commercial insurance required",
        "Save up to $150 per prescription",
        "12-month program limit",
        "BMI requirements may apply"
      ],
      isRecent: true,
      sourceUrl: "#"
    },
    {
      brandName: "Januvia",
      programName: "Merck Helps Program",
      eligibility: [
        "Income limits: $48,000 individual",
        "Must be uninsured or underinsured",
        "U.S. residency required",
        "Valid prescription needed"
      ],
      isRecent: true,
      sourceUrl: "#"
    },
    {
      brandName: "Humira",
      programName: "Humira Complete",
      eligibility: [
        "Commercial insurance coverage",
        "$5 per month with qualifying insurance",
        "Annual household income limits",
        "Cannot use with government insurance"
      ],
      isRecent: false,
      sourceUrl: "#"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Sample Program Previews
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how we break down complex manufacturer programs into clear, actionable information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {programs.map((program, index) => (
            <ProgramCard key={index} {...program} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Programs
          </Button>
        </div>
      </div>
    </section>
  );
};