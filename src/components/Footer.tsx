import React, { useState } from 'react';
import { Mail, Clock, MessageCircle, ChevronDown, ChevronUp, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Button, Input } from './ui';
import { useTheme } from '../contexts/ThemeContext';

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isMonochrome = theme === 'monochrome';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
    // Reset form
    setContactForm({ name: '', email: '', message: '' });
  };

  const faqs = [
    {
      question: "Do I need an account?",
      answer: "No, browse freely. Accounts are optional for saving programs."
    },
    {
      question: "Is this medical advice?",
      answer: "No, this is informational only. Consult your doctor."
    },
    {
      question: "How current is the data?",
      answer: "Programs are regularly updated and flagged if over 60 days old."
    },
    {
      question: "Are these programs legitimate?",
      answer: "Yes, all programs are sourced directly from official manufacturer websites."
    }
  ];

  return (
    <footer className={`${
      isMonochrome ? 'bg-gray-300' : 'bg-slate-800'
    } ${isMonochrome ? 'text-gray-900' : 'text-white'}`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
          
          {/* Section 1: About Us */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${
              isMonochrome ? 'text-gray-900' : 'text-white'
            }`}>
              About Pharma Discount Finder
            </h3>
            <div className={`space-y-4 leading-relaxed ${
              isMonochrome ? 'text-gray-700' : 'text-gray-300'
            }`}>
              <p>
                We help patients find verified manufacturer discount programs for brand-name prescriptions. 
                Our mission is to make healthcare more affordable through transparency and accessibility.
              </p>
              <p>
                Every program is sourced directly from official manufacturer websites and summarized 
                in plain English.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className={isMonochrome
                ? "border-gray-600 text-gray-900 hover:bg-gray-400"
                : "border-gray-400 text-gray-300 hover:bg-gray-700"
              }
            >
              Learn More
            </Button>
          </div>

          {/* Section 2: Contact Information */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${
              isMonochrome ? 'text-gray-900' : 'text-white'
            }`}>
              Get In Touch
            </h3>

            {/* Contact Details */}
            <div className={`space-y-4 ${
              isMonochrome ? 'text-gray-700' : 'text-gray-300'
            }`}>
              <div className="flex items-center gap-3">
                <Mail className={`w-5 h-5 ${
                  isMonochrome ? 'text-gray-600' : 'text-primary-400'
                }`} />
                <a
                  href="mailto:support@pharmadiscountfinder.com"
                  className={isMonochrome
                    ? "hover:text-gray-900 transition-colors duration-200"
                    : "hover:text-primary-400 transition-colors duration-200"
                  }
                >
                  support@pharmadiscountfinder.com
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className={`w-5 h-5 ${
                  isMonochrome ? 'text-gray-600' : 'text-primary-400'
                }`} />
                <div>
                  <p>Monday-Friday, 9AM-5PM EST</p>
                  <p className={`text-sm ${
                    isMonochrome ? 'text-gray-600' : 'text-gray-400'
                  }`}>Response Time: Within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-4 mt-6">
              <Input
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className={isMonochrome
                  ? "bg-gray-200 border-gray-400 text-gray-900 placeholder-gray-600 focus:border-gray-600"
                  : "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-primary-400"
                }
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className={isMonochrome
                  ? "bg-gray-200 border-gray-400 text-gray-900 placeholder-gray-600 focus:border-gray-600"
                  : "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-primary-400"
                }
              />
              <textarea
                placeholder="Your Message"
                rows={3}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-all duration-200 ${
                  isMonochrome
                    ? "border-gray-400 bg-gray-200 text-gray-900 placeholder-gray-600 focus:border-gray-600 focus:ring-gray-300"
                    : "border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:border-primary-400 focus:ring-primary-200"
                }`}
              />
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="w-full gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Send Message
              </Button>
            </form>

            <p className={`text-sm italic ${
              isMonochrome ? 'text-gray-600' : 'text-gray-400'
            }`}>
              For urgent medical concerns, please contact your healthcare provider
            </p>
          </div>

          {/* Section 3: Quick FAQ */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${
              isMonochrome ? 'text-gray-900' : 'text-white'
            }`}>
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className={`border-b pb-3 ${
                  isMonochrome ? 'border-gray-400' : 'border-slate-700'
                }`}>
                  <button
                    onClick={() => toggleFaq(index)}
                    className={`flex items-center justify-between w-full text-left transition-colors duration-200 ${
                      isMonochrome
                        ? 'text-gray-700 hover:text-gray-900'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="font-medium">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className={`w-4 h-4 ${
                        isMonochrome ? 'text-gray-600' : 'text-primary-400'
                      }`} />
                    ) : (
                      <ChevronDown className={`w-4 h-4 ${
                        isMonochrome ? 'text-gray-600' : 'text-primary-400'
                      }`} />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className={`mt-2 text-sm leading-relaxed ${
                      isMonochrome ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <a
              href="#faq"
              className={`inline-flex items-center transition-colors duration-200 font-medium ${
                isMonochrome
                  ? 'text-gray-700 hover:text-gray-900'
                  : 'text-primary-400 hover:text-primary-300'
              }`}
            >
              View All FAQs →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={`border-t ${
        isMonochrome ? 'border-gray-400' : 'border-slate-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-4 sm:mb-6 text-sm sm:text-base">
            <a href="#privacy" className={isMonochrome
              ? "text-gray-600 hover:text-gray-900 transition-colors duration-200"
              : "text-gray-400 hover:text-white transition-colors duration-200"
            }>
              Privacy Policy
            </a>
            <span className={isMonochrome ? 'text-gray-500' : 'text-gray-600'}>|</span>
            <a href="#terms" className={isMonochrome
              ? "text-gray-600 hover:text-gray-900 transition-colors duration-200"
              : "text-gray-400 hover:text-white transition-colors duration-200"
            }>
              Terms of Use
            </a>
            <span className={isMonochrome ? 'text-gray-500' : 'text-gray-600'}>|</span>
            <a href="#disclaimer" className={isMonochrome
              ? "text-gray-600 hover:text-gray-900 transition-colors duration-200"
              : "text-gray-400 hover:text-white transition-colors duration-200"
            }>
              Disclaimer
            </a>
          </div>

          {/* Tagline */}
          <div className="text-center mb-4 sm:mb-6">
            <p className={`text-base sm:text-lg font-medium ${
              isMonochrome ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Pharma Discount Finder — Transparency for Patients
            </p>
          </div>

          {/* Copyright and Social */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${
              isMonochrome ? 'text-gray-600' : 'text-gray-400'
            }`}>
              © 2025 Pharma Discount Finder. All rights reserved.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a
                href="#twitter"
                className={isMonochrome
                  ? "text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  : "text-gray-400 hover:text-primary-400 transition-colors duration-200"
                }
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#linkedin"
                className={isMonochrome
                  ? "text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  : "text-gray-400 hover:text-primary-400 transition-colors duration-200"
                }
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#facebook"
                className={isMonochrome
                  ? "text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  : "text-gray-400 hover:text-primary-400 transition-colors duration-200"
                }
                aria-label="Like us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};