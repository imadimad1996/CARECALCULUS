import React, { useState } from 'react';
import { GitFork, ArrowRight, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';

export interface DecisionNode {
  id: string;
  question: string;
  options: Array<{
    label: string;
    nextNodeId?: string;
    outcome?: {
      title: string;
      description: string;
      level: 'low' | 'moderate' | 'high';
    };
  }>;
}

export interface ClinicalDecisionTreeProps {
  title: string;
  subtitle?: string;
  nodes: Record<string, DecisionNode>;
  initialNodeId: string;
}

export const ClinicalDecisionTree: React.FC<ClinicalDecisionTreeProps> = ({
  title,
  subtitle,
  nodes,
  initialNodeId,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(initialNodeId);
  const [history, setHistory] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<{ title: string; description: string; level: 'low' | 'moderate' | 'high' } | null>(null);

  const currentNode = nodes[currentNodeId];

  const handleSelectOption = (option: typeof currentNode.options[0]) => {
    if (option.outcome) {
      setOutcome(option.outcome);
    } else if (option.nextNodeId) {
      setHistory([...history, currentNodeId]);
      setCurrentNodeId(option.nextNodeId);
    }
  };

  const handleReset = () => {
    setCurrentNodeId(initialNodeId);
    setHistory([]);
    setOutcome(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl max-w-2xl mx-auto my-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
        </div>
        <button
          onClick={handleReset}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Body */}
      <div className="py-6">
        {outcome ? (
          <div className={`p-6 rounded-2xl border ${outcome.level === 'high' ? 'bg-red-950/40 border-red-500/30 text-red-200' : outcome.level === 'moderate' ? 'bg-amber-950/40 border-amber-500/30 text-amber-200' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              {outcome.level === 'high' ? (
                <AlertTriangle className="w-6 h-6 text-red-400" />
              ) : (
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              )}
              <h4 className="font-bold text-lg">{outcome.title}</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">{outcome.description}</p>
          </div>
        ) : currentNode ? (
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Step {history.length + 1}
            </span>
            <h4 className="text-xl font-bold text-slate-100">{currentNode.question}</h4>

            <div className="grid grid-cols-1 gap-3 pt-4">
              {currentNode.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-cyan-500/50 transition-all flex items-center justify-between text-sm font-semibold text-slate-200 group cursor-pointer"
                >
                  <span>{opt.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
