import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, HelpCircle, Clock, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button, Input } from '../components/ui';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (formData.fullName && formData.email && formData.message) {
      setSubmitStatus('success');
      setFormData({ fullName: '', email: '', message: '' });
    } else {
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const commonInquiries = [
    'Questions about specific discount programs',
    'Requests to add new medications to our database',
    'Technical issues with the website',
    'Partnership and collaboration opportunities',
    'Media and press inquiries'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <section className="bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 mb-8 shadow-lg animate-pulse">
            <Mail className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 dark:text-slate-100 mb-6 tracking-tight">
            Get in Touch
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Have questions about discount programs or need help with the site?
          </p>
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            We're here to help.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Send us a message</h2>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-emerald-800 font-medium">Message sent successfully!</p>
                      <p className="text-emerald-700 text-sm mt-1">We'll get back to you within 1-2 business days.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm">Please fill in all required fields.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your full name"
                      className={`h-12 transition-all duration-200 ${
                        focusedField === 'fullName' ? 'ring-2 ring-blue-500' : ''
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your email address"
                      className={`h-12 transition-all duration-200 ${
                        focusedField === 'email' ? 'ring-2 ring-blue-500' : ''
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 ${
                        focusedField === 'message' ? 'ring-2 ring-blue-500' : ''
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Other ways to reach us</h2>

                <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Direct Email</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 leading-relaxed">
                          For urgent inquiries or detailed questions, you can email us directly:
                        </p>
                        <a
                          href="mailto:support@pharmadiscountfinder.com"
                          className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                        >
                          support@pharmadiscountfinder.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Check Our FAQ First</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 leading-relaxed">
                          Many common questions are answered in our FAQ section. This might help you get answers faster.
                        </p>
                        <Link
                          to="/faq"
                          className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors inline-flex items-center gap-1"
                        >
                          Visit FAQ Page →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-slate-700 dark:text-slate-300 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Response Time</h3>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      We typically respond to all inquiries within 1-2 business days. For urgent matters related to prescription access, please contact your healthcare provider or pharmacist directly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-slate-700 dark:text-slate-300 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Common Inquiries</h3>
                    <ul className="space-y-2.5">
                      {commonInquiries.map((inquiry, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-2"></span>
                          <span>{inquiry}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            We Value Your Feedback
          </h2>
          <p className="text-xl text-blue-50 leading-relaxed mb-8">
            Your questions and suggestions help us improve our platform and better serve patients looking for affordable medication options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 font-semibold"
              >
                Learn About Us
              </Button>
            </Link>
            <Link to="/faq">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-2 border-white hover:bg-white/10 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 font-semibold"
              >
                Browse FAQs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
