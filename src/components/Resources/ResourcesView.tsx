import React, { useState, useMemo } from 'react';
import { 
  Video, 
  FileText, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  Search, 
  Bookmark, 
  ShieldCheck, 
  Clock
} from 'lucide-react';
import { getAllResources } from '../../data/resources/resourceRegistry';
import { useProgress } from '../../context/ProgressContext';
import { ResourceType, PillarType } from '../../types';

interface ResourcesViewProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ onNavigate }) => {
  const { bookmarkedResources, toggleResourceBookmark } = useProgress();
  const [selectedType, setSelectedType] = useState<ResourceType | 'ALL'>('ALL');
  const [selectedPillar, setSelectedPillar] = useState<PillarType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const allResources = useMemo(() => getAllResources(), []);

  const filteredResources = useMemo(() => {
    return allResources.filter(res => {
      if (selectedType !== 'ALL' && res.type !== selectedType) return false;
      if (selectedPillar !== 'ALL' && res.pillar !== selectedPillar) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          res.title.toLowerCase().includes(q) ||
          res.provider.toLowerCase().includes(q) ||
          res.description.toLowerCase().includes(q) ||
          (res.subjectCode && res.subjectCode.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allResources, selectedType, selectedPillar, searchQuery]);

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'youtube':
        return <Video className="w-4 h-4 text-red-400" />;
      case 'notes':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'official':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <ExternalLink className="w-4 h-4 text-purple-400" />;
    }
  };

  const getTypeBadge = (type: ResourceType) => {
    switch (type) {
      case 'youtube':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'notes':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'book':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'official':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-dark-border pb-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl font-bold font-mono text-gate-primary tracking-tight">
            CURATED LEARNING RESOURCES
          </h1>
        </div>
        <p className="text-xs text-gate-secondary mt-1">
          Zero-fluff verified learning resources: official IIT Madras documents, premier YouTube lectures,
          top university notes, and standard reference textbooks.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3 bg-dark-surface p-4 rounded border border-dark-border">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gate-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, keyword, or educator (e.g. Deadlocks, Banker's, Neso, Cache)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded bg-dark-bg border border-dark-border text-xs text-gate-primary placeholder-gate-muted focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Pillar Filters */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'CS', 'MATH', 'GA'] as const).map(p => (
              <button
                key={p}
                onClick={() => setSelectedPillar(p)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  selectedPillar === p
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium'
                    : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-highlight border border-transparent'
                }`}
              >
                {p === 'ALL' ? 'All Pillars' : p === 'CS' ? 'CS Core' : p === 'MATH' ? 'Maths' : 'Aptitude'}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center space-x-1.5 pt-2 border-t border-dark-borderSubtle overflow-x-auto">
          <span className="text-[11px] font-mono text-gate-muted mr-1">TYPE:</span>
          {(['ALL', 'youtube', 'notes', 'book', 'official'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded text-xs capitalize transition-colors ${
                selectedType === t
                  ? 'bg-dark-highlight text-gate-primary border border-dark-borderActive font-medium'
                  : 'text-gate-secondary hover:text-gate-primary hover:bg-dark-highlight/50 border border-transparent'
              }`}
            >
              {t === 'ALL' ? 'All Resources' : t === 'youtube' ? 'YouTube Lectures' : t === 'notes' ? 'Notes' : t === 'book' ? 'Textbooks' : 'Official Docs'}
            </button>
          ))}
        </div>
      </div>

      {/* Result Metrics */}
      <div className="flex items-center justify-between text-xs font-mono text-gate-muted px-1">
        <span>Showing {filteredResources.length} verified resources</span>
        {bookmarkedResources.length > 0 && (
          <span className="text-amber-400/80">★ {bookmarkedResources.length} bookmarked</span>
        )}
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="p-12 text-center rounded bg-dark-surface border border-dark-border space-y-2">
          <Search className="w-8 h-8 text-gate-dim mx-auto" />
          <div className="text-sm text-gate-primary font-medium">No resources match your filter</div>
          <p className="text-xs text-gate-secondary">Try searching a different subject or keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map(res => {
            const isBookmarked = bookmarkedResources.includes(res.id);

            return (
              <div
                key={res.id}
                className="p-4 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive flex flex-col justify-between transition-colors group space-y-3"
              >
                <div className="space-y-2">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border flex items-center space-x-1 ${getTypeBadge(res.type)}`}>
                        {getTypeIcon(res.type)}
                        <span className="capitalize">{res.type}</span>
                      </span>

                      {res.subjectCode && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-dark-elevated text-gate-secondary border border-dark-border">
                          {res.subjectCode}
                        </span>
                      )}

                      {res.verified && (
                        <span className="flex items-center space-x-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleResourceBookmark(res.id)}
                      className={`p-1 rounded transition-colors ${
                        isBookmarked
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-gate-dim hover:text-gate-secondary'
                      }`}
                      title={isBookmarked ? "Remove bookmark" : "Bookmark resource"}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Title & Provider */}
                  <div>
                    <h3 className="text-sm font-semibold text-gate-primary group-hover:text-blue-400 transition-colors">
                      {res.title}
                    </h3>
                    <div className="text-[11px] font-mono text-gate-secondary mt-0.5 flex items-center space-x-2">
                      <span>Provider: <strong className="text-gate-primary font-normal">{res.provider}</strong></span>
                      {res.duration && (
                        <>
                          <span className="text-gate-dim">•</span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gate-muted" />
                            <span>{res.duration}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gate-secondary line-clamp-2">
                    {res.description}
                  </p>
                </div>

                {/* Footer Link & Action */}
                <div className="pt-3 border-t border-dark-borderSubtle flex items-center justify-between">
                  {res.lessonId ? (
                    <button
                      onClick={() => onNavigate('lesson', { lessonId: res.lessonId! })}
                      className="text-xs font-mono text-gate-secondary hover:text-blue-400 transition-colors flex items-center space-x-1"
                    >
                      <span>Jump to Lesson</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-gate-muted">Official Syllabus Reference</span>
                  )}

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-mono flex items-center space-x-1.5 transition-colors"
                  >
                    <span>Open Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
