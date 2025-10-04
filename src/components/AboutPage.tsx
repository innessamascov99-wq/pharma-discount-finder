import React from 'react';
import { Heart, Shield, Users, Search, FileText, CheckCircle, DollarSign } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              Why We Built Pharma Discount Finder
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Prescription costs shouldn't be a barrier to health. We created this platform to make manufacturer discount programs accessible, transparent, and easy to understand for every patient.
            </p>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200 text-left">
              <blockquote className="text-lg text-slate-700 italic leading-relaxed">
                "Too many patients struggle to afford their medications, not knowing that help is available. 
                Manufacturer discount programs exist, but they're often buried in complex websites with confusing terms. 
                We believe every patient deserves clear, reliable information about their savings options."
              </blockquote>
              <div className="mt-4 text-emerald-600 font-semibold">— The Pharma Discount Finder Team</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-lg text-slate-600">Three core principles guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Affordable Access</h3>
              <p className="text-slate-600 leading-relaxed">
                Every patient should have access to information about prescription savings programs, 
                regardless of their insurance status or financial situation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Transparency</h3>
              <p className="text-slate-600 leading-relaxed">
                We source all information directly from manufacturer websites, clearly cite our sources, 
                and never alter the actual program terms.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Simplicity</h3>
              <p className="text-slate-600 leading-relaxed">
                Complex eligibility requirements and program terms are translated into clear, 
                easy-to-understand summaries that patients can rely on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How We Make It Simple</h2>
            <p className="text-lg text-slate-600">Our process turns complex program details into actionable information</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">1. Search</h3>
              <p className="text-slate-600">Enter your brand-name medication to find available programs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">2. Summarize</h3>
              <p className="text-slate-600">We translate complex terms into clear, understandable summaries</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">3. Compare</h3>
              <p className="text-slate-600">Review all available options side-by-side to find the best fit</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">4. Save</h3>
              <p className="text-slate-600">Bookmark programs and get updates on new opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Values</h2>
            <p className="text-lg text-slate-600">The principles that shape how we serve patients</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-emerald-100 rounded-full p-3 mr-4">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Trust</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                We earn trust through transparency. Every program summary includes the source, 
                fetch date, and direct link to the manufacturer's official information.
              </p>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Always cite official sources</li>
                <li>• Never alter program terms</li>
                <li>• Flag outdated information</li>
                <li>• Provide clear disclaimers</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Accessibility</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Healthcare information should be accessible to everyone, regardless of technical 
                knowledge, insurance status, or ability to create accounts.
              </p>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• No account required to browse</li>
                <li>• Mobile-friendly design</li>
                <li>• Plain language summaries</li>
                <li>• WCAG accessibility standards</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-emerald-100 rounded-full p-3 mr-4">
                  <Heart className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Empathy</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                We understand that prescription costs create real stress for patients and families. 
                Our platform is designed with compassion and respect for every user's situation.
              </p>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Patient-first design</li>
                <li>• Respectful language</li>
                <li>• No judgment or barriers</li>
                <li>• Focus on solutions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Note */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
            <div className="text-center mb-6">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Important Information</h3>
            </div>
            
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p className="text-lg font-semibold text-slate-800">
                This site is for information only, not medical advice.
              </p>
              
              <p>
                Pharma Discount Finder provides educational information about manufacturer discount programs. 
                This information should not be considered medical advice, and we are not affiliated with any 
                pharmaceutical company or healthcare provider.
              </p>
              
              <p>
                <strong>Always consult with your healthcare provider</strong> before making decisions about your medications. 
                Program terms, eligibility requirements, and availability may change without notice.
              </p>
              
              <p>
                We make every effort to ensure accuracy, but patients should verify program details directly 
                with the manufacturer before applying. Links to official sources are provided for this purpose.
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                <strong>Questions about your medication or treatment?</strong> Contact your doctor, pharmacist, 
                or healthcare provider. For questions about this website, please use our contact form.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}