import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { FileDown, UploadCloud, Layers, AlertCircle, FileText, X, GripVertical } from 'lucide-react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';

export default function PdfMerger({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const isRtl = false;
  
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validPdfs = acceptedFiles.filter(f => f.type === 'application/pdf');
    if (validPdfs.length > 0) {
      setFiles(prev => [...prev, ...validPdfs]);
      setError(null);
    } else {
      setError(lang === 'fr' ? 'Veuillez sélectionner uniquement des fichiers PDF.' : 'Please select PDF files only.');
    }
  }, [lang]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newFiles = [...files];
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
      setFiles(newFiles);
    } else if (direction === 'down' && index < files.length - 1) {
      const newFiles = [...files];
      [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
      setFiles(newFiles);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError(lang === 'fr' ? 'Sélectionnez au moins 2 fichiers.' : 'Select at least 2 files.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `carecalculus_merged.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(lang === 'fr' ? 'Erreur lors de la fusion. Certains fichiers pourraient être corrompus ou protégés.' : 'Error during merge. Some files might be corrupted or protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const texts = {
    title: lang === 'fr' ? 'Fusionner des PDF' : 'Merge PDF',
    subtitle: lang === 'fr' ? 'Combinez plusieurs documents médicaux en un seul PDF.' : 'Combine multiple medical documents into a single PDF.',
    dropzone: lang === 'fr' ? 'Glissez-déposez des PDF ici, ou cliquez pour sélectionner' : 'Drag & drop PDFs here, or click to select',
    mergeBtn: lang === 'fr' ? 'Fusionner les PDF' : 'Merge PDFs',
    processing: lang === 'fr' ? 'Traitement en cours...' : 'Processing...',
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">{texts.title}</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">{texts.subtitle}</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-2xl p-8 mb-8 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-12 h-12 text-purple-500 mx-auto mb-3 opacity-80" />
          <p className="font-semibold text-gray-700">{texts.dropzone}</p>
        </div>

        {files.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-bold text-gray-800 border-b pb-2">
              {lang === 'fr' ? 'Fichiers à fusionner' : 'Files to merge'} ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 group">
                  <div className="flex flex-col gap-1 px-2 cursor-ns-resize text-gray-300 hover:text-gray-500">
                    <button onClick={() => moveFile(index, 'up')} disabled={index === 0} className="disabled:opacity-30 hover:text-purple-600">▲</button>
                    <button onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} className="disabled:opacity-30 hover:text-purple-600">▼</button>
                  </div>
                  <FileText className="w-8 h-8 text-purple-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={handleMerge}
              disabled={isProcessing || files.length < 2}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-500/25 mt-8"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {texts.processing}
                </span>
              ) : (
                <>
                  <Layers className="w-5 h-5" />
                  {texts.mergeBtn}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
