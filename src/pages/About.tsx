import React, { useState } from 'react';
import { DollarSign, Shield, FileText, Search, CheckCircle2, Heart } from 'lucide-react';

export const About: React.FC = () => {
  const [hoveredMission, setHoveredMission] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const missionPrinciples = [
    {
      icon: DollarSign,
      title: 'Affordable Access',
      description: 'Every patient should have access to information about prescription savings programs, regardless of their insurance status or financial situation.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'We source all information directly from manufacturer websites, clearly cite our sources, and never alter the actual program terms.',
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      icon: FileText,
      title: 'Simplicity',
      description: 'Complex eligibility requirements and program terms are translated into clear, easy-to-understand summaries that patients can rely on.',
      color: 'from-cyan-400 to-cyan-600'
    }
  ];

  const steps = [
    {
      icon: Search,
      step: '1. Search',
      description: 'Enter your brand-name medication to find available programs',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: FileText,
      step: '2. Summarize',
      description: 'We translate complex terms into clear, understandable summaries',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: CheckCircle2,
      step: '3. Compare',
      description: 'Review all available options side-by-side to find the best fit',
      color: 'text-violet-600',
      bgColor: 'bg-violet-50'
    },
    {
      icon: Heart,
      step: '4. Save',
      description: 'Bookmark programs and get updates on new opportunities',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <section className="bg-gradient-to-br from-slate-100 via-blue-50 to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-6 leading-tight">
              Why We Built Pharma Discount Finder
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Prescription costs shouldn't be a barrier to health. We created this platform to make
              manufacturer discount programs accessible, transparent, and easy to understand for every
              patient.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 lg:p-12 border border-slate-200 dark:border-slate-700 transform hover:shadow-xl transition-shadow duration-300">
            <blockquote className="relative">
              <div className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed italic mb-6">
                "Too many patients struggle to afford their medications, not knowing that help is available.
                Manufacturer discount programs exist, but they're often buried in complex websites with
                confusing terms. We believe every patient deserves clear, reliable information about their savings
                options."
              </div>
              <footer className="text-emerald-600 dark:text-emerald-400 font-semibold text-base">
                — The Pharma Discount Finder Team
              </footer>
              <div className="absolute -top-4 -left-2 text-8xl text-slate-200 dark:text-slate-700 font-serif leading-none">"</div>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Our Mission</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">Three core principles guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {missionPrinciples.map((principle, index) => {
              const Icon = principle.icon;
              const isHovered = hoveredMission === index;

              return (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredMission(index)}
                  onMouseLeave={() => setHoveredMission(null)}
                >
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-8 border-2 transition-all duration-300 h-full ${
                    isHovered
                      ? 'border-transparent shadow-2xl -translate-y-2'
                      : 'border-slate-200 dark:border-slate-700 shadow-md'
                  }`}>
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${principle.color} flex items-center justify-center transform transition-transform duration-300 ${
                        isHovered ? 'scale-110 rotate-6' : 'scale-100'
                      }`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {principle.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">How We Make It Simple</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Our process turns complex program details into actionable information
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isHovered = hoveredStep === index;

              return (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-8 border-2 transition-all duration-300 h-full ${
                    isHovered
                      ? 'border-transparent shadow-2xl -translate-y-3'
                      : 'border-slate-200 dark:border-slate-700 shadow-md'
                  }`}>
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`w-16 h-16 rounded-full ${step.bgColor} flex items-center justify-center transform transition-all duration-300 ${
                        isHovered ? 'scale-125' : 'scale-100'
                      }`}>
                        <Icon className={`w-8 h-8 ${step.color}`} />
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {step.step}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-slate-300 to-slate-200"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Find Your Discount Program
          </h2>
          <p className="text-xl text-blue-50 leading-relaxed mb-10">
            We're committed to helping patients find and access the medication assistance they need.
            Every search, every comparison, every saved program helps you access the care you deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200">
              Start Searching
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
