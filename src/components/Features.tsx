import React from 'react';
import { Brain, Shield, Clock, Eye, Save, Share } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI-powered summaries",
      description: "Complex eligibility requirements and savings caps explained in plain English"
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: "Always cites the official source",
      description: "Every program links directly to the manufacturer's official website for verification"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Freshness checks",
      description: "Programs older than 60 days are automatically flagged as potentially outdated"
    },
    {
      icon: <Eye className="h-8 w-8 text-emerald-600" />,
      title: "No login required to browse",
      description: "Start saving immediately without creating an account or providing personal information"
    },
    {
      icon: <Save className="h-8 w-8 text-blue-600" />,
      title: "Optional save features",
      description: "Create an account to save programs and receive updates on new opportunities"
    },
    {
      icon: <Share className="h-8 w-8 text-emerald-600" />,
      title: "Easy sharing",
      description: "Share program summaries with family members, caregivers, or healthcare providers"
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose Pharma Discount Finder</h2>
          <p className="text-lg text-slate-600">Trusted features designed with patients in mind</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}