import React, { ErrorInfo } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export class GlobalErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    const errStr = error?.toString() || error?.message || '';
    if (
      errStr.includes('Failed to fetch dynamically imported module') || 
      errStr.includes('Loading chunk') ||
      errStr.includes('MIME type') ||
      errStr.includes('Importing a module script failed')
    ) {
      const lastReload = Number(sessionStorage.getItem('cc_chunk_reload_time') || 0);
      const now = Date.now();
      if (now - lastReload > 10000) {
        sessionStorage.setItem('cc_chunk_reload_time', String(now));
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
          <div className="w-full max-w-full max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-3">Application Error</h1>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              CareCalculus encountered an unexpected clinical application error. Our engineers have been notified. Please refresh the page to restore the session.
            </p>
            <button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(regs => {
                    for (const r of regs) r.unregister();
                  });
                }
                if ('caches' in window) {
                  caches.keys().then(keys => {
                    for (const k of keys) caches.delete(k);
                  });
                }
                window.location.reload();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Application & Flush Cache
            </button>
            
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-slate-400 cursor-pointer font-mono hover:text-slate-600">View Diagnostic Details</summary>
                <div className="mt-2 bg-slate-900 rounded-xl p-4 overflow-auto max-h-48 text-[11px] font-mono text-emerald-400">
                  <div className="font-bold text-rose-400 mb-1">{this.state.error?.toString()}</div>
                  {this.state.error?.stack}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

