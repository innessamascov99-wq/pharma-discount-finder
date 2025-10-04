import React from 'react';
import { Search, FileText, CheckCircle } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-12 w-12 text-blue-600" />,
      title: "Search your brand",
      description: "Enter the brand name of your prescription medication to find available discount programs."
    },
    {
      icon: <FileText className="h-12 w-12 text-blue-600" />,
      title: "We summarize the official program terms",
      description: "Our AI processes manufacturer websites to create clear, easy-to-understand summaries of eligibility and savings."
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-blue-600" />,
      title: "Compare and choose the best option",
      description: "Review all available programs side-by-side and select the one that offers the most savings for your situation."
    }
  ];

  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600">Three simple steps to find your prescription savings</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                {index + 1}. {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}