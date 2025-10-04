import React from 'react';
import { Shield, Clock, FileText, Zap } from 'lucide-react';

export function Highlights() {
  const highlights = [
    {
      icon: <Zap className="h-6 w-6 text-emerald-600" />,
      text: "No account required — browse freely, save money right away"
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      text: "Verified sources only — every program cites the manufacturer site"
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-600" />,
      text: "Freshness you can trust — flagged if an offer is older than 60 days"
    },
    {
      icon: <FileText className="h-6 w-6 text-emerald-600" />,
      text: "Clear, simple summaries — eligibility and caps explained in plain English"
    }
  ];

  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {highlight.icon}
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">{highlight.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}