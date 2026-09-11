import React from 'react';
import { Bookmark, ArrowRight, BookOpen, Trash2 } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { getLessonById } from '../../data/syllabus';

interface BookmarksViewProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({ onNavigate }) => {
  const { bookmarkedLessons, toggleBookmark, progress } = useProgress();

  const lessons = bookmarkedLessons
    .map(id => getLessonById(id))
    .filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="border-b border-dark-border pb-6">
        <div className="flex items-center space-x-2">
          <Bookmark className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl font-bold font-mono text-gate-primary tracking-tight">
            BOOKMARKED LESSONS FOR RAPID REVISION
          </h1>
        </div>
        <p className="text-xs text-gate-secondary mt-1">
          High-priority topics saved for rapid recall, formula retention, and pre-exam consolidation.
        </p>
      </div>

      {lessons.length === 0 ? (
        <div className="p-12 rounded bg-dark-surface border border-dark-border text-center space-y-3">
          <Bookmark className="w-8 h-8 text-gate-dim mx-auto" />
          <div className="text-sm font-semibold text-gate-primary">
            No lessons bookmarked yet
          </div>
          <p className="text-xs text-gate-secondary max-w-sm mx-auto">
            Click the bookmark icon in any lesson page to add key topics here for quick revision before test cycles.
          </p>
          <button
            onClick={() => onNavigate('az-sheet')}
            className="mt-2 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs transition-colors inline-flex items-center space-x-1.5"
          >
            <span>Explore A-Z Sheet</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map(item => {
            if (!item) return null;
            const { lesson, subject, topic } = item;
            const lp = progress[lesson.id];

            return (
              <div
                key={lesson.id}
                className="p-4 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive flex items-center justify-between transition-colors group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-gate-muted">
                    <span>{subject.name}</span>
                    <span>•</span>
                    <span>{topic.name}</span>
                  </div>
                  <h3 
                    onClick={() => onNavigate('lesson', { lessonId: lesson.id })}
                    className="text-xs font-semibold text-gate-primary group-hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    {lesson.title}
                  </h3>
                  {lp?.notes && (
                    <div className="text-[11px] font-mono text-gate-secondary line-clamp-1 italic">
                      "{lp.notes}"
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleBookmark(lesson.id)}
                    className="p-1.5 text-gate-muted hover:text-red-400 transition-colors"
                    title="Remove from bookmarks"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onNavigate('lesson', { lessonId: lesson.id })}
                    className="px-3 py-1.5 rounded bg-dark-elevated hover:bg-dark-highlight border border-dark-border text-xs font-mono text-gate-primary flex items-center space-x-1.5 transition-colors"
                  >
                    <span>Open Lesson</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
