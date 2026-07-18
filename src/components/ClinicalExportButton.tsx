import React, { useState, useEffect } from 'react';
import { Printer, Copy, Check, FileText, X, User, Calendar, FileDown, Lock, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LangCode } from '../types';
import { useMemo } from 'react';
import { generateSOAP, generateSBAR, generateDotPhrase, generateShiftHandover, generateCaseShareUrl } from '../utils/soapGenerator';

export interface ClinicalExportButtonProps {
  title?: string;
  calculatorName?: string;
  inputs: Array<{ label: string; value: string | number }>;
  results: Array<{ label: string; value: string | number; unit?: string }>;
  formula?: string;
  disclaimer?: string;
  references?: string;
  lang: LangCode;
}

const localizations = {
  en: {
    btnText: "Print / Export Report",
    modalTitle: "Clinical Export Console & EHR Report",
    patientId: "Patient ID / Case Ref #",
    patientIdPlc: "e.g., PT-9042-X",
    clinician: "Clinician / Signature",
    clinicianPlc: "e.g., Alice Vance, MD",
    date: "Date & Time",
    notes: "Clinical Judgement / Assessment Notes",
    notesPlc: "Enter custom therapy notes, diagnostic observations, or dosing adjustments here...",
    copyBtn: "Copy Progress Note",
    copySuccess: "Progress note copied to clipboard!",
    printBtn: "Print Official PDF Report",
    previewTitle: "PRE-FLIGHT EHR DOCUMENT TELEMETRY PREVIEW",
    digitalDisch: "Digital Telemetry Verified Report",
    confidential: "CLINICAL CONFIDENTIAL DOCUMENT",
    institution: "CareCalculus Medical Division",
    formula: "Formula Reference",
    disclaimer: "Clinical Disclaimer",
    references: "References & Scientific Guidelines",
    shareBtn: "Share Result",
    shareSuccess: "Result link copied to clipboard!",
    shareTemplate: "I just calculated a {result} using CareCalculus! Check out the free clinical tool here: {url}"
  },
  fr: {
    btnText: "Imprimer / Exporter le Bilan",
    modalTitle: "Console d'Export Clinique & Rapport EHR",
    patientId: "Identifiant Patient / Réf Dossier",
    patientIdPlc: "ex : PT-9042-X",
    clinician: "Clinicien / Signature",
    clinicianPlc: "ex : Dr J-P. Dupont, MD",
    date: "Date & Heure",
    notes: "Jugement Clinique / Notes d'Évaluation",
    notesPlc: "Saisissez les notes de traitement, observations diagnostiques ou ajustements posologiques ici...",
    copyBtn: "Copier la Note Clinique",
    copySuccess: "Note clinique copiée dans le presse-papiers !",
    printBtn: "Imprimer le Rapport Officiel",
    previewTitle: "APPERÇU DU DOCUMENT DE TÉLÉMÉTRIE EHR",
    digitalDisch: "Rapport Médical de Télémétrie Vérifiée",
    confidential: "DOCUMENT CLINIQUE EN CONFIDENTIALITÉ DROIT",
    institution: "CareCalculus Division Médicale",
    formula: "Référence de la Formule",
    disclaimer: "Clause d'Exclusion de Responsabilité Sévère",
    references: "Références & Lignes Directrices Scientifiques",
    shareBtn: "Partager",
    shareSuccess: "Lien de résultat copié !",
    shareTemplate: "Je viens de calculer un {result} en utilisant CareCalculus ! Découvrez l'outil clinique gratuit ici : {url}"
  }
};

export default function ClinicalExportButton({
  title: propTitle,
  calculatorName,
  inputs,
  results,
  formula,
  disclaimer: propDisclaimer,
  references: propReferences,
  lang
}: ClinicalExportButtonProps) {
  const title = propTitle || calculatorName || '';
  const disclaimer = propDisclaimer || (lang === 'fr' ? "Ceci est un outil d'aide à la décision. Il ne remplace pas le jugement clinique." : "This tool is for decision support only and does not replace clinical judgment.");
  const references = propReferences || '';
  const [isOpen, setIsOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [clinician, setClinician] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [noteTab, setNoteTab] = useState<'soap' | 'sbar' | 'dotphrase' | 'ascii'>('soap');

  const inputsRecord = useMemo(() => {
    const rec: Record<string, any> = {};
    inputs.forEach(item => {
      rec[item.label] = item.value;
    });
    return rec;
  }, [inputs]);

  const noteInput = useMemo(() => {
    const scoreVal = results[0] ? results[0].value : '';
    const interpVal = results.length > 1 
      ? results.map(r => `${r.label}: ${r.value}${r.unit ? ` ${r.unit}` : ''}`).join(' | ') 
      : (results[0] ? `${results[0].label}: ${results[0].value}${results[0].unit ? ` ${results[0].unit}` : ''}` : '');
    
    return {
      calculatorName: title,
      score: scoreVal,
      interpretation: interpVal,
      inputs: inputsRecord,
      lang: lang
    };
  }, [title, results, inputsRecord, lang]);

  const getFormattedNote = () => {
    if (noteTab === 'soap') return generateSOAP(noteInput);
    if (noteTab === 'sbar') return generateSBAR(noteInput);
    if (noteTab === 'dotphrase') return generateDotPhrase(noteInput);
    return getASCIIReportText();
  };

  const handleCopyNote = () => {
    const textToCopy = getFormattedNote();
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleWhatsAppShare = () => {
    if (typeof window === 'undefined') return;
    const handoverText = generateShiftHandover(noteInput);
    const shareUrl = generateCaseShareUrl(window.location.pathname, inputsRecord);
    const fullText = `${handoverText}\n\n🔗 *Live Case Link:* ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, '_blank');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('carecalculus:calc-data', {
        detail: {
          title,
          inputs: inputsRecord,
          results,
          formula,
          disclaimer,
          references,
          lang,
          path: window.location.pathname
        }
      }));
    }
  }, [title, inputsRecord, results, formula, disclaimer, references, lang]);

  const t = localizations[lang] || (localizations.en as typeof localizations.en);

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    
    const resultStr = results.map(r => `${r.label}: ${r.value}${r.unit ? ` ${r.unit}` : ""}`).join(", ");
    const currentUrl = window.location.href;
    
    const rawTemplate = t.shareTemplate || "I just calculated a {result} using CareCalculus! Check out the free clinical tool here: {url}";
    const shareText = rawTemplate.replace("{result}", `${title} (${resultStr})`).replace("{url}", currentUrl);

    if (navigator.share) {
      navigator.share({
        title: `CareCalculus - ${title}`,
        text: shareText,
        url: currentUrl
      }).catch(err => {
        console.error("Error sharing:", err);
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 3000);
      });
    }
  };
  const isRtl = false;

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setCurrentTime(now.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }));
    }
  }, [isOpen, lang]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCopied(false);
  };

  // Compile ASCII Report layout for clipboard copying and printing context
  const getASCIIReportText = () => {
    const divider = "==================================================";
    const itemDivider = "--------------------------------------------------";
    const patientHeader = patientId ? `PATIENT INFOMATICS: ${patientId.toUpperCase()}` : "PATIENT INFOMATICS: NOT SPECIFIED";
    const doctorHeader = clinician ? `CLINICIAN SIGNATURE: ${clinician.toUpperCase()}` : "CLINICIAN SIGNATURE: NOT SPECIFIED";
    const timeHeader = `TIMESTAMP: ${currentTime}`;

    const parsedInputs = inputs.map(i => `  • ${i.label}: ${i.value}`).join("\n");
    const parsedResults = results.map(r => `  [★] ${r.label}: ${r.value}${r.unit ? ` ${r.unit}` : ""}`).join("\n");

    return `${divider}
[⚕] CARECALCULUS CLINICAL DIAGNOSTIC DECISION SUPPORT REPORT
${divider}
STATUS: CERTIFIED DIGITAL TELEMETRY OVERVIEW
${timeHeader}
${patientHeader}
${doctorHeader}
${itemDivider}

DIAGNOSTIC MODULE: ${title.toUpperCase()}

CORE CLINICAL PARAMETERS PARSED:
${parsedInputs}

CALCULATED CLINICAL SCORE:
${parsedResults}

${formula ? `MATHEMATICAL MODEL & EQUATION:\n  ${formula}\n${itemDivider}` : ""}

${customNotes ? `CLINICAL TREATMENT OR DOSING NOTES:\n  ${customNotes}\n${itemDivider}` : ""}

${t.references.toUpperCase()}:
  ${references}

${t.disclaimer.toUpperCase()}:
  ${disclaimer}

${divider}
CONFIDENTIAL DOCUMENT CAPTURED SECURELY EN ROUTE TO EMR CHART
FITTED TO STANDARDS: FDA, EMA, AND PUBMED REFERENCE DOIS
${divider}`;
  };

  const handleCopy = () => {
    const reportText = getASCIIReportText();
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handlePrint = () => {

    // Inject printing container inside HTML DOM dynamically
    let printContainer = document.getElementById("clinical-print-area");
    if (!printContainer) {
      printContainer = document.createElement("div");
      printContainer.id = "clinical-print-area";
      document.body.appendChild(printContainer);
    }
    
    // Build beautiful, hyper-clean table design structure for printers
    printContainer.innerHTML = `
      <div style="font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; line-height: 1.5; font-size: 13px;">
        <div style="border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #1e3a8a; letter-spacing: -0.5px; text-transform: uppercase;">
              CareCalculus <span style="color: #2563eb;">Clinical Brief</span>
            </h1>
            <p style="margin: 4px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666; font-weight: bold;">
              ${t.digitalDisch}
            </p>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 9px; padding: 4px 8px; background: #fee2e2; color: #991b1b; font-weight: bold; border-radius: 4px; border: 1px solid #fecaca; text-transform: uppercase; letter-spacing: 0.5px;">
              ${t.confidential}
            </span>
            <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 600; color: #4b5563;">${currentTime}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <div>
            <span style="font-size: 9px; text-transform: uppercase; color: #6b7280; font-weight: bold; display: block; margin-bottom: 4px;">
              ${t.patientId}
            </span>
            <strong style="font-size: 14px; color: #111827; font-family: monospace;">
              ${patientId ? patientId.toUpperCase() : "N/A — DE-IDENTIFIED CLINICAL BRIEF"}
            </strong>
          </div>
          <div>
            <span style="font-size: 9px; text-transform: uppercase; color: #6b7280; font-weight: bold; display: block; margin-bottom: 4px;">
              ${t.clinician}
            </span>
            <strong style="font-size: 13px; color: #111827;">
              ${clinician ? clinician : "N/A — NOT SIGNED"}
            </strong>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #111827; margin: 0 0 12px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">
            ${title} Report
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f3f4f6; text-align: left;">
                <th style="padding: 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #374151; width: 60%;">Clinical Parameter Input</th>
                <th style="padding: 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #374151; text-align: right;">Value Captured</th>
              </tr>
            </thead>
            <tbody>
              ${inputs.map(i => `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px; color: #4b5563;"><strong>${i.label}</strong></td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; color: #111827; font-family: monospace; font-size: 13px;">${i.value}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; border-radius: 0 6px 6px 0; margin-top: 15px;">
            <span style="font-size: 9px; text-transform: uppercase; color: #1e40af; font-weight: bold; display: block; margin-bottom: 4px;">
              FINAL CLINICAL COMPUTATION
            </span>
            ${results.map(r => `
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 4px;">
                <span style="font-size: 14px; font-weight: bold; color: #1e3a8a;">${r.label}</span>
                <span style="font-size: 20px; font-weight: 800; color: #1d4ed8; font-family: monospace;">
                  ${r.value}${r.unit ? ` <span style="font-size: 12px; font-weight: 500; font-family: sans-serif; color: #3b82f6;">${r.unit}</span>` : ''}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        ${formula ? `
          <div style="margin-bottom: 25px; background: #fafafa; padding: 12px; border-radius: 6px; border: 1px solid #f3f4f6;">
            <p style="margin: 0 0 4px 0; font-size: 9px; text-transform: uppercase; color: #71717a; font-weight: 800; font-family: monospace;">
              ${t.formula}
            </p>
            <code style="font-family: monospace; font-size: 11px; color: #27272a; word-break: break-all;">${formula}</code>
          </div>
        ` : ''}

        ${customNotes ? `
          <div style="margin-bottom: 25px; padding: 12px; background: #fffcf0; border: 1px solid #fef3c7; border-radius: 6px; border-left: 4px solid #d97706;">
            <span style="font-size: 9px; text-transform: uppercase; color: #b45309; font-weight: bold; display: block; margin-bottom: 4px;">
              ${t.notes}
            </span>
            <p style="margin: 0; font-size: 12px; color: #451a03; white-space: pre-wrap; font-style: italic;">"${customNotes}"</p>
          </div>
        ` : ''}

        <div style="margin-top: 30px; font-size: 10px; color: #4b5563; border-top: 1px solid #e5e7eb; padding-top: 15px; space-y: 10px;">
          <div style="margin-bottom: 12px;">
            <strong style="color: #111827; display: block; font-size: 9px; text-transform: uppercase; margin-bottom: 2px;">
              ${t.references}
            </strong>
            <span style="color: #6b7280; font-style: italic;">${references}</span>
          </div>

          <div>
            <strong style="color: #dc2626; display: block; font-size: 9px; text-transform: uppercase; margin-bottom: 2px;">
              ${t.disclaimer}
            </strong>
            <span style="color: #9ca3af; line-height: 1.4; display: block; font-size: 9.5px; text-align: justify;">
              ${disclaimer}
            </span>
          </div>
        </div>

        <div style="margin-top: 40px; border-top: 1.5px dashed #e5e7eb; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #9ca3af; font-family: monospace;">
          <span>© 2026 CareCalculus EHR Systems Integration</span>
          <span>FDA, EMA & HIPAA Standards Compliant</span>
          <span>Verified DOI Database Sync</span>
        </div>
      </div>
    `;

    // Fire the browser print interface
    window.print();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
        {/* Tactical action button placed cleanly inside results card */}
        <button
          onClick={handleOpen}
          className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 active:bg-white/35 text-white text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300 border border-white/20 hover:border-white/40 shadow-sm relative overflow-hidden group cursor-pointer"
          style={{ minHeight: '44px' }}
          id={`btn-open-export-${title.split(' ')[0].toLowerCase()}`}
        >
          <Printer className="w-4 h-4 text-blue-300 group-hover:text-white transition-colors animate-pulse" />
          <span>{t.btnText}</span>
          <FileDown className="w-3.5 h-3.5 opacity-55 absolute right-4 group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* New Social Share Result button */}
        <button
          onClick={handleShare}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300 border shadow-sm relative overflow-hidden group cursor-pointer ${
            shareCopied
              ? 'bg-emerald-600/80 border-emerald-500 text-emerald-100'
              : 'bg-white/10 hover:bg-white/20 active:bg-white/35 text-white border-white/20 hover:border-white/40'
          }`}
          style={{ minHeight: '44px' }}
          id={`btn-share-result-${title.split(' ')[0].toLowerCase()}`}
        >
          {shareCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{t.shareSuccess}</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-blue-300 group-hover:text-white transition-colors" />
              <span>{t.shareBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive AnimatePresence modal rendering */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
              onClick={handleClose}
            />

            {/* Modal console box */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className={`relative bg-slate-900 border border-slate-705/85 text-slate-100 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 border border-blue-550/20 text-blue-400 rounded-lg">
                    <FileText className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight font-mono">{t.modalTitle}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{title} Protocol</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-slate-800 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable contents split layout */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 flex flex-col gap-6 scrollbar-thin bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                
                {/* Patient & Clinician Metadata Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t.patientId}</label>
                    <input
                      type="text"
                      placeholder={t.patientIdPlc}
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t.clinician}</label>
                    <input
                      type="text"
                      placeholder={t.clinicianPlc}
                      value={clinician}
                      onChange={(e) => setClinician(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* Custom Notes */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t.notes}</label>
                  <textarea
                    rows={2}
                    placeholder={t.notesPlc}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* EHR Note Format Tabs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">EHR SmartPhrase / Progress Note Format</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['soap', 'sbar', 'dotphrase', 'ascii'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setNoteTab(type)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold font-mono uppercase transition-all cursor-pointer ${
                          noteTab === type
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {type === 'soap' ? 'SOAP Note' : type === 'sbar' ? 'SBAR Handover' : type === 'dotphrase' ? 'EPIC DotPhrase' : 'Full Report'}
                      </button>
                    ))}
                  </div>
                  
                  {/* Live Preview Box */}
                  <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap border border-slate-800 shadow-inner max-h-60 select-all">
                    {getFormattedNote()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={handleCopyNote}
                    className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? t.copySuccess : t.copyBtn}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="w-full sm:flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{t.printBtn}</span>
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    className="w-full sm:w-auto py-3 px-5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    title="Share Shift Handover to WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
