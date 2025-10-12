import React from 'react';
import { Search, Shield, Users } from 'lucide-react';
import { Button, Badge } from './ui';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge variant="secondary" className="gap-2 py-2 px-4 text-sm">
              <Shield className="w-4 h-4" />
              <span>Verified Programs</span>
            </Badge>
            <Badge variant="secondary" className="gap-2 py-2 px-4 text-sm">
              <Search className="w-4 h-4" />
              <span>Easy Search</span>
            </Badge>
            <Badge variant="secondary" className="gap-2 py-2 px-4 text-sm">
              <Users className="w-4 h-4" />
              <span>Patient-Focused</span>
            </Badge>
          </div>

          {/* Main Headlines */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Save on Brand-Name
              <br />
              <span className="text-primary">Prescriptions</span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto font-light leading-relaxed">
              We turn complex manufacturer programs into clear, simple summaries you can trust
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto text-lg h-14 px-10"
            >
              Find Discounts
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg h-14 px-10"
            >
              Create Account
            </Button>
          </div>

          {/* Supporting Information */}
          <div className="pt-8 text-center">
            <p className="text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              <strong className="text-foreground font-semibold">100% Free to Use</strong> • No Hidden Fees • Direct from Manufacturers
            </p>
          </div>

          {/* Visual Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold text-primary">500+</div>
              <div className="text-base text-foreground/70 font-medium">Verified Programs</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold text-primary">$2.5B</div>
              <div className="text-base text-foreground/70 font-medium">Potential Savings</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold text-primary">50K+</div>
              <div className="text-base text-foreground/70 font-medium">Patients Helped</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/40 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};