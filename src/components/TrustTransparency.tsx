import React from 'react';
import { Shield, Calendar, FileCheck, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from './ui';

export const TrustTransparency: React.FC = () => {
  return (
    <section className="py-24 bg-primary/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Trust & Transparency
          </h2>
          <Badge variant="default" className="text-base px-6 py-3">
            Source: Manufacturer Official Sites
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Visual Elements */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Calendar className="w-6 h-6 text-primary" />
                  Data Freshness Example
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                  <span className="text-sm font-medium">Mounjaro Savings Card</span>
                  <Badge variant="secondary" className="text-xs">
                    Updated 3 days ago
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <span className="text-sm font-medium">Humira Complete</span>
                  <Badge variant="outline" className="text-xs">
                    Updated 67 days ago
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-8">
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-lg border-2 border-primary/20">
                <Shield className="w-8 h-8 text-primary drop-shadow-sm" />
              </div>
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-lg border-2 border-primary/20">
                <FileCheck className="w-8 h-8 text-primary drop-shadow-sm" />
              </div>
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-lg border-2 border-warning/20">
                <AlertTriangle className="w-8 h-8 text-warning drop-shadow-sm" />
              </div>
            </div>
          </div>

          {/* Right Column - Text Content */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  Our Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed text-muted-foreground">
                  <strong className="text-primary font-semibold">We never alter program terms</strong> — we simplify them.
                  Every discount program is sourced directly from official manufacturer websites and
                  presented in clear, understandable language.
                </p>

                <p className="leading-relaxed text-muted-foreground">
                  Our automated systems check for updates regularly, and we clearly flag any
                  information that may be outdated to ensure you always have the most current data.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5 drop-shadow-sm" />
                  <div>
                    <h4 className="font-semibold mb-2">Important Disclaimer</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This information is for educational purposes only and is not medical advice.
                      Always consult with your healthcare provider before making decisions about
                      your medications or treatment options.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};