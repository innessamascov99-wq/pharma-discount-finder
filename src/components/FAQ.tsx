import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Do I need to create an account to find discounts?",
      answer: "No! You can browse and search for discount programs without creating an account. An account is only needed if you want to save programs for later or receive notifications about new opportunities."
    },
    {
      question: "How do you ensure the information is accurate?",
      answer: "We source all information directly from official manufacturer websites and clearly cite each source. Our system flags any program that hasn't been updated in over 60 days, and we never alter the actual program terms."
    },
    {
      question: "Is this service free to use?",
      answer: "Yes, Pharma Discount Finder is completely free for patients. We make money through partnerships with healthcare organizations, never through patient data or fees."
    },
    {
      question: "Can I use these programs with my insurance?",
      answer: "It depends on the specific program. Some manufacturer programs can be used alongside insurance, while others are for uninsured patients only. Each program summary clearly explains eligibility requirements."
    },
    {
      question: "What if my medication isn't listed?",
      answer: "We're continuously expanding our database. If your medication isn't currently covered, you can request it through our contact form, and we'll prioritize adding it to our system."
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600">Quick answers to common questions</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left bg-white hover:bg-slate-50 transition-colors flex items-center justify-between"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="font-semibold text-slate-800 pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 bg-slate-50">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}