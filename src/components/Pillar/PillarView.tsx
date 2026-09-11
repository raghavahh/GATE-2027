import React from 'react';
import { PillarType } from '../../types';
import { getSubjectsByPillar } from '../../data/syllabus';
import { useProgress } from '../../context/ProgressContext';
import { ArrowLeft, ArrowRight, BookOpen, Sigma, FileText, Cpu } from 'lucide-react';

interface PillarViewProps {
  pillar: PillarType;
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const PillarView: React.FC<PillarViewProps> = ({ pillar, onNavigate }) => {
  const subjects = getSubjectsByPillar(pillar);
  const { stats } = useProgress();

  const title = pillar === 'GA' 
    ? 'General Aptitude' 
    : pillar === 'MATH' 
      ? 'Engineering Mathematics' 
      : 'Computer Science Core';

  const marks = pillar === 'GA' ? 15 : pillar === 'MATH' ? 13 : 72;
  const pStat = stats.pillarStats[pillar];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-mono text-gate-muted hover:text-blue-400 flex items-center space-x-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-3">
            {pillar === 'GA' ? (
              <FileText className="w-6 h-6 text-yellow-500" />
            ) : pillar === 'MATH' ? (
              <Sigma className="w-6 h-6 text-cyan-400" />
            ) : (
              <Cpu className="w-6 h-6 text-blue-400" />
            )}
            <h1 className="text-2xl font-bold font-mono text-gate-primary tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-xs text-gate-secondary mt-1">
            Official GATE 2027 Weightage: <strong className="text-gate-primary">{marks} Marks</strong> ({marks}% of total exam score).
          </p>
        </div>

        {/* Big Progress Badge */}
        <div className="p-4 rounded bg-dark-surface border border-dark-border min-w-[200px] text-right font-mono">
          <div className="text-xs text-gate-muted uppercase">Pillar Completion</div>
          <div className="text-3xl font-bold text-gate-primary mt-1">
            {pStat.percent}%
          </div>
          <div className="text-[11px] text-gate-secondary mt-0.5">
            {pStat.completed} / {pStat.total} Lessons
          </div>
          <div className="w-full bg-dark-highlight h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pStat.percent}%` }} />
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gate-primary font-mono">
          Subjects in {title} ({subjects.length} Subjects)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map(sub => {
            const sStat = stats.subjectStats[sub.id] || { percent: 0, completed: 0, total: 0 };
            return (
              <div
                key={sub.id}
                onClick={() => onNavigate('subject', { subjectId: sub.id })}
                className="p-5 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive cursor-pointer transition-colors space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-highlight text-blue-400 border border-dark-borderSubtle">
                    {sub.code}
                  </span>
                  <span className="text-xs font-mono text-gate-secondary">
                    ~{sub.approxMarks} Marks
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gate-primary group-hover:text-blue-400 transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-gate-secondary mt-1 line-clamp-2">
                    {sub.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-dark-borderSubtle flex items-center justify-between text-xs font-mono">
                  <span className="text-gate-muted">{sStat.percent}% complete</span>
                  <span className="text-blue-400 flex items-center space-x-1">
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
