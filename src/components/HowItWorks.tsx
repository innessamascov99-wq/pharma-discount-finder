import React from 'react';
import { Search, FileText, GitCompare as Compare } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: "Search your brand",
      description: "Enter the brand name of your prescription medication to find available discount programs"
    },
    {
      number: 2,
      icon: FileText,
      title: "We summarize the official program terms",
      description: "Our system processes complex manufacturer documents and presents clear, easy-to-understand summaries"
    },
    {
      number: 3,
      icon: Compare,
      title: "Compare and choose the best option",
      description: "Review eligibility requirements, savings amounts, and program details to find your best match"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-light leading-relaxed">
            Finding prescription discounts shouldn't be complicated. Three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="relative mb-10">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30 animate-pulse-glow">
                  <span className="text-3xl font-bold text-primary-foreground drop-shadow-sm">
                    {step.number}
                  </span>
                </div>

                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-card rounded-full flex items-center justify-center shadow-lg border-2 border-primary/30 animate-bounce-subtle">
                  <step.icon className="w-7 h-7 text-primary drop-shadow-sm" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-base text-foreground/70 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-primary/20 transform translate-x-1/2 -translate-y-1/2"
                     style={{ left: '60%', width: '80%' }}>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};