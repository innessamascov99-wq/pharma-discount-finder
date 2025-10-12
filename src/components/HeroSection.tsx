import React from 'react';
import { Search, Shield, Users } from 'lucide-react';
import { Button, Badge } from './ui';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="secondary" className="gap-2">
              <Shield className="w-3 h-3" />
              <span>Verified Programs</span>
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <Search className="w-3 h-3" />
              <span>Easy Search</span>
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <Users className="w-3 h-3" />
              <span>Patient-Focused</span>
            </Badge>
          </div>

          {/* Main Headlines */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Save on brand-name prescriptions with verified manufacturer programs
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              We collect official savings offers and turn the fine print into clear, simple summaries you can rely on
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto text-base"
            >
              Find Discounts
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base"
            >
              Create Account
            </Button>
          </div>

          {/* Supporting Information */}
          <div className="pt-12 text-center">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              <strong className="text-primary font-semibold">100% Free to Use</strong> • No hidden fees • Programs sourced directly from manufacturer websites
            </p>
          </div>

          {/* Visual Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Verified Programs</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">$2.5B</div>
              <div className="text-sm text-muted-foreground">Potential Savings</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Patients Helped</div>
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