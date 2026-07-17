import React, { useState } from 'react';
import { X, Mail, Check, AlertCircle, HeartPulse } from 'lucide-react';
import { LangCode } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: LangCode;
}

export default function ContactModal({ isOpen, onClose, lang = 'en' }: ContactModalProps) {
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim() || !subject) {
      setError(lang === 'fr' ? 'Veuillez remplir tous les champs obligatoires.' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setSubject('');
      setEmail('');
      setMessage('');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  const t = {
    en: {
      title: "Contact CareCalculus Support",
      sub: "Have feedback, custom EHR integration requests, or questions? Send us a direct line.",
      subjectLabel: "Subject of Inquiry *",
      selectPlaceholder: "Select a topic...",
      opt1: "Clinical Calculator Feedback / Corrections",
      opt2: "EHR SMART on FHIR Integration Details",
      opt3: "Continuous Medical Education (CME) Partnership",
      opt4: "General Inquiry / Report a Bug",
      emailLabel: "Clinician Email *",
      emailPlaceholder: "dr.name@hospital.org",
      msgLabel: "Detailed Message *",
      msgPlaceholder: "Describe your clinical feedback or inquiry details here...",
      submitBtn: "Send Message",
      submitting: "Delivering...",
      successMsg: "Message delivered successfully! We'll reply shortly.",
    },
    fr: {
      title: "Contacter le Support CareCalculus",
      sub: "Des retours, des demandes d'intégration EHR sur mesure ou des questions ? Écrivez-nous.",
      subjectLabel: "Sujet de la demande *",
      selectPlaceholder: "Sélectionnez un sujet...",
      opt1: "Retour sur un Calculateur / Correction",
      opt2: "Détails de l'intégration EHR (SMART on FHIR)",
      opt3: "Partenariat d'Enseignement Médical (CME)",
      opt4: "Demande générale / Signaler un bug",
      emailLabel: "Email du Praticien *",
      emailPlaceholder: "dr.nom@hopital.fr",
      msgLabel: "Message Détaillé *",
      msgPlaceholder: "Décrivez vos retours cliniques ou les détails de votre demande ici...",
      submitBtn: "Envoyer le Message",
      submitting: "Envoi en cours...",
      successMsg: "Message envoyé avec succès ! Nous vous répondrons sous peu.",
    }
  };

  const dict = t[lang] || t.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        {/* Decorative lighting effect */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500" />
        
        {/* Header */}
        <div className="px-6 pt-7 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
            <HeartPulse className="w-5 h-5 shrink-0" />
            <h2 id="contact-modal-title" className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
              {dict.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition duration-200"
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-7 space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {dict.sub}
          </p>

          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300 font-semibold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 rounded-2xl flex items-center gap-2.5 text-xs text-teal-700 dark:text-teal-300 font-semibold animate-fade-in">
              <Check className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />
              <span>{dict.successMsg}</span>
            </div>
          )}

          {/* Subject Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {dict.subjectLabel}
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white outline-none transition-all duration-200 shadow-2xs"
              style={{ minHeight: '44px' }}
            >
              <option value="" disabled>{dict.selectPlaceholder}</option>
              <option value="calculator">{dict.opt1}</option>
              <option value="ehr">{dict.opt2}</option>
              <option value="cme">{dict.opt3}</option>
              <option value="general">{dict.opt4}</option>
            </select>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {dict.emailLabel}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450 dark:text-slate-500 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.emailPlaceholder}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl text-xs font-semibold text-slate-850 dark:text-white outline-none transition-all duration-200 shadow-2xs"
                style={{ minHeight: '44px' }}
              />
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {dict.msgLabel}
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={dict.msgPlaceholder}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl text-xs font-semibold text-slate-850 dark:text-white outline-none transition-all duration-200 shadow-2xs resize-none"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white text-xs font-extrabold rounded-2xl transition duration-200 shadow-md shadow-teal-500/20 active:scale-98 flex items-center justify-center gap-1.5"
            style={{ minHeight: '44px' }}
          >
            {isSubmitting ? dict.submitting : dict.submitBtn}
          </button>
        </form>
      </div>
    </div>
  );
}
