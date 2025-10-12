import React from 'react';
import { Brain, ExternalLink, RefreshCw, UserCheck, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-powered summaries",
      description: "Complex eligibility requirements, savings amounts, and program caps simplified into clear bullet points"
    },
    {
      icon: ExternalLink,
      title: "Always cites the official source",
      description: "Every program links directly to the manufacturer's official website for verification and updates"
    },
    {
      icon: RefreshCw,
      title: "Freshness checks",
      description: "Programs over 60 days old are clearly flagged, with regular updates to ensure current information"
    },
    {
      icon: UserCheck,
      title: "No login required to browse",
      description: "Access all program information immediately without creating an account or providing personal details"
    },
    {
      icon: Share2,
      title: "Optional save/share features",
      description: "Create an account to save favorite programs and share relevant options with healthcare providers"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Why Choose Us
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-light leading-relaxed">
            The most comprehensive platform for finding prescription drug discounts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105 group">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-primary/20 group-hover:animate-scale-pulse">
                  <feature.icon className="w-8 h-8 text-primary drop-shadow-sm group-hover:animate-bounce-subtle" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};