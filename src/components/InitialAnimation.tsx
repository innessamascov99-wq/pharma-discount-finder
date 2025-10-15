import React, { useEffect, useState } from 'react';
import { Pill, Heart } from 'lucide-react';

interface InitialAnimationProps {
  onComplete: () => void;
}

export const InitialAnimation: React.FC<InitialAnimationProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1500);
    const timer3 = setTimeout(() => setStage(3), 3000);
    const timer4 = setTimeout(() => {
      setStage(4);
      setTimeout(onComplete, 800);
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center transition-opacity duration-500 pt-20 md:pt-0 ${
        stage === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Images */}
          <div className="relative h-[400px] md:h-[500px]">
            {/* Elderly Woman Image */}
            <div
              className={`absolute inset-0 rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000 ${
                stage >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
              }`}
            >
              <img
                src="https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Happy elderly woman"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Pharmacist Image - Overlay */}
            <div
              className={`absolute bottom-0 right-0 w-2/3 h-2/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-background transition-all duration-1000 delay-300 ${
                stage >= 2 ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-20 translate-y-20'
              }`}
            >
              <img
                src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Pharmacist helping customer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Floating Heart Icon */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 delay-500 ${
                stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
            >
              <div className="relative">
                <div className="w-20 h-20 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                  <Heart className="w-10 h-10 text-primary fill-primary" />
                </div>
                {/* Ripple Effect */}
                <div className="absolute inset-0 w-20 h-20 bg-primary/30 rounded-full animate-ping" />
              </div>
            </div>
          </div>

          {/* Right Side - Text Content */}
          <div className="space-y-8">
            {/* Logo */}
            <div
              className={`transition-all duration-1000 ${
                stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)' }}>
                  <Pill className="w-9 h-9 text-white drop-shadow-md animate-wiggle" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Pharma Discount Finder
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium">
                    Medication Made Affordable
                  </p>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
                Helping Patients
                <br />
                <span className="text-primary">Save on Prescriptions</span>
              </h2>
              <p className="text-xl text-foreground/70 font-light leading-relaxed">
                Connecting you with verified manufacturer discount programs
              </p>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-3 gap-6 transition-all duration-1000 delay-500 ${
                stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-foreground/70">Programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">$2.5B</div>
                <div className="text-sm text-foreground/70">Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-foreground/70">Patients</div>
              </div>
            </div>

            {/* Loading Bar */}
            <div
              className={`transition-all duration-1000 delay-700 ${
                stage >= 3 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: stage >= 3 ? '100%' : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
