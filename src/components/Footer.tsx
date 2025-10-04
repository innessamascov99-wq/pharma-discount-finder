import React from 'react';
import { Search } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Search className="h-8 w-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold text-white">Pharma Discount Finder</span>
            </div>
            <p className="text-slate-300 mb-4">
              Transparency for Patients - Simplifying prescription discount programs through verified manufacturer data.
            </p>
            <p className="text-slate-400 text-sm">
              © 2024 Pharma Discount Finder. All rights reserved.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-slate-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/medical-disclaimer" className="text-slate-300 hover:text-white transition-colors">Medical Disclaimer</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Request Coverage</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-slate-400">
            <strong className="text-emerald-400">Pharma Discount Finder</strong> — Transparency for Patients
          </p>
        </div>
      </div>
    </footer>
  );
}