import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Twitter, Linkedin, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 sm:gap-12 lg:gap-16">

          {/* Section: Quick FAQ */}
          <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-center">
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

            <div className="text-center">
              <a
                href="/faq"
                className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors duration-200 font-medium"
              >
                View All FAQs →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-4 sm:mb-6 text-sm sm:text-base">
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
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-base sm:text-lg font-medium text-gray-300">
              Diabetic Discount Finder — Transparency for Patients
            </p>
          </div>

          {/* Copyright and Social */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Diabetic Discount Finder. All rights reserved.
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