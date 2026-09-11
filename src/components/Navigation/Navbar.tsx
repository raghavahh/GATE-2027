import React from 'react';
import { Search, Maximize2, Minimize2, ChevronRight } from 'lucide-react';

interface NavbarProps {
  breadcrumbs: { label: string; onClick?: () => void }[];
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  breadcrumbs,
  isFocusMode,
  onToggleFocusMode,
  onOpenSearch
}) => {
  return (
    <header className="h-12 border-b border-dark-border bg-dark-surface/80 backdrop-blur px-4 flex items-center justify-between flex-shrink-0 z-10 select-none">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1.5 text-xs text-gate-secondary overflow-hidden">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-gate-dim flex-shrink-0" />}
              {crumb.onClick && !isLast ? (
                <button
                  onClick={crumb.onClick}
                  className="hover:text-gate-primary transition-colors truncate max-w-[160px]"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className={`truncate max-w-[200px] ${isLast ? 'text-gate-primary font-medium' : ''}`}>
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Target Badges & Controls */}
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2 font-mono text-[11px] px-2.5 py-1 rounded bg-dark-elevated border border-dark-borderSubtle text-gate-secondary">
          <span>FLOOR: <strong className="text-gate-primary font-normal">60</strong></span>
          <span className="text-gate-dim">•</span>
          <span>TARGET: <strong className="text-blue-400 font-medium">75+</strong></span>
          <span className="text-gate-dim">•</span>
          <span>STRETCH: <strong className="text-gate-primary font-normal">80</strong></span>
        </div>

        <button
          onClick={onOpenSearch}
          aria-label="Global Search"
          className="p-1.5 rounded hover:bg-dark-highlight text-gate-secondary hover:text-gate-primary border border-transparent hover:border-dark-border transition-colors"
          title="Search (Ctrl + K)"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleFocusMode}
          aria-label={isFocusMode ? "Exit Focus Mode" : "Distraction-Free Focus Mode"}
          className={`p-1.5 rounded border transition-colors ${
            isFocusMode 
              ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' 
              : 'hover:bg-dark-highlight text-gate-secondary hover:text-gate-primary border-transparent hover:border-dark-border'
          }`}
          title={isFocusMode ? "Exit Focus Mode (Esc)" : "Distraction-Free Focus Mode (F)"}
        >
          {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
