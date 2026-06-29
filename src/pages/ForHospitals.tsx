import React from 'react';
import { LangCode } from '../types';
import { Building2, ShieldCheck, Activity, Code2, ArrowRight } from 'lucide-react';

export default function ForHospitals({ lang }: { lang: LangCode }) {
  const isRtl = lang === 'ar';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm mb-6">
            <Building2 className="w-4 h-4" />
            Enterprise Solutions
          </div>
          <h1 className={`text-4xl md:text-6xl font-display font-bold text-slate-900 leading-tight mb-6 ${isRtl ? 'leading-normal' : ''}`}>
            Empower your clinical teams with CareCalculus Enterprise
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            Embed validated clinical calculators directly into your hospital's Electronic Health Record (EHR) workflows. Eliminate cognitive load, reduce medication errors, and standardize clinical decision support across your entire health system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
              Contact Sales <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold transition-colors">
              View API Documentation
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-3xl transform rotate-3 scale-105" />
          <img 
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Clinical Team using EHR" 
            className="rounded-3xl relative z-10 shadow-2xl border border-white/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Evidence-Based Validation</h3>
          <p className="text-slate-600">Every calculator is peer-reviewed and cited against the latest clinical guidelines (AHA, ESC, IDSA, ARDSNet).</p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Code2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">EHR Integration (SMART/FHIR)</h3>
          <p className="text-slate-600">Embed widgets natively within Epic, Cerner, or Allscripts using our SMART on FHIR compliant components.</p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Usage Analytics</h3>
          <p className="text-slate-600">Track which tools your clinicians use most to identify training opportunities and standardize care protocols.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20" />
        
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 relative z-10">Ready to standardize your clinical decision support?</h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-8 relative z-10 text-lg">
          Join leading health systems that trust CareCalculus for error-free, instantaneous medical calculations.
        </p>
        <button className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold transition-colors relative z-10">
          Request a Demo
        </button>
      </div>
    </div>
  );
}
