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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Finding prescription discounts shouldn't be complicated. We've simplified the process into three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Step Number Circle */}
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {step.number}
                  </span>
                </div>
                
                {/* Icon */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-primary-100">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-primary-200 transform translate-x-1/2 -translate-y-1/2" 
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