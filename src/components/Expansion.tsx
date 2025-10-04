import React from 'react';
import { TrendingUp } from 'lucide-react';

export function Expansion() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-emerald-600 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <TrendingUp className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">More programs coming soon</h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          We're starting with select medications and will expand coverage regularly. 
          Follow us to stay updated on new discount programs as they become available.
        </p>
      </div>
    </section>
  );
}