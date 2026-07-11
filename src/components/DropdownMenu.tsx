import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  ChevronDown, 
  User, 
  BookOpen, 
  Cpu, 
  HelpCircle, 
  Info, 
  Scale, 
  Mail, 
  LogOut, 
  LogIn 
} from 'lucide-react';
import { LangCode } from '../types';

interface DropdownMenuProps {
  user: any;
  logout: () => void;
  onAuthClick: () => void;
  onEhrClick: () => void;
  onContactClick: () => void;
  langPath: (path: string) => string;
  lang?: LangCode;
}

export default function DropdownMenu({
  user,
  logout,
  onAuthClick,
  onEhrClick,
  onContactClick,
  langPath,
  lang = 'en'
}: DropdownMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close menus on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsBellOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const t = {
    en: {
      login: "Log In / Sign Up",
      logout: "Sign Out",
      cme: "CME Packages",
      ehr: "Get CareCalculus in Your EHR",
      faq: "FAQs / Q&A",
      about: "About CareCalculus",
      legal: "Legal & Disclaimers",
      contact: "Contact Us",
      alertsTitle: "Clinical Notifications",
      noAlerts: "No new clinical alerts at this time.",
    },
    fr: {
      login: "Connexion / Inscription",
      logout: "Se déconnecter",
      cme: "Offres CME / Formations",
      ehr: "CareCalculus dans votre EHR",
      faq: "Foire Aux Questions / Q&A",
      about: "À propos de CareCalculus",
      legal: "Mentions Légales",
      contact: "Contactez-nous",
      alertsTitle: "Notifications Cliniques",
      noAlerts: "Aucune nouvelle alerte clinique pour le moment.",
    }
  };

  const dict = t[lang] || t.en;

  return (
    <div className="flex items-center gap-2">
      
      {/* 1. Notification Bell Dropdown */}
      <div ref={bellRef} className="relative">
        <button
          onClick={() => {
            setIsBellOpen(!isBellOpen);
            setIsMenuOpen(false);
          }}
          className={`relative p-2.5 rounded-xl border transition duration-250 flex items-center justify-center cursor-pointer ${
            isBellOpen 
              ? 'bg-teal-50 dark:bg-slate-800 border-teal-300 dark:border-teal-800 text-teal-600 dark:text-teal-400' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Clinical notifications"
          aria-expanded={isBellOpen}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
        </button>

        {isBellOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-1 duration-150">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2">
              {dict.alertsTitle}
            </h4>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl text-2xs text-slate-500 dark:text-slate-400 text-center">
              {dict.noAlerts}
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Profile / Dropdown Menu */}
      <div ref={menuRef} className="relative">
        {user ? (
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsBellOpen(false);
            }}
            className="flex items-center gap-1.5 p-1 pr-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition duration-200 cursor-pointer"
            style={{ minHeight: '44px' }}
            aria-expanded={isMenuOpen}
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {user.email ? user.email.charAt(0) : 'U'}
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsBellOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold rounded-xl transition duration-200 shadow-md shadow-teal-500/10 active:scale-97 cursor-pointer"
            style={{ minHeight: '44px' }}
            aria-expanded={isMenuOpen}
          >
            <span>{dict.login.split(' / ')[0]}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        )}

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 py-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
            
            {/* User Session item */}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-3 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>{dict.logout}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onAuthClick();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition cursor-pointer"
              >
                <LogIn className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />
                <span>{dict.login}</span>
              </button>
            )}

            <div className="border-t border-slate-100 dark:border-slate-800 my-1.5" />

            {/* CME Packages */}
            <Link
              to={langPath('/courses')}
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white flex items-center gap-3 transition"
            >
              <BookOpen className="w-4 h-4 shrink-0 text-slate-400" />
              <span>{dict.cme}</span>
            </Link>

            {/* EHR Integration */}
            <Link
              to={langPath('/for-hospitals')}
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white flex items-center gap-3 transition"
            >
              <Cpu className="w-4 h-4 shrink-0 text-slate-400" />
              <span>{dict.ehr}</span>
            </Link>

            {/* FAQs */}
            <button
              onClick={() => {
                onEhrClick(); // Use EHR Lab Parser as faqs helper or trigger modal
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white flex items-center gap-3 transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
              <span>{dict.faq}</span>
            </button>

            {/* About */}
            <Link
              to={langPath('/about')}
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white flex items-center gap-3 transition"
            >
              <Info className="w-4 h-4 shrink-0 text-slate-400" />
              <span>{dict.about}</span>
            </Link>

            <div className="border-t border-slate-100 dark:border-slate-800 my-1.5" />

            {/* Legal */}
            <Link
              to={langPath('/disclaimer')}
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition"
            >
              <Scale className="w-4 h-4 shrink-0 text-slate-400" />
              <span>{dict.legal}</span>
            </Link>

            {/* Contact Us */}
            <button
              onClick={() => {
                onContactClick();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-xs font-bold text-teal-650 dark:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition cursor-pointer"
            >
              <Mail className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />
              <span>{dict.contact}</span>
            </button>

          </div>
        )}
      </div>

    </div>
  );
}
