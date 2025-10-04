import React, { useState } from 'react';
import { Mail, Clock, MessageCircle, ChevronDown, ChevronUp, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Button, Input } from './ui';

export const Footer: React.FC = () => {
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
    <footer className="bg-slate-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Section 1: About Us */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">
              About Pharma Discount Finder
            </h3>
            <div className="space-y-4 text-gray-300 leading-relaxed">
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
              className="border-gray-400 text-gray-300 hover:bg-gray-700 hover:border-gray-300"
            >
              Learn More
            </Button>
          </div>

          {/* Section 2: Contact Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Get In Touch
            </h3>
            
            {/* Contact Details */}
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <a 
                  href="mailto:support@pharmadiscountfinder.com"
                  className="hover:text-primary-400 transition-colors duration-200"
                >
                  support@pharmadiscountfinder.com
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-400" />
                <div>
                  <p>Monday-Friday, 9AM-5PM EST</p>
                  <p className="text-sm text-gray-400">Response Time: Within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-4 mt-6">
              <Input
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-primary-400"
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-primary-400"
              />
              <textarea
                placeholder="Your Message"
                rows={3}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200"
              />
              <Button 
                type="submit"
                variant="primary" 
                size="sm"
                icon={MessageCircle}
                className="w-full"
              >
                Send Message
              </Button>
            </form>

            <p className="text-sm text-gray-400 italic">
              For urgent medical concerns, please contact your healthcare provider
            </p>
          </div>

          {/* Section 3: Quick FAQ */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-slate-700 pb-3">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex items-center justify-between w-full text-left text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-4 h-4 text-primary-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-primary-400" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="mt-2 text-sm text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <a 
              href="#faq" 
              className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors duration-200 font-medium"
            >
              View All FAQs →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <a href="#privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <span className="text-gray-600">|</span>
            <a href="#terms" className="text-gray-400 hover:text-white transition-colors duration-200">
              Terms of Use
            </a>
            <span className="text-gray-600">|</span>
            <a href="#disclaimer" className="text-gray-400 hover:text-white transition-colors duration-200">
              Disclaimer
            </a>
          </div>

          {/* Tagline */}
          <div className="text-center mb-6">
            <p className="text-lg font-medium text-gray-300">
              Pharma Discount Finder — Transparency for Patients
            </p>
          </div>

          {/* Copyright and Social */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Pharma Discount Finder. All rights reserved.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a 
                href="#twitter" 
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#linkedin" 
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#facebook" 
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
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