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
    <section className="py-20 bg-background border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-5 p-8 rounded-lg hover:bg-accent transition-all group"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:animate-scale-pulse shadow-md shadow-primary/10">
                <badge.icon className="w-10 h-10 text-primary group-hover:animate-bounce-subtle drop-shadow-sm" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold tracking-tight">
                  {badge.title}
                </h3>
                <p className="text-base text-foreground/70 leading-relaxed">
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