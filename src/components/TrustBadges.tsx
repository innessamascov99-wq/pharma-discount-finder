import React from 'react';
import { UserCheck, Shield, Clock, FileText } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: UserCheck,
      title: "No Account Required",
      description: "Browse freely without signing up"
    },
    {
      icon: Shield,
      title: "Verified Sources Only",
      description: "Direct from manufacturer websites"
    },
    {
      icon: Clock,
      title: "Freshness You Can Trust",
      description: "Regular updates with age indicators"
    },
    {
      icon: FileText,
      title: "Clear, Simple Summaries",
      description: "Complex terms made easy to understand"
    }
  ];

  return (
    <section className="py-16 bg-background border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <badge.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {badge.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};