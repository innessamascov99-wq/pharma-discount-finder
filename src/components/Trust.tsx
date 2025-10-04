import React from 'react';
import { Shield, Globe, Calendar, AlertTriangle } from 'lucide-react';

export function Trust() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Trust & Transparency</h2>
          <p className="text-lg text-slate-600">Your confidence in our process matters</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 rounded-full p-3">
                  <Globe className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Source: Manufacturer Official Sites</h3>
                  <p className="text-slate-600">Every program is sourced directly from pharmaceutical company websites</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Fetched Date Tracking</h3>
                  <p className="text-slate-600">See exactly when each program was last updated from its source</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 rounded-full p-3">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">We Never Alter Program Terms</h3>
                  <p className="text-slate-600">We simplify language but never change the actual terms or conditions</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
            <div className="flex items-start space-x-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Important Disclaimer</h3>
                <p className="text-slate-600 leading-relaxed">
                  This information is for educational purposes only and is not medical advice. 
                  Always consult with your healthcare provider before making decisions about your medications. 
                  Program terms may change without notice.
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">
                <strong>Compliance Note:</strong> We are not affiliated with any pharmaceutical company. 
                Our goal is transparency - helping patients understand their options through clear, 
                unbiased summaries of publicly available information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}