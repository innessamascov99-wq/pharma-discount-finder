import React from 'react';
import { Shield, Lock, Eye, Mail, FileText, Users } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Your privacy matters to us. We're committed to transparency about how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 mb-12">
            <div className="flex items-start">
              <div className="bg-emerald-100 rounded-full p-3 mr-4">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">Our Privacy Commitment</h2>
                <p className="text-emerald-700 leading-relaxed mb-4">
                  Pharma Discount Finder is built on the principle that healthcare information should be accessible 
                  without compromising your privacy. We collect only the minimum data necessary to provide our service 
                  and never store personal health information (PHI).
                </p>
                <p className="text-emerald-700 leading-relaxed">
                  This policy explains exactly what data we collect, how we use it, and your rights regarding your information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">What Data We Collect</h2>
            <p className="text-lg text-slate-600">We collect minimal, non-personal health information</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Usage Data</h3>
              </div>
              <ul className="text-slate-600 space-y-2">
                <li>• Search queries (medication names only)</li>
                <li>• Pages visited and time spent</li>
                <li>• Device type and browser information</li>
                <li>• IP address (for security and analytics)</li>
              </ul>
              <p className="text-sm text-slate-500 mt-4">
                <strong>Note:</strong> We never store personal health conditions or medical history.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 rounded-full p-3 mr-4">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Account Data (Optional)</h3>
              </div>
              <ul className="text-slate-600 space-y-2">
                <li>• Email address</li>
                <li>• Account preferences</li>
                <li>• Saved discount programs</li>
                <li>• Communication preferences</li>
              </ul>
              <p className="text-sm text-slate-500 mt-4">
                <strong>Remember:</strong> You can use our service without creating an account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Usage */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How We Use Your Data</h2>
            <p className="text-lg text-slate-600">Your data helps us improve our service for all patients</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Service Improvement</h3>
              <p className="text-slate-600 leading-relaxed">
                We analyze usage patterns to identify which medications to add next and improve search functionality.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Security & Safety</h3>
              <p className="text-slate-600 leading-relaxed">
                We monitor for suspicious activity and ensure our platform remains secure and reliable for all users.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Communication</h3>
              <p className="text-slate-600 leading-relaxed">
                If you create an account, we may send updates about new programs or important service changes.
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-6 mt-12">
            <h3 className="text-lg font-bold text-slate-800 mb-3">What We Never Do</h3>
            <ul className="text-slate-600 space-y-2">
              <li>• <strong>Sell your data</strong> to pharmaceutical companies or third parties</li>
              <li>• <strong>Share personal information</strong> with advertisers or marketers</li>
              <li>• <strong>Store health conditions</strong> or medical history</li>
              <li>• <strong>Track you across other websites</strong> or build advertising profiles</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Data Sharing */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Data Sharing</h2>
            <p className="text-lg text-slate-600">Limited sharing only with trusted service providers</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">When We Share Data</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Service Providers</h4>
                  <p className="text-slate-600 leading-relaxed">
                    We work with trusted companies that help us operate our service (hosting, analytics, email delivery). 
                    These providers are contractually required to protect your data and use it only for our service.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-emerald-100 rounded-full p-2 mr-4 mt-1">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Legal Requirements</h4>
                  <p className="text-slate-600 leading-relaxed">
                    We may disclose information if required by law, court order, or to protect the safety 
                    and security of our users and service.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Business Transfers</h4>
                  <p className="text-slate-600 leading-relaxed">
                    If our company is acquired or merged, your data would be transferred under the same 
                    privacy protections outlined in this policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Data Security</h2>
            <p className="text-lg text-slate-600">Industry-standard protection for your information</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 rounded-full p-3 mr-4">
                  <Lock className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Technical Safeguards</h3>
              </div>
              <ul className="text-slate-600 space-y-2">
                <li>• SSL/TLS encryption for all data transmission</li>
                <li>• Encrypted data storage</li>
                <li>• Regular security audits and updates</li>
                <li>• Secure hosting infrastructure</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Access Controls</h3>
              </div>
              <ul className="text-slate-600 space-y-2">
                <li>• Limited employee access on need-to-know basis</li>
                <li>• Multi-factor authentication for admin accounts</li>
                <li>• Regular access reviews and monitoring</li>
                <li>• Incident response procedures</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
            <div className="flex items-start">
              <div className="bg-amber-100 rounded-full p-2 mr-3 mt-1">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-amber-800 mb-2">Security Incident Response</h3>
                <p className="text-amber-700 leading-relaxed">
                  In the unlikely event of a data breach, we will notify affected users within 72 hours 
                  and take immediate steps to secure the system and prevent future incidents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Rights */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Privacy Rights</h2>
            <p className="text-lg text-slate-600">You have control over your personal information</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Your Rights Include:</h3>
                <ul className="text-slate-600 space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <div>
                      <strong>Access:</strong> Request a copy of the personal data we have about you
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <div>
                      <strong>Correction:</strong> Ask us to correct inaccurate or incomplete information
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <div>
                      <strong>Deletion:</strong> Request deletion of your personal data (with some exceptions)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <div>
                      <strong>Portability:</strong> Receive your data in a machine-readable format
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">How to Exercise Your Rights:</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-600 mb-4">
                    To exercise any of these rights, contact our privacy team:
                  </p>
                  <div className="flex items-center mb-3">
                    <Mail className="h-5 w-5 text-blue-600 mr-2" />
                    <a 
                      href="mailto:privacy@pharmadiscountfinder.com"
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      privacy@pharmadiscountfinder.com
                    </a>
                  </div>
                  <p className="text-sm text-slate-500">
                    We'll respond to your request within 30 days and may need to verify your identity 
                    before processing certain requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Privacy Questions?</h2>
            <p className="text-lg text-slate-600">We're here to help with any privacy concerns</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Contact Our Privacy Team</h3>
            <p className="text-slate-600 mb-6">
              For questions about this privacy policy, your data rights, or our privacy practices:
            </p>
            <a 
              href="mailto:privacy@pharmadiscountfinder.com"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Mail className="h-5 w-5 mr-2" />
              privacy@pharmadiscountfinder.com
            </a>
            <p className="text-sm text-slate-500 mt-4">
              We typically respond to privacy inquiries within 1-2 business days.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Updates */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Policy Updates</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We may update this privacy policy from time to time to reflect changes in our practices 
              or legal requirements. When we make significant changes, we'll notify users via email 
              (if you have an account) and post a notice on our website.
            </p>
            <p className="text-sm text-slate-500">
              <strong>Last updated:</strong> January 2024 | <strong>Effective date:</strong> January 1, 2024
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}