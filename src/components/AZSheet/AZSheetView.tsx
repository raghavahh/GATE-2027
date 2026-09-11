import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { allSubjects } from '../../data/syllabus';
import { useProgress } from '../../context/ProgressContext';
import { PillarType, LearningStatus, Lesson } from '../../types';

interface AZSheetViewProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const AZSheetView: React.FC<AZSheetViewProps> = ({ onNavigate }) => {
  const { progress, updateStatus, stats } = useProgress();
  const [selectedPillar, setSelectedPillar] = useState<PillarType | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<LearningStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    allSubjects.forEach((s, idx) => {
      init[s.id] = idx < 4; // expand first 4 subjects by default
    });
    return init;
  });

  const toggleSubject = (id: string) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    allSubjects.forEach(s => { next[s.id] = true; });
    setExpandedSubjects(next);
  };

  const collapseAll = () => {
    setExpandedSubjects({});
  };

  // Status cycle helper
  const nextStatusMap: Record<LearningStatus, LearningStatus> = {
    'not-started': 'learning',
    'learning': 'practicing',
    'practicing': 'strong',
    'strong': 'mastered',
    'mastered': 'not-started'
  };

  const handleCycleStatus = (e: React.MouseEvent, lessonId: string) => {
    e.stopPropagation();
    const currentStatus = progress[lessonId]?.status || 'not-started';
    const next = nextStatusMap[currentStatus];
    updateStatus(lessonId, next);
  };

  // Status icon component
  const renderStatusBadge = (status: LearningStatus, lessonId: string) => {
    switch (status) {
      case 'mastered':
        return (
          <button
            onClick={(e) => handleCycleStatus(e, lessonId)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
            title="Click to cycle status"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Mastered</span>
          </button>
        );
      case 'strong':
        return (
          <button
            onClick={(e) => handleCycleStatus(e, lessonId)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/25 transition-colors"
            title="Click to cycle status"
          >
            <span className="text-xs">●</span>
            <span>Strong</span>
          </button>
        );
      case 'practicing':
        return (
          <button
            onClick={(e) => handleCycleStatus(e, lessonId)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
            title="Click to cycle status"
          >
            <span className="text-xs">◑</span>
            <span>Practicing</span>
          </button>
        );
      case 'learning':
        return (
          <button
            onClick={(e) => handleCycleStatus(e, lessonId)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 transition-colors"
            title="Click to cycle status"
          >
            <span className="text-xs">◐</span>
            <span>Learning</span>
          </button>
        );
      default:
        return (
          <button
            onClick={(e) => handleCycleStatus(e, lessonId)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-dark-elevated text-gate-muted border border-dark-borderSubtle hover:text-gate-secondary hover:border-dark-border transition-colors"
            title="Click to cycle status"
          >
            <Circle className="w-2.5 h-2.5" />
            <span>Not Started</span>
          </button>
        );
    }
  };

  // Filtered dataset
  const filteredSubjects = useMemo(() => {
    return allSubjects.filter(sub => {
      if (selectedPillar !== 'ALL' && sub.pillar !== selectedPillar) return false;

      // Filter by search inside subject name, module, topic, or lesson
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSubject = sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q);
        const matchesLesson = sub.modules.some(m => 
          m.name.toLowerCase().includes(q) ||
          m.topics.some(t => 
            t.name.toLowerCase().includes(q) || 
            t.lessons.some(l => l.title.toLowerCase().includes(q))
          )
        );
        if (!matchesSubject && !matchesLesson) return false;
      }

      return true;
    });
  }, [selectedPillar, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold font-mono text-gate-primary tracking-tight">
              GATE//27 A-Z SHEET
            </h1>
            <span className="px-2 py-0.5 rounded bg-blue-600/20 border border-blue-500/30 text-blue-400 font-mono text-xs">
              Striver A2Z Philosophy
            </span>
          </div>
          <p className="text-xs text-gate-secondary mt-1 max-w-2xl">
            Complete, hierarchical curriculum organization for GATE 2027 Computer Science & Information Technology.
            Every topic maps strictly to the revised IIT Madras scope.
          </p>
        </div>

        {/* Global Progress pill */}
        <div className="flex items-center space-x-3 bg-dark-surface p-2.5 rounded border border-dark-border font-mono text-xs self-start sm:self-auto">
          <div className="text-gate-secondary">
            COMPLETION: <strong className="text-gate-primary">{stats.overallPercent}%</strong>
          </div>
          <div className="w-20 bg-dark-highlight h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${stats.overallPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-surface p-3 rounded border border-dark-border">
        {/* Pillar Tabs */}
        <div className="flex items-center space-x-1">
          {(['ALL', 'GA', 'MATH', 'CS'] as const).map(p => (
            <button
              key={p}
              onClick={() => setSelectedPillar(p)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                selectedPillar === p
                  ? 'bg-dark-highlight text-gate-primary font-semibold border border-dark-border'
                  : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
              }`}
            >
              {p === 'ALL' ? 'ALL SUBJECTS' : p === 'GA' ? 'GA (15M)' : p === 'MATH' ? 'MATHS (13M)' : 'CS (72M)'}
            </button>
          ))}
        </div>

        {/* Search input & Expand/Collapse */}
        <div className="flex items-center space-x-3 flex-1 sm:flex-initial justify-end">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-gate-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics, CIDR, deadlocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-elevated border border-dark-borderSubtle focus:border-blue-500/50 rounded pl-8 pr-3 py-1 text-xs text-gate-primary placeholder:text-gate-muted outline-none"
            />
          </div>

          <div className="flex items-center space-x-1 text-xs font-mono text-gate-secondary">
            <button
              onClick={expandAll}
              className="px-2 py-1 rounded hover:bg-dark-elevated hover:text-gate-primary transition-colors"
            >
              Expand
            </button>
            <span>/</span>
            <button
              onClick={collapseAll}
              className="px-2 py-1 rounded hover:bg-dark-elevated hover:text-gate-primary transition-colors"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Trees by Subject */}
      <div className="space-y-4">
        {filteredSubjects.map(subject => {
          const isExpanded = expandedSubjects[subject.id] ?? false;
          const sStat = stats.subjectStats[subject.id] || { percent: 0, completed: 0, total: 0 };

          return (
            <div
              key={subject.id}
              className="bg-dark-surface border border-dark-border rounded overflow-hidden"
            >
              {/* Subject Accordion Header */}
              <div
                onClick={() => toggleSubject(subject.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-dark-elevated/70 transition-colors select-none"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-gate-muted">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-dark-highlight text-blue-400 border border-dark-borderSubtle">
                        {subject.code}
                      </span>
                      <h2 className="text-sm font-semibold text-gate-primary">
                        {subject.name}
                      </h2>
                    </div>
                    <div className="text-[11px] text-gate-secondary mt-0.5">
                      {subject.officialSection} • ~{subject.approxMarks} Marks
                    </div>
                  </div>
                </div>

                {/* Right metrics */}
                <div className="flex items-center space-x-4">
                  <div className="text-right font-mono text-xs hidden sm:block">
                    <div className="text-gate-primary font-medium">{sStat.percent}% Complete</div>
                    <div className="text-[10px] text-gate-muted">{sStat.total} Lessons</div>
                  </div>
                  <div className="w-16 bg-dark-highlight h-1.5 rounded-full overflow-hidden hidden sm:block">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${sStat.percent}%` }} />
                  </div>
                </div>
              </div>

              {/* Subject Content: Modules & Topics */}
              {isExpanded && (
                <div className="border-t border-dark-border divide-y divide-dark-borderSubtle">
                  {subject.modules.map(module => (
                    <div key={module.id} className="p-4 bg-dark-elevated/20 space-y-3">
                      {/* Module A-Z Letter Header */}
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded bg-dark-highlight border border-dark-border flex items-center justify-center font-mono font-bold text-xs text-gate-primary">
                          {module.azLetter}
                        </span>
                        <div>
                          <h3 className="text-xs font-semibold text-gate-primary">
                            {module.name}
                          </h3>
                          <p className="text-[11px] text-gate-secondary">
                            {module.description}
                          </p>
                        </div>
                      </div>

                      {/* Topics & Lessons List */}
                      <div className="space-y-2 pl-8">
                        {module.topics.map(topic => (
                          <div key={topic.id} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-gate-secondary">
                              <div className="flex items-center space-x-2">
                                <span className="text-gate-primary font-medium">{topic.name}</span>
                                {topic.official && (
                                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Official 2027
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Lessons Rows */}
                            <div className="space-y-1 border-l-2 border-dark-border pl-3 mt-1">
                              {topic.lessons.map(lesson => {
                                const lp = progress[lesson.id] || {
                                  status: 'not-started',
                                  masterCheck: [false, false, false, false, false, false],
                                  notes: '',
                                  bookmarked: false
                                };
                                const checkedCount = lp.masterCheck.filter(Boolean).length;

                                return (
                                  <div
                                    key={lesson.id}
                                    onClick={() => onNavigate('lesson', { lessonId: lesson.id })}
                                    className="p-2.5 rounded bg-dark-surface hover:bg-dark-elevated border border-dark-borderSubtle hover:border-dark-border flex items-center justify-between cursor-pointer group transition-colors"
                                  >
                                    <div className="flex items-center space-x-3">
                                      {/* Status Toggle Badge */}
                                      {renderStatusBadge(lp.status, lesson.id)}

                                      <div>
                                        <div className="text-xs font-medium text-gate-primary group-hover:text-blue-400 transition-colors">
                                          {lesson.title}
                                        </div>
                                        <div className="text-[10px] text-gate-muted flex items-center space-x-2 mt-0.5">
                                          <span>{lesson.durationMin} mins</span>
                                          <span>•</span>
                                          <span>Master Check: {checkedCount}/6 verified</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action link */}
                                    <div className="flex items-center space-x-3 text-xs">
                                      <span className="text-blue-400 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                                        <span>Start Learning</span>
                                        <ArrowRight className="w-3 h-3" />
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
