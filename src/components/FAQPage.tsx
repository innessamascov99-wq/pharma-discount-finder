import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Do I need to create an account to find discounts?",
      answer: "No! You can browse and search for discount programs without creating an account. An account is only needed if you want to save programs for later or receive notifications about new opportunities."
    },
    {
      question: "How current is the information on your site?",
      answer: "We fetch program information regularly from official manufacturer websites. Each program shows when it was last updated, and we automatically flag any program that hasn't been refreshed in over 60 days to ensure you're seeing the most current information available."
    },
    {
      question: "Where do the discount programs come from?",
      answer: "All discount programs come directly from official pharmaceutical manufacturer websites. We never create or modify programs - we simply collect the information from companies like Pfizer, Merck, Lilly, and others, then present it in an easy-to-understand format."
    },
    {
      question: "Is this medical advice?",
      answer: "No, this is not medical advice. Pharma Discount Finder provides educational information about manufacturer discount programs only. Always consult with your healthcare provider before making decisions about your medications or treatment."
    },
    {
      question: "Will more medications be added to the database?",
      answer: "Yes! We're continuously expanding our database of covered medications. We start with the most commonly prescribed brand-name drugs and regularly add new programs. If your medication isn't currently covered, you can request it through our contact form."
    },
    {
      question: "Is my personal data safe?",
      answer: "Yes, your privacy is protected. We don't store any personal health information (PHI). If you create an account, we only store basic information like your email and saved programs. We never share your data with pharmaceutical companies or third parties."
    },
    {
      question: "Can I use these programs with my insurance?",
      answer: "It depends on the specific program. Some manufacturer programs can be used alongside insurance, while others are for uninsured patients only. Each program summary clearly explains eligibility requirements, including insurance status."
    },
    {
      question: "How do I know if a program is legitimate?",
      answer: "Every program on our site includes a direct link to the official manufacturer website where the program is hosted. We recommend verifying program details directly with the manufacturer before applying, and we provide these source links for that purpose."
    },
    {
      question: "What if my medication isn't listed?",
      answer: "If your medication isn't currently in our database, you can request it through our contact form. We prioritize adding frequently requested medications and focus on brand-name drugs with available manufacturer discount programs."
    },
    {
      question: "Are there income requirements for these programs?",
      answer: "Many programs have income requirements, but they vary significantly. Some programs are available regardless of income if you have commercial insurance, while others are specifically for patients who meet certain financial criteria. Each program summary clearly outlines any income restrictions."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <HelpCircle className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Quick answers to common questions about finding and using prescription discount programs
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  className="w-full px-6 py-5 text-left bg-white hover:bg-slate-50 transition-colors flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
                >
                  <h3 className="font-semibold text-slate-800 pr-4 text-lg">{faq.question}</h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-500" />
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 bg-slate-50 border-t border-slate-200">
                    <p className="text-slate-600 leading-relaxed pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Still Have Questions?</h2>
          <p className="text-lg text-slate-600 mb-8">
            Can't find what you're looking for? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Contact Support
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
              Request Coverage
            </button>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Important Reminder</h3>
                <p className="text-amber-700 leading-relaxed">
                  This information is for educational purposes only and is not medical advice. 
                  Always consult with your healthcare provider before making decisions about your medications. 
                  Program terms may change without notice, and eligibility requirements vary by program.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}