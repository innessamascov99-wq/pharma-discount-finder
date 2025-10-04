import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, UserPlus } from 'lucide-react';

export function Hero() {
  const scrollToSearch = () => {
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Save on brand-name prescriptions with verified manufacturer programs
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            We collect official savings offers and turn the fine print into clear, simple summaries you can rely on.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={scrollToSearch}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center gap-2 min-w-[200px] justify-center"
            >
              Find Discounts
              <ArrowDown className="h-5 w-5" />
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg flex items-center gap-2 min-w-[200px] justify-center">
              <UserPlus className="h-5 w-5" />
              <Link to="/signup" className="flex items-center gap-2">
                Create Account
              </Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}