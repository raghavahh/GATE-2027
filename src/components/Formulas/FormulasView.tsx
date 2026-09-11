import React, { useState, useMemo } from 'react';
import { Terminal, Search, ExternalLink, ArrowRight, BookOpen } from 'lucide-react';
import { getAllFormulas } from '../../data/formulas';
import { FormulaRule } from '../../types';

interface FormulasViewProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const FormulasView: React.FC<FormulasViewProps> = ({ onNavigate }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const allFormulas = useMemo(() => getAllFormulas(), []);

  // Distinct subjects
  const subjectCodes = useMemo(() => {
    const set = new Set<string>();
    allFormulas.forEach(f => set.add(f.subjectCode));
    return ['ALL', ...Array.from(set).sort()];
  }, [allFormulas]);

  const filteredFormulas = useMemo(() => {
    return allFormulas.filter(f => {
      if (selectedSubject !== 'ALL' && f.subjectCode !== selectedSubject) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          f.name.toLowerCase().includes(q) ||
          f.rule.toLowerCase().includes(q) ||
          (f.formula && f.formula.toLowerCase().includes(q)) ||
          f.subjectCode.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allFormulas, selectedSubject, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-dark-border pb-6">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-pink-400" />
          <h1 className="text-xl font-bold font-mono text-gate-primary tracking-tight">
            GATE//27 FORMULA & RULE REPOSITORY
          </h1>
        </div>
        <p className="text-xs text-gate-secondary mt-1">
          Instant quick-reference library for mathematical formulas, hardware identities, bounds, and normal form rules.
          Each formula links directly back to its source lesson.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-dark-surface p-3 rounded border border-dark-border">
        {/* Subject Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {subjectCodes.slice(0, 8).map(code => (
            <button
              key={code}
              onClick={() => setSelectedSubject(code)}
              className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors ${
                selectedSubject === code
                  ? 'bg-dark-highlight text-gate-primary font-semibold border border-dark-border'
                  : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gate-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search formulas, EMAT, Master Theorem..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-elevated border border-dark-borderSubtle focus:border-blue-500/50 rounded pl-8 pr-3 py-1 text-xs text-gate-primary placeholder:text-gate-muted outline-none"
          />
        </div>
      </div>

      {/* Formula Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map(rule => (
          <div
            key={rule.id}
            className="p-5 rounded bg-dark-surface border border-dark-border flex flex-col justify-between space-y-4 hover:border-dark-borderActive transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-highlight text-blue-400 border border-dark-borderSubtle">
                  {rule.subjectCode}
                </span>
                {rule.condition && (
                  <span className="text-[10px] font-mono text-gate-muted">
                    {rule.condition}
                  </span>
                )}
              </div>

              <h3 className="text-xs font-semibold text-gate-primary font-mono">
                {rule.name}
              </h3>

              {rule.formula && (
                <div className="p-3 rounded bg-dark-elevated border border-dark-borderSubtle font-mono text-xs text-pink-400 overflow-x-auto whitespace-pre">
                  {rule.formula}
                </div>
              )}

              <p className="text-xs text-gate-secondary leading-relaxed">
                {rule.rule}
              </p>
            </div>

            {/* Jump to original lesson */}
            <div className="border-t border-dark-borderSubtle pt-3 flex items-center justify-between text-[11px] font-mono">
              <span className="text-gate-muted truncate max-w-[200px]">
                {rule.lessonTitle}
              </span>
              <button
                onClick={() => onNavigate('lesson', { lessonId: rule.lessonId })}
                className="text-blue-400 hover:underline flex items-center space-x-1 flex-shrink-0"
              >
                <span>Go to Lesson</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
