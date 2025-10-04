import React from 'react';
import { FileText, Shield, AlertTriangle, Mail, Scale } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Please read these terms carefully before using Pharma Discount Finder. 
            By accessing our service, you agree to be bound by these terms.
          </p>
        </div>
      </section>

      {/* Agreement to Terms */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-800 mb-4">Agreement to Terms</h2>
                <p className="text-blue-700 leading-relaxed mb-4">
                  By accessing and using Pharma Discount Finder ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p className="text-blue-700 leading-relaxed">
                  If you do not agree to abide by the above, please do not use this service. These terms may be updated from time to time, and continued use of the service constitutes acceptance of any changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Service Description</h2>
            <p className="text-lg text-slate-600">What Pharma Discount Finder provides</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-emerald-100 rounded-full p-3 mr-4">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Information Service</h3>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Pharma Discount Finder provides educational information about manufacturer discount programs for prescription medications. We collect, organize, and summarize publicly available information from pharmaceutical company websites.
                </p>
                <ul className="text-slate-600 space-y-2">
                  <li>• Program summaries and eligibility information</li>
                  <li>• Links to official manufacturer sources</li>
                  <li>• Search and filtering capabilities</li>
                  <li>• Optional account features for saving programs</li>
                </ul>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 rounded-full p-3 mr-4">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Not Medical Advice</h3>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  <strong>Important:</strong> This service provides information only and is not medical advice. We are not healthcare providers, and our service should not replace consultation with qualified medical professionals.
                </p>
                <ul className="text-slate-600 space-y-2">
                  <li>• Always consult your doctor or pharmacist</li>
                  <li>• Verify program details with manufacturers</li>
                  <li>• Program terms may change without notice</li>
                  <li>• Individual eligibility may vary</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Eligibility and Use</h2>
            <p className="text-lg text-slate-600">Who can use this service and how</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Personal Use Only</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                This service is intended for personal, non-commercial use by patients and their families seeking information about prescription discount programs.
              </p>
              <ul className="text-slate-600 space-y-2">
                <li>• Individual patients and caregivers</li>
                <li>• Personal research and education</li>
                <li>• Sharing with healthcare providers</li>
                <li>• Non-commercial use only</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Prohibited Uses</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                The following uses are not permitted and may result in termination of access to the service:
              </p>
              <ul className="text-slate-600 space-y-2">
                <li>• Commercial redistribution of data</li>
                <li>• Automated scraping or data mining</li>
                <li>• Providing medical advice to others</li>
                <li>• Misrepresenting program terms</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Accounts */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">User Accounts</h2>
            <p className="text-lg text-slate-600">Optional accounts for enhanced features</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Account Creation</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Creating an account is optional. You can browse and search for discount programs without registering. Accounts provide additional features like saving programs and receiving updates.
                </p>
                <ul className="text-slate-600 space-y-2">
                  <li>• Save favorite programs</li>
                  <li>• Receive program updates</li>
                  <li>• Access search history</li>
                  <li>• Personalized recommendations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Account Responsibility</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  If you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
                </p>
                <ul className="text-slate-600 space-y-2">
                  <li>• Keep login credentials secure</li>
                  <li>• Notify us of unauthorized access</li>
                  <li>• Provide accurate information</li>
                  <li>• Update information as needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content and Data */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Content and Data</h2>
            <p className="text-lg text-slate-600">Information sources and accuracy</p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-start">
                <div className="bg-emerald-100 rounded-full p-3 mr-4">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Data Sources</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    All discount program information is sourced directly from official pharmaceutical manufacturer websites. We provide clear attribution and links to original sources for verification.
                  </p>
                  <ul className="text-slate-600 space-y-2">
                    <li>• Official manufacturer websites only</li>
                    <li>• Regular updates and freshness checks</li>
                    <li>• Clear source attribution</li>
                    <li>• Direct links for verification</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-3 mr-4">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-800 mb-3">No Guarantee of Completeness</h3>
                  <p className="text-amber-700 leading-relaxed mb-4">
                    While we strive for accuracy and completeness, we cannot guarantee that all available discount programs are included or that information is always current. Program terms may change without notice.
                  </p>
                  <ul className="text-amber-700 space-y-2">
                    <li>• Information may not be complete or current</li>
                    <li>• Program terms can change without notice</li>
                    <li>• Always verify with official sources</li>
                    <li>• Individual eligibility may vary</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Limitation of Liability</h2>
            <p className="text-lg text-slate-600">Important legal limitations</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Service Provided "As Is"</h3>
                <p className="text-slate-600 leading-relaxed">
                  Pharma Discount Finder is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Limitation of Damages</h3>
                <p className="text-slate-600 leading-relaxed">
                  In no event shall Pharma Discount Finder, its owners, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Medical Decisions</h3>
                <p className="text-slate-600 leading-relaxed">
                  We are not responsible for any medical decisions made based on information provided through our service. Always consult with qualified healthcare professionals before making decisions about your medications or treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Governing Law */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Governing Law</h2>
            <p className="text-lg text-slate-600">Legal jurisdiction and dispute resolution</p>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Jurisdiction</h3>
                <p className="text-slate-600 leading-relaxed">
                  These terms shall be interpreted and governed by the laws of the United States and the state in which our company is incorporated, without regard to conflict of law provisions.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Dispute Resolution</h3>
                <p className="text-slate-600 leading-relaxed">
                  Any disputes arising from these terms or use of the service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Questions About These Terms?</h2>
            <p className="text-lg text-slate-600">Contact us for clarification</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200 text-center">
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Legal Questions</h3>
            <p className="text-slate-600 mb-6">
              If you have questions about these terms of service or need clarification about any provisions:
            </p>
            <a 
              href="mailto:legal@pharmadiscountfinder.com"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Mail className="h-5 w-5 mr-2" />
              legal@pharmadiscountfinder.com
            </a>
            <p className="text-sm text-slate-500 mt-4">
              We typically respond to legal inquiries within 3-5 business days.
            </p>
          </div>
        </div>
      </section>

      {/* Effective Date */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Terms Effective Date</h3>
            <p className="text-slate-600 leading-relaxed">
              These Terms of Service are effective as of January 1, 2024, and were last updated on January 1, 2024. 
              Continued use of the service after any changes constitutes acceptance of the new terms.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}