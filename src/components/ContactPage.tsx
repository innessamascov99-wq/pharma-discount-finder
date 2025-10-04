import React, { useState } from 'react';
import { Mail, Send, CheckCircle, HelpCircle } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        {/* Success State */}
        <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-emerald-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              Message Sent Successfully
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Thank you for contacting us. We'll review your message and get back to you within 1-2 business days.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Send Another Message
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Have questions about discount programs or need help with the site? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Support Information */}
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Other ways to reach us</h2>
              
              <div className="space-y-8">
                {/* Direct Email */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Direct Email</h3>
                      <p className="text-slate-600 mb-3">
                        For urgent inquiries or detailed questions, you can email us directly:
                      </p>
                      <a 
                        href="mailto:support@pharmadiscountfinder.com"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        support@pharmadiscountfinder.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* FAQ Reference */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-3 mr-4">
                      <HelpCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Check Our FAQ First</h3>
                      <p className="text-slate-600 mb-3">
                        Many common questions are answered in our FAQ section. This might help you get answers faster.
                      </p>
                      <a 
                        href="/faq"
                        className="text-emerald-600 hover:text-emerald-700 font-semibold"
                      >
                        Visit FAQ Page →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Response Time</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We typically respond to all inquiries within 1-2 business days. For urgent matters 
                    related to prescription access, please contact your healthcare provider or pharmacist directly.
                  </p>
                </div>

                {/* Common Inquiries */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Common Inquiries</h3>
                  <ul className="text-slate-600 space-y-2">
                    <li>• Questions about specific discount programs</li>
                    <li>• Requests to add new medications to our database</li>
                    <li>• Technical issues with the website</li>
                    <li>• Partnership and collaboration opportunities</li>
                    <li>• Media and press inquiries</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Important Reminder</h3>
                <p className="text-amber-700 leading-relaxed">
                  This website provides educational information only and is not medical advice. 
                  For questions about your medications or treatment, please contact your healthcare provider. 
                  For technical support or general inquiries about this website, use the contact form above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}