import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Calendar, 
  BookOpen, 
  Sigma, 
  Bookmark, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Cpu, 
  Terminal, 
  FileText,
  Clock,
  Settings as SettingsIcon
} from 'lucide-react';
import { allSubjects, getSubjectsByPillar } from '../../data/syllabus';
import { useProgress } from '../../context/ProgressContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  selectedSubjectId?: string;
  onOpenSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  selectedSubjectId,
  onOpenSearch
}) => {
  const { stats, bookmarkedLessons, allNotes } = useProgress();
  const [csExpanded, setCsExpanded] = useState(true);
  const csSubjects = getSubjectsByPillar('CS');
  const mathSubjects = getSubjectsByPillar('MATH');
  const gaSubjects = getSubjectsByPillar('GA');

  return (
    <aside className="w-64 h-screen bg-dark-surface border-r border-dark-border flex flex-col flex-shrink-0 text-sm select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-dark-border flex items-center justify-between">
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-xs tracking-wider">
            27
          </div>
          <div>
            <div className="font-mono font-bold tracking-wider text-gate-primary text-sm flex items-center space-x-1.5">
              <span>GATE//27</span>
              <span className="text-[10px] px-1 py-0.5 rounded bg-dark-highlight text-gate-secondary font-sans border border-dark-border">
                A2Z
              </span>
            </div>
            <div className="text-[10px] text-gate-muted tracking-tight">IIT Madras CS Syllabus</div>
          </div>
        </div>
      </div>

      {/* Target & Metric Bar */}
      <div className="px-4 py-3 border-b border-dark-borderSubtle bg-dark-elevated/40">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center space-x-1.5">
            <span className="text-gate-muted font-mono text-[11px]">TARGET</span>
            <span className="font-semibold text-gate-primary font-mono">75+</span>
          </div>
          <div className="text-[11px] font-mono text-blue-400 font-medium">
            {stats.overallPercent}% COMPLETE
          </div>
        </div>
        <div className="w-full bg-dark-highlight h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.max(stats.overallPercent, 2)}%` }}
          />
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {/* Core Views */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-left transition-colors ${
            currentView === 'dashboard'
              ? 'bg-dark-highlight text-gate-primary font-medium border border-dark-border'
              : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
          }`}
        >
          <Compass className="w-4 h-4 text-blue-400" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('az-sheet')}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-left transition-colors ${
            currentView === 'az-sheet'
              ? 'bg-dark-highlight text-gate-primary font-medium border border-dark-border'
              : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <div className="flex-1 flex items-center justify-between">
            <span>A-Z Sheet</span>
            <span className="text-[10px] font-mono text-gate-dim px-1 rounded bg-dark-borderSubtle">
              {stats.totalLessons}
            </span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('roadmap')}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-left transition-colors ${
            currentView === 'roadmap'
              ? 'bg-dark-highlight text-gate-primary font-medium border border-dark-border'
              : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <div className="flex-1 flex items-center justify-between">
            <span>Roadmap & Weeks</span>
            <span className="text-[10px] font-mono text-gate-muted">21 WEEKS</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('daily-mission')}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-left transition-colors ${
            currentView === 'daily-mission'
              ? 'bg-dark-highlight text-gate-primary font-medium border border-dark-border'
              : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
          }`}
        >
          <Clock className="w-4 h-4 text-purple-400" />
          <span>Daily Mission</span>
        </button>

        <div className="pt-3 pb-1 px-3 text-[10px] font-mono uppercase tracking-wider text-gate-muted">
          Pillars & Subjects
        </div>

        {/* General Aptitude */}
        <button
          onClick={() => onNavigate('pillar-ga')}
          className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-left transition-colors ${
            currentView === 'pillar-ga'
              ? 'bg-dark-highlight text-gate-primary'
              : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-xs">General Aptitude</span>
          </div>
          <span className="text-[10px] font-mono text-gate-muted">15 M</span>
        </button>

        {/* Engineering Mathematics */}
        <button
          onClick={() => onNavigate('pillar-math')}
          className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-left transition-colors ${
            currentView === 'pillar-math'
              ? 'bg-dark-highlight text-gate-primary'
              : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Sigma className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs">Engineering Maths</span>
          </div>
          <span className="text-[10px] font-mono text-gate-muted">13 M</span>
        </button>

        {/* Computer Science Accordion */}
        <div>
          <button
            onClick={() => setCsExpanded(!csExpanded)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded text-left text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-medium">Computer Science</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-mono text-gate-muted">72 M</span>
              {csExpanded ? <ChevronDown className="w-3 h-3 text-gate-dim" /> : <ChevronRight className="w-3 h-3 text-gate-dim" />}
            </div>
          </button>

          {csExpanded && (
            <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-dark-border ml-4 mt-0.5">
              {csSubjects.map(sub => {
                const sStat = stats.subjectStats[sub.id] || { percent: 0, completed: 0, total: 0 };
                const isSelected = currentView === 'subject' && selectedSubjectId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => onNavigate('subject', { subjectId: sub.id })}
                    className={`w-full flex items-center justify-between px-2 py-1 rounded text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-blue-600/15 text-blue-300 font-medium border border-blue-500/20'
                        : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
                    }`}
                  >
                    <span className="truncate">{sub.name}</span>
                    <span className="text-[10px] font-mono text-gate-dim ml-1">
                      {sStat.percent}%
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-3 pb-1 px-3 text-[10px] font-mono uppercase tracking-wider text-gate-muted">
          Reference & Knowledge
        </div>

        <button
          onClick={() => onNavigate('resources')}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-left transition-colors ${
            currentView === 'resources'
              ? 'bg-dark-highlight text-gate-primary font-medium border border-dark-border'
              : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Resources</span>
        </button>

        <button
          onClick={() => onNavigate('formulas')}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-left transition-colors ${
            currentView === 'formulas'
              ? 'bg-dark-highlight text-gate-primary font-medium border border-dark-border'
              : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
          }`}
        >
          <Terminal className="w-4 h-4 text-pink-400" />
          <span>Formula Library</span>
        </button>

        <button
          onClick={() => onNavigate('bookmarks')}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-left transition-colors ${
            currentView === 'bookmarks'
              ? 'bg-dark-highlight text-gate-primary font-medium border border-dark-border'
              : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
          }`}
        >
          <Bookmark className="w-4 h-4 text-orange-400" />
          <div className="flex-1 flex items-center justify-between">
            <span>Bookmarks</span>
            {bookmarkedLessons.length > 0 && (
              <span className="text-[10px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {bookmarkedLessons.length}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => onNavigate('notes')}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-left transition-colors ${
            currentView === 'notes'
              ? 'bg-dark-highlight text-gate-primary font-medium border border-dark-border'
              : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <div className="flex-1 flex items-center justify-between">
            <span>My Notes</span>
            {allNotes.length > 0 && (
              <span className="text-[10px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {allNotes.length}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-left transition-colors ${
            currentView === 'settings'
              ? 'bg-dark-highlight text-gate-primary font-medium border border-dark-border'
              : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-elevated'
          }`}
        >
          <SettingsIcon className="w-4 h-4 text-gate-secondary" />
          <span>Settings</span>
        </button>
      </div>

      {/* Bottom Actions: Search & Keyboard Helper */}
      <div className="p-3 border-t border-dark-border space-y-2">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-dark-elevated hover:bg-dark-highlight text-gate-secondary hover:text-gate-primary border border-dark-borderSubtle transition-colors text-xs"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-gate-muted" />
            <span>Search topics...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-surface border border-dark-border text-gate-muted">
            Ctrl K
          </kbd>
        </button>

        <div className="flex items-center justify-between px-1 text-[10px] text-gate-muted">
          <span>GATE 2027 CS & IT</span>
          <span className="font-mono">v1.0</span>
        </div>
      </div>
    </aside>
  );
};
