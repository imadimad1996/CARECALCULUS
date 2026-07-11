import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { FileDown, UploadCloud, Scissors, AlertCircle, FileText } from 'lucide-react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';

export default function PdfSplitter({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const isRtl = false;
  
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setPageCount(pdfDoc.getPageCount());
      } catch (err) {
        setError(lang === 'fr' ? 'Impossible de lire ce PDF.' : false ? 'تعذر قراءة ملف PDF.' : 'Failed to read this PDF.');
        setFile(null);
      }
    } else {
      setError(lang === 'fr' ? 'Veuillez sélectionner un fichier PDF valide.' : false ? 'الرجاء تحديد ملف PDF صالح.' : 'Please select a valid PDF file.');
    }
  }, [lang]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const parseRange = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(',').map(s => s.trim());
    
    for (const part of parts) {
      if (!part) continue;
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= maxPages) {
          for (let i = start; i <= end; i++) {
            pages.add(i - 1); // 0-indexed for pdf-lib
          }
        }
      } else {
        const pageNum = parseInt(part, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
          pages.add(pageNum - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || !rangeInput) return;
    setIsProcessing(true);
    setError(null);

    try {
      const pageIndices = parseRange(rangeInput, pageCount);
      if (pageIndices.length === 0) {
        throw new Error('Invalid page range');
      }

      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace('.pdf', '')}_extracted.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(lang === 'fr' ? 'Erreur lors de l\'extraction. Vérifiez la plage de pages.' : false ? 'خطأ أثناء الاستخراج. تحقق من نطاق الصفحات.' : 'Error during extraction. Check the page range.');
    } finally {
      setIsProcessing(false);
    }
  };

  const texts = {
    title: lang === 'fr' ? 'Diviser un PDF' : false ? 'تقسيم ملفات PDF' : 'Split PDF',
    subtitle: lang === 'fr' ? 'Extrayez des pages spécifiques de vos cours et manuels médicaux.' : false ? 'استخراج صفحات محددة من الدروس والمراجع الطبية.' : 'Extract specific pages from your medical courses and textbooks.',
    dropzone: lang === 'fr' ? 'Glissez-déposez un PDF ici, ou cliquez pour sélectionner' : false ? 'قم بإسقاط ملف PDF هنا، أو انقر للتحديد' : 'Drag & drop a PDF here, or click to select',
    selected: lang === 'fr' ? 'Fichier sélectionné:' : false ? 'الملف المحدد:' : 'Selected file:',
    pages: lang === 'fr' ? 'pages' : false ? 'صفحة' : 'pages',
    rangeLabel: lang === 'fr' ? 'Pages à extraire (ex: 1-5, 8, 11-13)' : false ? 'الصفحات المراد استخراجها (مثال: 1-5, 8, 11-13)' : 'Pages to extract (e.g., 1-5, 8, 11-13)',
    extractBtn: lang === 'fr' ? 'Extraire le PDF' : false ? 'استخراج PDF' : 'Extract PDF',
    processing: lang === 'fr' ? 'Traitement en cours...' : false ? 'جاري المعالجة...' : 'Processing...',
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">{texts.title}</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">{texts.subtitle}</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
        {!file ? (
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-80" />
            <p className="text-lg font-semibold text-gray-700">{texts.dropzone}</p>
            <p className="text-sm text-gray-400 mt-2">100% Client-Side. No data is sent to our servers.</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <FileText className="w-10 h-10 text-red-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{pageCount} {texts.pages}</p>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-sm text-gray-400 hover:text-red-500 font-medium px-3 py-1 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors"
              >
                Change
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{texts.rangeLabel}</label>
              <input 
                type="text" 
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="1-5, 8, 11-13"
                className={`w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-mono focus:outline-none focus:border-blue-500 transition-colors ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={handleSplit}
              disabled={isProcessing || !rangeInput}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/25"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {texts.processing}
                </span>
              ) : (
                <>
                  <Scissors className="w-5 h-5" />
                  {texts.extractBtn}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
