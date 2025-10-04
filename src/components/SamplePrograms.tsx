import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Clock } from 'lucide-react';

export function SamplePrograms() {
  const navigate = useNavigate();

  const programs = [
    {
      brand: "Mounjaro",
      program: "Mounjaro Savings Card",
      bullets: [
        "Pay as little as $25 per fill",
        "For commercially insured patients only",
        "Maximum 12 fills per year",
        "Expires December 31, 2024"
      ],
      freshness: "Updated 3 days ago",
      source: "lilly.com"
    },
    {
      brand: "Januvia",
      program: "JANUVIA Savings Program",
      bullets: [
        "Save up to $200 per prescription",
        "For patients without insurance or with commercial insurance",
        "Income restrictions may apply",
        "Valid through 2024"
      ],
      freshness: "Updated 1 week ago",
      source: "merck.com"
    },
    {
      brand: "Ozempic",
      program: "Ozempic Savings Card",
      bullets: [
        "Pay as little as $25 per month",
        "For commercial insurance patients only",
        "Maximum $150 savings per prescription",
        "Valid for up to 24 months"
      ],
      freshness: "Updated 5 days ago",
      source: "ozempic.com"
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Sample Program Summaries</h2>
          <p className="text-lg text-slate-600">See how we simplify manufacturer savings programs</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {programs.map((program, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{program.brand}</h3>
                <p className="text-emerald-600 font-semibold">{program.program}</p>
              </div>
              
              <ul className="space-y-2 mb-6">
                {program.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="text-slate-700 flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {bullet}
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-emerald-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {program.freshness}
                  </div>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-700">
                    Source: {program.source}
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => navigate('/search')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            View All Programs
          </button>
        </div>
      </div>
    </section>
  );
}