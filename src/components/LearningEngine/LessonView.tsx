import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Bookmark, 
  Clock, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen, 
  Terminal, 
  Check, 
  Save, 
  Maximize2, 
  Minimize2,
  Share2,
  FileText,
  Video,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { getLessonById, allSubjects } from '../../data/syllabus';
import { getResourcesForLesson, getResourcesBySubject } from '../../data/resources/resourceRegistry';
import { useProgress } from '../../context/ProgressContext';
import { LearningStatus } from '../../types';

interface LessonViewProps {
  lessonId: string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lessonId,
  onNavigate,
  isFocusMode,
  onToggleFocusMode
}) => {
  const { 
    progress, 
    updateStatus, 
    toggleMasterCheck, 
    updateNotes, 
    toggleBookmark 
  } = useProgress();

  const lessonData = getLessonById(lessonId);

  // Fallback if not found: default to OS Deadlocks (the flagship lesson)
  const activeData = lessonData || getLessonById('os-l1')!;
  const { lesson, topic, module, subject } = activeData;

  const currentProgress = progress[lesson.id] || {
    status: 'not-started',
    masterCheck: [false, false, false, false, false, false],
    notes: '',
    bookmarked: false
  };

  const [notesDraft, setNotesDraft] = useState(currentProgress.notes || '');
  const [activeTab, setActiveTab] = useState<'learn' | 'concept-map' | 'formulas' | 'examples' | 'mistakes' | 'resources' | 'mastery'>('learn');
  const [saveIndicator, setSaveIndicator] = useState(false);

  const lessonResources = useMemo(() => {
    const direct = getResourcesForLesson(lesson.id);
    if (direct.length > 0) return direct;
    return getResourcesBySubject(subject.code);
  }, [lesson.id, subject.code]);

  // Sync draft notes when lesson changes
  useEffect(() => {
    setNotesDraft(currentProgress.notes || '');
  }, [lesson.id, currentProgress.notes]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing when typing inside textarea or input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowLeft' && lesson.prevLessonId) {
        onNavigate('lesson', { lessonId: lesson.prevLessonId });
      } else if (e.key === 'ArrowRight' && lesson.nextLessonId) {
        onNavigate('lesson', { lessonId: lesson.nextLessonId });
      } else if (e.key.toLowerCase() === 'm') {
        const nextStatus: Record<LearningStatus, LearningStatus> = {
          'not-started': 'learning',
          'learning': 'practicing',
          'practicing': 'strong',
          'strong': 'mastered',
          'mastered': 'not-started'
        };
        updateStatus(lesson.id, nextStatus[currentProgress.status]);
      } else if (e.key.toLowerCase() === 'f') {
        onToggleFocusMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lesson.id, lesson.prevLessonId, lesson.nextLessonId, currentProgress.status]);

  const handleSaveNotes = () => {
    updateNotes(lesson.id, notesDraft);
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 2000);
  };

  // Find adjacent lessons in curriculum for Next/Prev
  const findAdjacentLessons = () => {
    const all = [];
    for (const s of allSubjects) {
      for (const m of s.modules) {
        for (const t of m.topics) {
          for (const l of t.lessons) {
            all.push(l);
          }
        }
      }
    }
    const idx = all.findIndex(l => l.id === lesson.id);
    return {
      prev: idx > 0 ? all[idx - 1] : null,
      next: idx < all.length - 1 ? all[idx + 1] : null,
      currentIndex: idx + 1,
      totalCount: all.length
    };
  };

  const adjacent = findAdjacentLessons();
  const checkedCount = currentProgress.masterCheck.filter(Boolean).length;

  return (
    <div className={`mx-auto transition-all ${isFocusMode ? 'max-w-4xl px-8 py-6' : 'max-w-5xl px-6 py-8'} space-y-8`}>
      {/* Top Breadcrumb & Status Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-gate-muted">
            <button 
              onClick={() => onNavigate('subject', { subjectId: subject.id })}
              className="hover:text-blue-400 transition-colors"
            >
              {subject.name}
            </button>
            <span>/</span>
            <span>Module {module.azLetter}: {module.name}</span>
            <span>/</span>
            <span className="text-gate-secondary">{topic.name}</span>
          </div>

          <div className="flex items-center space-x-3 pt-1">
            <h1 className="text-2xl font-bold font-mono text-gate-primary tracking-tight">
              {lesson.title}
            </h1>
            {lesson.official && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
                GATE 2027 Official
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto font-mono text-xs">
          {/* Status Dropdown / Cycle */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-dark-surface border border-dark-border">
            <span className="text-gate-muted text-[11px]">STATUS:</span>
            <select
              value={currentProgress.status}
              onChange={(e) => updateStatus(lesson.id, e.target.value as LearningStatus)}
              className="bg-transparent text-gate-primary font-medium outline-none cursor-pointer capitalize"
            >
              <option value="not-started" className="bg-dark-surface">○ Not Started</option>
              <option value="learning" className="bg-dark-surface">◐ Learning</option>
              <option value="practicing" className="bg-dark-surface">◑ Practicing</option>
              <option value="strong" className="bg-dark-surface">● Strong</option>
              <option value="mastered" className="bg-dark-surface">✓ Mastered</option>
            </select>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(lesson.id)}
            aria-label="Bookmark lesson"
            className={`p-1.5 rounded border transition-colors ${
              currentProgress.bookmarked
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-dark-surface hover:bg-dark-elevated text-gate-secondary border-dark-border'
            }`}
            title="Bookmark lesson"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Distraction-Free Mode Toggle */}
          <button
            onClick={onToggleFocusMode}
            aria-label={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
            className="p-1.5 rounded bg-dark-surface hover:bg-dark-elevated text-gate-secondary border border-dark-border transition-colors"
            title="Toggle Distraction-Free Focus Mode (F)"
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Layer Navigation Tabs (7 Layers of Deep Learning) */}
      <div className="flex items-center space-x-1 border-b border-dark-border overflow-x-auto select-none">
        {[
          { id: 'learn', label: '01 · Learn', count: null },
          { id: 'concept-map', label: '02 · Concept Map', count: null },
          { id: 'formulas', label: '03 · Formulas & Rules', count: lesson.formulasAndRules.length },
          { id: 'examples', label: '04 · Worked Examples', count: lesson.examples.length },
          { id: 'mistakes', label: '05 · Common Traps', count: lesson.commonMistakes.length },
          { id: 'resources', label: '06 · Resources', count: lessonResources.length },
          { id: 'mastery', label: '07 · Master Check', count: `${checkedCount}/6` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-mono whitespace-nowrap transition-colors border-b-2 -mb-px flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-gate-secondary hover:text-gate-primary hover:border-dark-borderActive'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className="text-[10px] px-1 py-0.2 rounded bg-dark-highlight text-gate-dim">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Panels */}
      <div className="space-y-8">
        {/* TAB 1: LEARN & EXPLANATION */}
        {activeTab === 'learn' && (
          <div className="space-y-8">
            {/* Overview & Objectives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-5 rounded bg-dark-surface border border-dark-border space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Why This Matters for GATE 2027</span>
                </div>
                <p className="text-xs text-gate-primary leading-relaxed">
                  {lesson.overview.whyItMatters}
                </p>
                <div className="pt-2 border-t border-dark-borderSubtle">
                  <div className="text-[10px] font-mono text-gate-muted uppercase mb-1.5">
                    What You Will Learn
                  </div>
                  <ul className="space-y-1 text-xs text-gate-secondary list-disc list-inside">
                    {lesson.overview.whatYouWillLearn.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Prerequisites Card */}
              <div className="p-5 rounded bg-dark-surface border border-dark-border space-y-3">
                <div className="text-xs font-mono text-gate-muted uppercase tracking-wider">
                  Prerequisites
                </div>
                <div className="space-y-1.5">
                  {lesson.overview.prerequisites.map((p, i) => (
                    <div key={i} className="text-xs text-gate-secondary flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-dark-borderActive" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-dark-borderSubtle text-[11px] font-mono text-gate-muted flex items-center justify-between">
                  <span>ESTIMATED TIME</span>
                  <span className="text-gate-primary font-medium">{lesson.durationMin} MINS</span>
                </div>
              </div>
            </div>

            {/* Deep Technical Explanation */}
            <div className="p-6 rounded bg-dark-surface border border-dark-border space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono text-gate-muted uppercase tracking-wider">
                  Formal Definition
                </div>
                <div className="p-3.5 rounded bg-dark-elevated border-l-2 border-blue-500 font-mono text-xs text-gate-primary leading-relaxed">
                  {lesson.explanation.definition}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono text-gate-muted uppercase tracking-wider">
                  The Intuition (Mental Model)
                </div>
                <p className="text-xs text-gate-secondary leading-relaxed font-sans">
                  {lesson.explanation.intuition}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono text-gate-muted uppercase tracking-wider">
                  Step-by-Step Technical Execution
                </div>
                <div className="space-y-2">
                  {lesson.explanation.howItWorks.map((step, idx) => (
                    <div key={idx} className="p-3 rounded bg-dark-elevated/40 border border-dark-borderSubtle text-xs text-gate-primary flex items-start space-x-3">
                      <span className="font-mono text-blue-400 font-semibold text-[11px]">{idx + 1}.</span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded bg-blue-600/10 border border-blue-500/20 space-y-1">
                <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold">
                  Key Takeaway
                </div>
                <div className="text-xs text-blue-200 font-medium">
                  {lesson.explanation.keyTakeaway}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONCEPT MAP */}
        {activeTab === 'concept-map' && (
          <div className="p-6 rounded bg-dark-surface border border-dark-border space-y-6">
            <div className="flex items-center justify-between border-b border-dark-borderSubtle pb-3">
              <div>
                <h3 className="text-sm font-mono font-semibold text-gate-primary">
                  {lesson.conceptMap?.title || 'Concept Architecture'}
                </h3>
                <p className="text-xs text-gate-secondary mt-0.5">
                  Structural dependencies and state transitions.
                </p>
              </div>
            </div>

            {lesson.conceptMap?.asciiDiagram && (
              <div className="p-5 rounded bg-dark-elevated border border-dark-border font-mono text-xs text-gate-primary overflow-x-auto whitespace-pre leading-normal">
                {lesson.conceptMap.asciiDiagram}
              </div>
            )}

            {lesson.conceptMap?.nodes && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {lesson.conceptMap.nodes.map(node => (
                  <div key={node.id} className="p-3 rounded bg-dark-elevated border border-dark-borderSubtle">
                    <div className="text-xs font-semibold text-gate-primary font-mono">
                      {node.label}
                    </div>
                    {node.sub && (
                      <div className="text-[11px] text-gate-secondary mt-1">
                        {node.sub}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FORMULAS & RULES */}
        {activeTab === 'formulas' && (
          <div className="space-y-4">
            {lesson.formulasAndRules.map((rule) => (
              <div key={rule.id} className="p-5 rounded bg-dark-surface border border-dark-border space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-semibold text-gate-primary">
                    {rule.name}
                  </h3>
                  {rule.condition && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-highlight text-gate-muted border border-dark-borderSubtle">
                      {rule.condition}
                    </span>
                  )}
                </div>

                {rule.formula && (
                  <div className="p-3.5 rounded bg-dark-elevated border border-dark-border font-mono text-xs text-blue-400 overflow-x-auto">
                    {rule.formula}
                  </div>
                )}

                <p className="text-xs text-gate-secondary leading-relaxed">
                  {rule.rule}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: WORKED EXAMPLES */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            {lesson.examples.map((ex, idx) => (
              <div key={idx} className="p-5 rounded bg-dark-surface border border-dark-border space-y-4">
                <div className="flex items-center space-x-2 border-b border-dark-borderSubtle pb-2.5">
                  <span className="font-mono text-xs text-blue-400 font-bold">EXAMPLE 0{idx + 1}</span>
                  <span className="text-gate-dim">•</span>
                  <span className="text-xs font-semibold text-gate-primary">{ex.title}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-gate-muted uppercase">Problem Statement</div>
                  <p className="text-xs text-gate-primary leading-relaxed bg-dark-elevated p-3 rounded border border-dark-borderSubtle">
                    {ex.problem}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-gate-muted uppercase">Step-by-Step Derivation</div>
                  <div className="space-y-1.5 pl-2 border-l-2 border-dark-border">
                    {ex.solutionSteps.map((step, sIdx) => (
                      <div key={sIdx} className="text-xs text-gate-secondary leading-relaxed">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded bg-dark-elevated/80 border border-dark-borderSubtle flex items-start space-x-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-300 font-medium">
                    {ex.keyInsight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: COMMON MISTAKES & TRAPS */}
        {activeTab === 'mistakes' && (
          <div className="space-y-4">
            {lesson.commonMistakes.map((m, idx) => (
              <div key={idx} className="p-5 rounded bg-dark-surface border border-dark-border space-y-3">
                <div className="flex items-center space-x-2 text-red-400 font-mono text-xs font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>TRAP 0{idx + 1}: {m.pitfall}</span>
                </div>

                <div className="text-xs text-gate-secondary leading-relaxed">
                  <strong className="text-gate-primary">Why it happens:</strong> {m.whyItHappens}
                </div>

                <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <strong className="font-semibold">The Rigorous Correction:</strong> {m.correction}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: VERIFIED EXTERNAL RESOURCES */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="p-4 rounded bg-dark-surface border border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold font-mono text-gate-primary flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>Curated Resources for {lesson.title}</span>
                </h3>
                <p className="text-xs text-gate-secondary mt-0.5">
                  Hand-verified video lectures, detailed university notes, and standard textbook chapters.
                </p>
              </div>
              <button
                onClick={() => onNavigate('resources')}
                className="px-3 py-1.5 rounded bg-dark-highlight hover:bg-dark-elevated text-blue-400 border border-dark-border text-xs font-mono whitespace-nowrap transition-colors"
              >
                View Full Library →
              </button>
            </div>

            {lessonResources.length === 0 ? (
              <div className="p-8 text-center rounded bg-dark-surface border border-dark-border space-y-2">
                <BookOpen className="w-6 h-6 text-gate-dim mx-auto" />
                <div className="text-xs text-gate-primary font-medium">Official Syllabus Lesson</div>
                <p className="text-xs text-gate-secondary">
                  Refer to the recommended textbooks in the Resources directory for this foundational topic.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessonResources.map(res => (
                  <div
                    key={res.id}
                    className="p-4 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive flex flex-col justify-between transition-colors space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border flex items-center space-x-1 ${
                          res.type === 'youtube'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : res.type === 'notes'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {res.type === 'youtube' ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                          <span className="capitalize">{res.type}</span>
                        </span>

                        {res.verified && (
                          <span className="flex items-center space-x-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-gate-primary">
                          {res.title}
                        </h4>
                        <div className="text-[11px] font-mono text-gate-secondary mt-0.5">
                          Provider: <strong className="text-gate-primary font-normal">{res.provider}</strong>
                          {res.duration && ` • ${res.duration}`}
                        </div>
                      </div>

                      <p className="text-xs text-gate-secondary line-clamp-2">
                        {res.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-dark-borderSubtle flex justify-end">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-mono flex items-center space-x-1.5 transition-colors"
                      >
                        <span>Open Resource</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: MASTER CHECK */}
        {activeTab === 'mastery' && (
          <div className="p-6 rounded bg-dark-surface border border-dark-border space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-semibold text-gate-primary">
                  Master Check Verification
                </h3>
                <span className="text-xs font-mono text-blue-400">
                  {checkedCount} / 6 Criteria Verified
                </span>
              </div>
              <p className="text-xs text-gate-secondary mt-1">
                Never mark a topic complete with a single superficial click. Verify all 6 cognitive milestones before advancing.
              </p>
            </div>

            <div className="space-y-3">
              {lesson.masterCheckCriteria.map((criterion, idx) => {
                const isChecked = currentProgress.masterCheck[idx] ?? false;
                return (
                  <div
                    key={idx}
                    onClick={() => toggleMasterCheck(lesson.id, idx)}
                    className={`p-3.5 rounded border flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        : 'bg-dark-elevated border-dark-border text-gate-secondary hover:border-dark-borderActive hover:text-gate-primary'
                    }`}
                  >
                    <div className="flex items-center space-x-3 text-xs">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-dark-borderActive'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{criterion}</span>
                    </div>

                    <span className="font-mono text-[10px] text-gate-muted uppercase">
                      {isChecked ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded bg-dark-elevated border border-dark-borderSubtle flex items-center justify-between text-xs">
              <div>
                <span className="text-gate-muted font-mono">AUTOMATIC STATUS:</span>{' '}
                <span className="font-semibold text-gate-primary font-mono capitalize">
                  {currentProgress.status.replace('-', ' ')}
                </span>
              </div>
              <div className="text-[11px] text-gate-muted">
                (6/6 checks automatically upgrades status to Mastered)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* In-Lesson Personal Scratchpad Notes */}
      <div className="p-5 rounded bg-dark-surface border border-dark-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-gate-primary">
              Personal Lesson Notes & Edge Cases
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            {saveIndicator && (
              <span className="text-[10px] font-mono text-emerald-400">Saved to storage!</span>
            )}
            <button
              onClick={handleSaveNotes}
              className="px-2.5 py-1 rounded bg-dark-elevated hover:bg-dark-highlight text-xs font-mono text-gate-primary border border-dark-borderSubtle transition-colors flex items-center space-x-1"
            >
              <Save className="w-3 h-3" />
              <span>Save Notes</span>
            </button>
          </div>
        </div>

        <textarea
          rows={4}
          value={notesDraft}
          onChange={(e) => setNotesDraft(e.target.value)}
          placeholder="Write your personal reminders, formulas, or tricky insights for this lesson..."
          className="w-full bg-dark-elevated border border-dark-borderSubtle focus:border-blue-500/50 rounded p-3 text-xs font-mono text-gate-primary placeholder:text-gate-muted outline-none resize-y"
        />
      </div>

      {/* Bottom Prev/Next Continuous Navigation */}
      {(() => {
        const prevLesson = adjacent.prev;
        const nextLesson = adjacent.next;
        return (
          <div className="flex items-center justify-between border-t border-dark-border pt-6 select-none font-mono text-xs">
            {prevLesson ? (
              <button
                onClick={() => onNavigate('lesson', { lessonId: prevLesson.id })}
                className="px-4 py-2 rounded bg-dark-surface hover:bg-dark-elevated border border-dark-border text-gate-secondary hover:text-gate-primary flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <div className="text-left">
                  <div className="text-[10px] text-gate-muted">PREVIOUS</div>
                  <div className="truncate max-w-[180px] text-gate-primary">{prevLesson.title}</div>
                </div>
              </button>
            ) : (
              <div />
            )}

            <div className="text-gate-muted text-[11px] hidden sm:block">
              Lesson {adjacent.currentIndex} of {adjacent.totalCount}
            </div>

            {nextLesson ? (
              <button
                onClick={() => onNavigate('lesson', { lessonId: nextLesson.id })}
                className="px-4 py-2 rounded bg-dark-surface hover:bg-dark-elevated border border-dark-border text-gate-secondary hover:text-gate-primary flex items-center space-x-2 transition-colors"
              >
                <div className="text-right">
                  <div className="text-[10px] text-gate-muted">NEXT</div>
                  <div className="truncate max-w-[180px] text-gate-primary">{nextLesson.title}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('az-sheet')}
                className="px-4 py-2 rounded bg-dark-surface hover:bg-dark-elevated border border-dark-border text-gate-primary flex items-center space-x-2 transition-colors"
              >
                <span>Back to A-Z Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })()}
    </div>
  );
};
