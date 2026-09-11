import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Circle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { getSubjectById } from '../../data/syllabus';
import { useProgress } from '../../context/ProgressContext';
import { LearningStatus } from '../../types';

interface SubjectViewProps {
  subjectId: string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const SubjectView: React.FC<SubjectViewProps> = ({ subjectId, onNavigate }) => {
  const subject = getSubjectById(subjectId);
  const { stats, progress, updateStatus } = useProgress();

  if (!subject) {
    return (
      <div className="p-8 text-center text-gate-muted font-mono text-sm">
        Subject not found.
      </div>
    );
  }

  const sStat = stats.subjectStats[subject.id] || { percent: 0, completed: 0, total: 0 };

  // Collect all lessons in this subject
  const subjectLessons = subject.modules.flatMap(m => m.topics.flatMap(t => t.lessons));
  const completedLessons = subjectLessons.filter(l => {
    const s = progress[l.id]?.status;
    return s === 'mastered' || s === 'strong';
  });
  const inProgressLesson = subjectLessons.find(l => {
    const s = progress[l.id]?.status;
    return s === 'learning' || s === 'practicing';
  }) || subjectLessons[0];

  const nextLesson = subjectLessons.find(l => {
    const s = progress[l.id]?.status || 'not-started';
    return s === 'not-started';
  }) || subjectLessons[subjectLessons.length - 1];

  const remainingHours = Math.round(
    (subjectLessons.length - completedLessons.length) * 0.8
  );

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
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              {subject.code}
            </span>
            <h1 className="text-2xl font-bold font-mono text-gate-primary tracking-tight">
              {subject.name}
            </h1>
          </div>
          <p className="text-xs text-gate-secondary mt-1 max-w-xl">
            {subject.description}
          </p>
        </div>

        {/* Big Completion Gauge */}
        <div className="p-4 rounded bg-dark-surface border border-dark-border min-w-[200px] text-right font-mono">
          <div className="text-xs text-gate-muted uppercase">Subject Completion</div>
          <div className="text-3xl font-bold text-gate-primary mt-1">
            {sStat.percent}%
          </div>
          <div className="w-full bg-dark-highlight h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${sStat.percent}%` }} />
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded bg-dark-surface border border-dark-border">
          <div className="text-gate-muted text-[11px] uppercase">Official Section</div>
          <div className="text-gate-primary font-semibold mt-1 truncate">{subject.officialSection}</div>
        </div>
        <div className="p-3.5 rounded bg-dark-surface border border-dark-border">
          <div className="text-gate-muted text-[11px] uppercase">Exam Weightage</div>
          <div className="text-gate-primary font-semibold mt-1">~{subject.approxMarks} Marks</div>
        </div>
        <div className="p-3.5 rounded bg-dark-surface border border-dark-border">
          <div className="text-gate-muted text-[11px] uppercase">Modules Progress</div>
          <div className="text-gate-primary font-semibold mt-1">
            {subject.modules.length} Modules Total
          </div>
        </div>
        <div className="p-3.5 rounded bg-dark-surface border border-dark-border">
          <div className="text-gate-muted text-[11px] uppercase">Estimated Hours Left</div>
          <div className="text-amber-400 font-semibold mt-1">{remainingHours} Hours</div>
        </div>
      </div>

      {/* Current & Next Quick Jump */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => inProgressLesson && onNavigate('lesson', { lessonId: inProgressLesson.id })}
          className="p-4 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive cursor-pointer transition-colors group"
        >
          <div className="text-[10px] font-mono text-blue-400 uppercase">Current Learning Focus</div>
          <div className="text-sm font-semibold text-gate-primary group-hover:text-blue-400 mt-1 transition-colors">
            {inProgressLesson?.title}
          </div>
          <div className="text-xs text-gate-muted mt-2 flex items-center space-x-1">
            <span>Resume Lesson</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div 
          onClick={() => nextLesson && onNavigate('lesson', { lessonId: nextLesson.id })}
          className="p-4 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive cursor-pointer transition-colors group"
        >
          <div className="text-[10px] font-mono text-emerald-400 uppercase">Up Next in Sequence</div>
          <div className="text-sm font-semibold text-gate-primary group-hover:text-emerald-400 mt-1 transition-colors">
            {nextLesson?.title}
          </div>
          <div className="text-xs text-gate-muted mt-2 flex items-center space-x-1">
            <span>Start Next Topic</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Modules & Lessons Hierarchy */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gate-primary font-mono">
          Structured Learning Modules
        </h2>

        <div className="space-y-4">
          {subject.modules.map(module => (
            <div key={module.id} className="p-5 rounded bg-dark-surface border border-dark-border space-y-4">
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded bg-dark-highlight border border-dark-border flex items-center justify-center font-mono font-bold text-xs text-gate-primary">
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

              <div className="space-y-2 pl-9">
                {module.topics.map(topic => (
                  <div key={topic.id} className="space-y-2">
                    <div className="text-xs font-medium text-gate-primary">
                      {topic.name}
                    </div>

                    <div className="space-y-1.5">
                      {topic.lessons.map(lesson => {
                        const lp = progress[lesson.id];
                        const status = lp?.status || 'not-started';

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => onNavigate('lesson', { lessonId: lesson.id })}
                            className="p-3 rounded bg-dark-elevated hover:bg-dark-highlight border border-dark-borderSubtle flex items-center justify-between cursor-pointer group transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <BookOpen className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                              <span className="text-xs text-gate-primary group-hover:text-blue-400 transition-colors">
                                {lesson.title}
                              </span>
                            </div>

                            <div className="flex items-center space-x-3 text-xs font-mono">
                              <span className="text-gate-muted">{lesson.durationMin}m</span>
                              <span className="capitalize text-[11px] text-gate-secondary px-2 py-0.5 rounded bg-dark-surface border border-dark-border">
                                {status.replace('-', ' ')}
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
      </div>
    </div>
  );
};
