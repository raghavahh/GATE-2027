import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BookOpen, 
  Terminal, 
  ArrowRight, 
  Video, 
  FileText, 
  ExternalLink 
} from 'lucide-react';
import { allSubjects } from '../../data/syllabus';
import { getAllFormulas } from '../../data/formulas';
import { getAllResources } from '../../data/resources/resourceRegistry';
import { useProgress } from '../../context/ProgressContext';
import { Resource, UserNote } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { progress, allNotes } = useProgress();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedLessons: Array<{
    lessonId: string;
    title: string;
    subjectName: string;
    topicName: string;
  }> = [];

  const matchedFormulas: Array<{
    id: string;
    name: string;
    formula?: string;
    lessonId: string;
    subjectCode: string;
  }> = [];

  const matchedResources: Resource[] = [];
  const matchedNotes: UserNote[] = [];

  if (q.length > 0) {
    // 1. Lessons & Topics
    allSubjects.forEach(s => {
      s.modules.forEach(m => {
        m.topics.forEach(t => {
          t.lessons.forEach(l => {
            if (
              l.title.toLowerCase().includes(q) ||
              t.name.toLowerCase().includes(q) ||
              m.name.toLowerCase().includes(q) ||
              s.name.toLowerCase().includes(q)
            ) {
              if (matchedLessons.length < 5) {
                matchedLessons.push({
                  lessonId: l.id,
                  title: l.title,
                  subjectName: s.name,
                  topicName: t.name
                });
              }
            }
          });
        });
      });
    });

    // 2. Formulas
    const allFormulas = getAllFormulas();
    allFormulas.forEach(f => {
      if (
        f.name.toLowerCase().includes(q) ||
        (f.formula && f.formula.toLowerCase().includes(q)) ||
        f.rule.toLowerCase().includes(q)
      ) {
        if (matchedFormulas.length < 3) {
          matchedFormulas.push({
            id: f.id,
            name: f.name,
            formula: f.formula,
            lessonId: f.lessonId,
            subjectCode: f.subjectCode
          });
        }
      }
    });

    // 3. Resources
    const allResources = getAllResources();
    allResources.forEach(res => {
      if (
        res.title.toLowerCase().includes(q) ||
        res.provider.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q)
      ) {
        if (matchedResources.length < 3) {
          matchedResources.push(res);
        }
      }
    });

    // 4. Personal Notes
    allNotes.forEach(note => {
      if (
        note.lessonTitle.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q)
      ) {
        if (matchedNotes.length < 2) {
          matchedNotes.push(note);
        }
      }
    });
  }

  const hasResults =
    matchedLessons.length > 0 ||
    matchedFormulas.length > 0 ||
    matchedResources.length > 0 ||
    matchedNotes.length > 0;

  const handleSelectLesson = (lessonId: string) => {
    onNavigate('lesson', { lessonId });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-dark-surface border border-dark-border rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-dark-border flex items-center space-x-3 bg-dark-surface">
          <Search className="w-4 h-4 text-gate-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, formulas, YouTube lectures, notes, CIDR, deadlocks..."
            className="w-full bg-transparent text-sm text-gate-primary placeholder:text-gate-muted outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-highlight border border-dark-border text-gate-muted">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {q.length === 0 ? (
            <div className="p-6 text-center text-xs text-gate-muted space-y-1 font-mono">
              <div>Type keywords like "deadlock", "paging", "CIDR", "normalization", "Bayes"...</div>
              <div className="text-[11px] text-gate-dim">Instant search across all 17 GATE 2027 curriculum subjects & resources</div>
            </div>
          ) : !hasResults ? (
            <div className="p-6 text-center text-xs text-gate-muted font-mono">
              No matching topics or resources found for "{query}".
            </div>
          ) : (
            <>
              {/* Lessons Results */}
              {matchedLessons.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 py-0.5 text-[10px] font-mono uppercase text-gate-muted">
                    Curriculum Lessons ({matchedLessons.length})
                  </div>
                  {matchedLessons.map(item => {
                    const status = progress[item.lessonId]?.status || 'not-started';
                    return (
                      <div
                        key={item.lessonId}
                        onClick={() => handleSelectLesson(item.lessonId)}
                        className="p-2.5 rounded hover:bg-dark-elevated cursor-pointer flex items-center justify-between group transition-colors border border-transparent hover:border-dark-border"
                      >
                        <div className="flex items-center space-x-2.5">
                          <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gate-primary group-hover:text-blue-400 transition-colors">
                              {item.title}
                            </div>
                            <div className="text-[10px] font-mono text-gate-muted">
                              {item.subjectName} • {item.topicName}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-xs font-mono">
                          <span className="text-[10px] text-gate-dim capitalize">
                            {status.replace('-', ' ')}
                          </span>
                          <ArrowRight className="w-3 h-3 text-gate-dim group-hover:text-blue-400 transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Formula Results */}
              {matchedFormulas.length > 0 && (
                <div className="space-y-1 border-t border-dark-borderSubtle pt-2">
                  <div className="px-2 py-0.5 text-[10px] font-mono uppercase text-gate-muted">
                    Formulas & Rules ({matchedFormulas.length})
                  </div>
                  {matchedFormulas.map(f => (
                    <div
                      key={f.id}
                      onClick={() => handleSelectLesson(f.lessonId)}
                      className="p-2.5 rounded hover:bg-dark-elevated cursor-pointer flex items-center justify-between group transition-colors border border-transparent hover:border-dark-border"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Terminal className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-medium text-gate-primary group-hover:text-pink-400 transition-colors">
                            {f.name}
                          </div>
                          {f.formula && (
                            <div className="text-[10px] font-mono text-pink-300 truncate max-w-sm">
                              {f.formula}
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-gate-muted">
                        {f.subjectCode}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Resource Results */}
              {matchedResources.length > 0 && (
                <div className="space-y-1 border-t border-dark-borderSubtle pt-2">
                  <div className="px-2 py-0.5 text-[10px] font-mono uppercase text-gate-muted">
                    Verified Learning Resources ({matchedResources.length})
                  </div>
                  {matchedResources.map(res => (
                    <div
                      key={res.id}
                      onClick={() => {
                        if (res.lessonId) handleSelectLesson(res.lessonId);
                        else {
                          window.open(res.url, '_blank');
                          onClose();
                        }
                      }}
                      className="p-2.5 rounded hover:bg-dark-elevated cursor-pointer flex items-center justify-between group transition-colors border border-transparent hover:border-dark-border"
                    >
                      <div className="flex items-center space-x-2.5">
                        {res.type === 'youtube' ? (
                          <Video className="w-4 h-4 text-red-400 flex-shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                        <div>
                          <div className="text-xs font-medium text-gate-primary group-hover:text-blue-400 transition-colors">
                            {res.title}
                          </div>
                          <div className="text-[10px] font-mono text-gate-muted">
                            {res.provider} • {res.type}
                          </div>
                        </div>
                      </div>

                      <ExternalLink className="w-3.5 h-3.5 text-gate-dim group-hover:text-blue-400 transition-colors" />
                    </div>
                  ))}
                </div>
              )}

              {/* Notes Results */}
              {matchedNotes.length > 0 && (
                <div className="space-y-1 border-t border-dark-borderSubtle pt-2">
                  <div className="px-2 py-0.5 text-[10px] font-mono uppercase text-gate-muted">
                    My Personal Notes ({matchedNotes.length})
                  </div>
                  {matchedNotes.map(n => (
                    <div
                      key={n.lessonId}
                      onClick={() => handleSelectLesson(n.lessonId)}
                      className="p-2.5 rounded hover:bg-dark-elevated cursor-pointer flex items-center justify-between group transition-colors border border-transparent hover:border-dark-border"
                    >
                      <div className="flex items-center space-x-2.5">
                        <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-medium text-gate-primary group-hover:text-emerald-400 transition-colors">
                            Note for {n.lessonTitle}
                          </div>
                          <div className="text-[10px] text-gate-secondary line-clamp-1 max-w-sm">
                            {n.content}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-gate-muted">
                        {n.subjectCode}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
