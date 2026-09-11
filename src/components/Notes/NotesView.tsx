import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Trash2, 
  ArrowRight, 
  Clock, 
  Edit3, 
  Save
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { UserNote } from '../../types';

interface NotesViewProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onNavigate }) => {
  const { allNotes, saveNote, deleteNote } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  // Extract unique subjects that have notes
  const subjectsWithNotes = useMemo(() => {
    const map = new Map<string, string>();
    allNotes.forEach(n => {
      if (n.subjectCode) map.set(n.subjectCode, n.subjectName);
    });
    return Array.from(map.entries());
  }, [allNotes]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return allNotes.filter(note => {
      if (selectedSubject !== 'ALL' && note.subjectCode !== selectedSubject) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          note.lessonTitle.toLowerCase().includes(q) ||
          note.subjectName.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allNotes, selectedSubject, searchQuery]);

  const handleStartEdit = (note: UserNote) => {
    setEditingId(note.lessonId);
    setEditContent(note.content);
  };

  const handleSaveEdit = (lessonId: string) => {
    saveNote(lessonId, editContent);
    setEditingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-dark-border pb-6">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl font-bold font-mono text-gate-primary tracking-tight">
            MY GATE KNOWLEDGE BASE & NOTES
          </h1>
        </div>
        <p className="text-xs text-gate-secondary mt-1">
          Search, review, and edit your personal notes, conceptual breakthroughs, and formula mnemonics across every subject.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-dark-surface p-4 rounded border border-dark-border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gate-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes by keywords, theorems, formulas, or lesson title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded bg-dark-bg border border-dark-border text-xs text-gate-primary placeholder-gate-muted focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedSubject('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              selectedSubject === 'ALL'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium'
                : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-highlight border border-transparent'
            }`}
          >
            All Subjects ({allNotes.length})
          </button>
          {subjectsWithNotes.map(([code, name]) => (
            <button
              key={code}
              onClick={() => setSelectedSubject(code)}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                selectedSubject === code
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium'
                  : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-highlight border border-transparent'
              }`}
              title={name}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center rounded bg-dark-surface border border-dark-border space-y-3">
          <FileText className="w-8 h-8 text-gate-dim mx-auto" />
          <div className="text-sm text-gate-primary font-medium">
            {allNotes.length === 0 ? "No personal notes created yet" : "No notes match your search query"}
          </div>
          <p className="text-xs text-gate-secondary max-w-md mx-auto">
            {allNotes.length === 0
              ? "Open any lesson and write key formulas, intuitions, and reminders in the 'Mastery & Notes' tab. They will appear here automatically."
              : "Try clearing your search query or choosing another subject filter."}
          </p>
          {allNotes.length === 0 && (
            <button
              onClick={() => onNavigate('az-sheet')}
              className="mt-2 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs transition-colors inline-flex items-center space-x-1.5"
            >
              <span>Explore Curriculum to Take Notes</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map(note => {
            const isEditing = editingId === note.lessonId;

            return (
              <div
                key={note.lessonId}
                className="p-4 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive transition-colors space-y-3"
              >
                {/* Note Top Bar */}
                <div className="flex items-center justify-between gap-3 border-b border-dark-borderSubtle pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-highlight text-gate-secondary border border-dark-border">
                      {note.subjectCode || 'CS'}
                    </span>
                    <h3 className="text-sm font-semibold text-gate-primary">
                      {note.lessonTitle}
                    </h3>
                    <span className="text-xs text-gate-dim hidden sm:inline">
                      ({note.subjectName})
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-gate-muted flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </span>

                    <button
                      onClick={() => handleStartEdit(note)}
                      className="p-1 text-gate-secondary hover:text-gate-primary rounded hover:bg-dark-highlight transition-colors"
                      title="Edit note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteNote(note.lessonId)}
                      className="p-1 text-gate-muted hover:text-red-400 rounded hover:bg-dark-highlight transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onNavigate('lesson', { lessonId: note.lessonId })}
                      className="px-2 py-0.5 rounded bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-mono flex items-center space-x-1 transition-colors"
                      title="Go to lesson"
                    >
                      <span>Lesson</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Note Content */}
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={5}
                      className="w-full p-3 rounded bg-dark-bg border border-dark-borderActive text-xs text-gate-primary font-mono focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSaveEdit(note.lessonId)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs flex items-center space-x-1 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 rounded bg-dark-elevated text-gate-secondary hover:text-gate-primary font-mono text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gate-secondary whitespace-pre-wrap font-sans leading-relaxed bg-dark-bg/60 p-3 rounded border border-dark-borderSubtle">
                    {note.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
