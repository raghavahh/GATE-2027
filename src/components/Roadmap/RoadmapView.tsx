import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Target
} from 'lucide-react';
import { roadmapPhases } from '../../data/roadmap/phases';
import { roadmapWeeks } from '../../data/roadmap/weeks';

interface RoadmapViewProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onNavigate }) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(0);
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true, 2: true });

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNum]: !prev[weekNum]
    }));
  };

  const selectedPhase = roadmapPhases.find(p => p.id === selectedPhaseId) || roadmapPhases[0];
  const phaseWeeks = roadmapWeeks.filter(w => w.phaseId === selectedPhaseId);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-dark-border pb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl font-bold font-mono text-gate-primary tracking-tight">
            GATE 2027 STRATEGIC ROADMAP
          </h1>
        </div>
        <p className="text-xs text-gate-secondary mt-1">
          Complete 21-week trajectory from September 9, 2026 to January 31, 2027.
          Organized systematically into 7 strategic phases.
        </p>
      </div>

      {/* Phase Selector Timeline Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {roadmapPhases.map(phase => {
          const isSelected = phase.id === selectedPhaseId;
          return (
            <button
              key={phase.id}
              onClick={() => setSelectedPhaseId(phase.id)}
              className={`p-3 rounded text-left border transition-all ${
                isSelected
                  ? 'bg-dark-highlight border-blue-500/60 shadow-sm'
                  : 'bg-dark-surface border-dark-border hover:border-dark-borderActive hover:bg-dark-elevated'
              }`}
            >
              <div className="text-[10px] font-mono text-gate-muted flex items-center justify-between">
                <span>{phase.code}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </div>
              <div className="text-xs font-semibold text-gate-primary mt-1 line-clamp-1">
                {phase.name}
              </div>
              <div className="text-[10px] text-gate-secondary font-mono mt-1">
                {phase.dates.split('–')[0].trim()}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Details Card */}
      <div className="p-5 rounded bg-dark-surface border border-dark-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-borderSubtle pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {selectedPhase.code}
              </span>
              <h2 className="text-base font-bold text-gate-primary">
                {selectedPhase.name}
              </h2>
            </div>
            <div className="text-xs font-mono text-gate-secondary mt-1">
              Dates: {selectedPhase.dates}
            </div>
          </div>

          <div className="text-xs font-mono text-gate-muted">
            Weeks in Phase: {phaseWeeks.length} ({phaseWeeks.map(w => `W${w.weekNum}`).join(', ')})
          </div>
        </div>

        {/* Phase Focus Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5 p-3 rounded bg-dark-elevated border border-dark-borderSubtle">
            <div className="font-mono text-[11px] text-gate-muted uppercase">Primary Subjects</div>
            <div className="font-medium text-gate-primary flex flex-wrap gap-1.5">
              {selectedPhase.primarySubjects.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-dark-highlight border border-dark-border">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 p-3 rounded bg-dark-elevated border border-dark-borderSubtle">
            <div className="font-mono text-[11px] text-gate-muted uppercase">Secondary & Support</div>
            <div className="font-medium text-gate-secondary flex flex-wrap gap-1.5">
              {selectedPhase.secondarySubjects.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-dark-highlight border border-dark-border">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Goals Checklist */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-mono text-gate-muted uppercase">Strategic Phase Goals</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {selectedPhase.goals.map((goal, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-gate-primary">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Week-by-Week Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gate-primary font-mono">
            Detailed Weekly Breakdown ({phaseWeeks.length} Weeks)
          </h2>
        </div>

        <div className="space-y-3">
          {phaseWeeks.map(week => {
            const isExpanded = expandedWeeks[week.weekNum] ?? false;

            return (
              <div
                key={week.weekNum}
                className="bg-dark-surface border border-dark-border rounded overflow-hidden"
              >
                {/* Week Header */}
                <div
                  onClick={() => toggleWeek(week.weekNum)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-dark-elevated transition-colors select-none"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-gate-muted">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                          WEEK {week.weekNum < 10 ? `0${week.weekNum}` : week.weekNum}
                        </span>
                        <h3 className="text-xs font-semibold text-gate-primary">
                          {week.primarySubject}
                        </h3>
                      </div>
                      <div className="text-[11px] text-gate-secondary mt-0.5 font-mono">
                        {week.dates} • Est. {week.estimatedHours} hours
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono text-gate-muted">
                    <span className="hidden sm:inline">Secondary: {week.secondarySubject}</span>
                  </div>
                </div>

                {/* Week Expanded Content */}
                {isExpanded && (
                  <div className="p-4 border-t border-dark-border bg-dark-elevated/20 space-y-4 text-xs">
                    {/* Focus Points Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-2.5 rounded bg-dark-surface border border-dark-borderSubtle">
                        <div className="text-[10px] font-mono text-gate-muted uppercase">GA Focus</div>
                        <div className="font-medium text-gate-primary mt-1">{week.gaFocus}</div>
                      </div>
                      <div className="p-2.5 rounded bg-dark-surface border border-dark-borderSubtle">
                        <div className="text-[10px] font-mono text-gate-muted uppercase">Maths Focus</div>
                        <div className="font-medium text-gate-primary mt-1">{week.mathFocus}</div>
                      </div>
                      <div className="p-2.5 rounded bg-dark-surface border border-dark-borderSubtle md:col-span-2">
                        <div className="text-[10px] font-mono text-gate-muted uppercase">Weekly Milestone</div>
                        <div className="font-medium text-emerald-400 mt-1">{week.weeklyReviewMilestone}</div>
                      </div>
                    </div>

                    {/* Topics and Subtopics */}
                    <div className="p-3 rounded bg-dark-surface border border-dark-borderSubtle space-y-2">
                      <div className="text-[10px] font-mono text-gate-muted uppercase">Curriculum Topics</div>
                      <div className="flex flex-wrap gap-1.5">
                        {week.topics.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-dark-highlight text-gate-primary font-mono text-[11px] border border-dark-border">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="text-[11px] text-gate-secondary pt-1">
                        <strong>Subtopics:</strong> {week.subtopics.join(' • ')}
                      </div>
                    </div>

                    {/* Monday - Sunday Daily Learning Cadence */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono text-gate-muted uppercase">
                        Weekly Learning Rhythm (Mon–Sun Pattern)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 font-mono">
                        {week.dayPlan.map((day, dIdx) => (
                          <div key={dIdx} className="p-2 rounded bg-dark-surface border border-dark-borderSubtle space-y-1">
                            <div className="text-[10px] text-blue-400 font-semibold">{day.dayName}</div>
                            <div className="text-[10px] text-gate-secondary font-sans leading-tight">
                              {day.focus}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
