import React from 'react';
import { AlertTriangle, Shield, FileText, Users, ExternalLink, Scale } from 'lucide-react';

export function MedicalDisclaimerPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Medical Disclaimer
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            This platform is for informational purposes only and should never replace professional medical advice.
          </p>
        </div>
      </section>

      {/* Primary Disclaimer */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-8 mb-12">
            <div className="flex items-start">
              <div className="bg-amber-100 rounded-full p-3 mr-4">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-800 mb-4">Important: This Is Not Medical Advice</h2>
                <p className="text-amber-700 leading-relaxed text-lg mb-4">
                  Pharma Discount Finder provides educational information about manufacturer discount programs only. 
                  This information is not medical advice and should never be used as a substitute for professional 
                  medical consultation, diagnosis, or treatment.
                </p>
                <p className="text-amber-700 leading-relaxed text-lg font-semibold">
                  Always consult with your healthcare provider before making any decisions about your medications, 
                  treatment, or health condition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Not Medical Advice */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Always Consult Your Healthcare Provider</h2>
            <p className="text-lg text-slate-600">Your doctor, pharmacist, and healthcare team are your best resources</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">For Medical Questions</h3>
              </div>
              <ul className="text-slate-600 space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Your Doctor:</strong> Questions about your condition, treatment options, or medication changes
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Your Pharmacist:</strong> Drug interactions, side effects, or dosing questions
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Your Insurance:</strong> Coverage questions and prior authorization requirements
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 rounded-full p-3 mr-4">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">What We Provide</h3>
              </div>
              <ul className="text-slate-600 space-y-3">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Program Information:</strong> Summaries of manufacturer discount programs
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Eligibility Guidelines:</strong> General requirements in plain language
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Official Sources:</strong> Direct links to manufacturer websites
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Information Sources</h2>
            <p className="text-lg text-slate-600">All discount programs come directly from official manufacturer websites</p>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-emerald-100 rounded-full p-3 mr-4">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Verified Sources</h3>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Every discount program on our platform is sourced directly from official pharmaceutical 
                  manufacturer websites. We never create, modify, or alter program terms.
                </p>
                <ul className="text-slate-600 space-y-2">
                  <li>• Official manufacturer websites only</li>
                  <li>• Direct links provided for verification</li>
                  <li>• Regular updates from original sources</li>
                  <li>• Clear attribution and fetch dates</li>
                </ul>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <ExternalLink className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Always Verify</h3>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We strongly recommend verifying all program details directly with the manufacturer 
                  before applying. Program terms can change without notice.
                </p>
                <ul className="text-slate-600 space-y-2">
                  <li>• Check manufacturer websites directly</li>
                  <li>• Confirm current eligibility requirements</li>
                  <li>• Verify program expiration dates</li>
                  <li>• Contact manufacturer customer service</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Important Limitations</h2>
            <p className="text-lg text-slate-600">Program availability and eligibility can vary significantly</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 rounded-full p-3 mr-4">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Program Variability</h3>
              </div>
              <ul className="text-slate-600 space-y-3">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Eligibility Requirements:</strong> Income limits, insurance status, and other criteria vary by program
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Geographic Restrictions:</strong> Some programs may not be available in all states or regions
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Time Limits:</strong> Programs may have expiration dates or limited enrollment periods
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Information Accuracy</h3>
              </div>
              <ul className="text-slate-600 space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Program Changes:</strong> Manufacturers may modify or discontinue programs without notice
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Individual Circumstances:</strong> Your specific situation may affect program eligibility
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Application Process:</strong> Additional requirements may apply during enrollment
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Liability */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Limitation of Responsibility</h2>
            <p className="text-lg text-slate-600">Important legal limitations regarding our service</p>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-8">
            <div className="flex items-start mb-6">
              <div className="bg-amber-100 rounded-full p-3 mr-4">
                <Scale className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">No Responsibility for Medical or Financial Decisions</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Pharma Discount Finder and its operators are not responsible for any medical treatment decisions, 
                  financial outcomes, or consequences resulting from the use of information provided on this platform.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-3">Medical Decisions</h4>
                <ul className="text-slate-600 space-y-2">
                  <li>• We do not provide medical advice or recommendations</li>
                  <li>• We are not healthcare providers or medical professionals</li>
                  <li>• Treatment decisions should be made with your doctor</li>
                  <li>• We cannot assess individual medical situations</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-3">Financial Decisions</h4>
                <ul className="text-slate-600 space-y-2">
                  <li>• Program savings amounts may vary by individual</li>
                  <li>• We cannot guarantee program acceptance or savings</li>
                  <li>• Financial outcomes depend on many factors</li>
                  <li>• Always verify costs with your pharmacy</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 mt-8 border border-slate-200">
              <p className="text-slate-600 leading-relaxed">
                <strong>By using this service, you acknowledge that:</strong> You understand this is informational content only, 
                you will consult with healthcare professionals for medical decisions, you will verify all program information 
                independently, and you accept full responsibility for your medical and financial decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="bg-red-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border-2 border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="bg-red-200 rounded-full p-2 mr-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800 mb-2">Medical Emergency</h3>
                <p className="text-red-700 leading-relaxed">
                  If you are experiencing a medical emergency, do not use this website. 
                  Call 911 (US) or your local emergency number immediately, or go to the nearest emergency room.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Questions */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Questions About This Disclaimer?</h2>
          <p className="text-lg text-slate-600 mb-8">
            For questions about this medical disclaimer or our information practices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Contact Support
            </a>
            <a 
              href="/faq"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              View FAQ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}