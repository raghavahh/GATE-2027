import React, { useState, useEffect, useMemo } from 'react';
import { ProgressProvider } from './context/ProgressContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { Navbar } from './components/Navigation/Navbar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { AZSheetView } from './components/AZSheet/AZSheetView';
import { RoadmapView } from './components/Roadmap/RoadmapView';
import { LessonView } from './components/LearningEngine/LessonView';
import { SubjectView } from './components/Subject/SubjectView';
import { PillarView } from './components/Pillar/PillarView';
import { FormulasView } from './components/Formulas/FormulasView';
import { BookmarksView } from './components/Bookmarks/BookmarksView';
import { DailyMissionView } from './components/DailyMission/DailyMissionView';
import { ResourcesView } from './components/Resources/ResourcesView';
import { NotesView } from './components/Notes/NotesView';
import { SettingsView } from './components/Settings/SettingsView';
import { GlobalSearchModal } from './components/Search/GlobalSearchModal';
import { getLessonById, getSubjectById } from './data/syllabus';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [viewParams, setViewParams] = useState<Record<string, string>>({});
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const handleNavigate = (view: string, params: Record<string, string> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut for search and focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is inside an input or textarea
      const tag = (e.target as HTMLElement).tagName;
      if (['INPUT', 'TEXTAREA'].includes(tag)) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false);
        } else if (isFocusMode) {
          setIsFocusMode(false);
        }
      } else if (e.key.toLowerCase() === 'f' && currentView === 'lesson') {
        setIsFocusMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isFocusMode, currentView]);

  // Breadcrumbs computation
  const breadcrumbs = useMemo(() => {
    const list: { label: string; onClick?: () => void }[] = [
      { label: 'GATE//27', onClick: () => handleNavigate('dashboard') }
    ];

    if (currentView === 'dashboard') {
      list.push({ label: 'Dashboard' });
    } else if (currentView === 'az-sheet') {
      list.push({ label: 'A-Z Sheet' });
    } else if (currentView === 'roadmap') {
      list.push({ label: 'Roadmap & 21 Weeks' });
    } else if (currentView === 'daily-mission') {
      list.push({ label: 'Daily Mission' });
    } else if (currentView === 'resources') {
      list.push({ label: 'Curated Resources' });
    } else if (currentView === 'formulas') {
      list.push({ label: 'Formula & Rule Library' });
    } else if (currentView === 'bookmarks') {
      list.push({ label: 'Bookmarks' });
    } else if (currentView === 'notes') {
      list.push({ label: 'My Notes' });
    } else if (currentView === 'settings') {
      list.push({ label: 'System Settings' });
    } else if (currentView === 'pillar-ga') {
      list.push({ label: 'General Aptitude (15M)' });
    } else if (currentView === 'pillar-math') {
      list.push({ label: 'Engineering Mathematics (13M)' });
    } else if (currentView === 'subject' && viewParams.subjectId) {
      const sub = getSubjectById(viewParams.subjectId);
      if (sub) {
        list.push({
          label: sub.pillar === 'GA' ? 'General Aptitude' : sub.pillar === 'MATH' ? 'Engineering Maths' : 'Computer Science',
          onClick: () => handleNavigate(sub.pillar === 'GA' ? 'pillar-ga' : sub.pillar === 'MATH' ? 'pillar-math' : 'az-sheet')
        });
        list.push({ label: sub.name });
      }
    } else if (currentView === 'lesson' && viewParams.lessonId) {
      const ld = getLessonById(viewParams.lessonId);
      if (ld) {
        list.push({
          label: ld.subject.name,
          onClick: () => handleNavigate('subject', { subjectId: ld.subject.id })
        });
        list.push({ label: ld.topic.name });
        list.push({ label: ld.lesson.title });
      }
    }

    return list;
  }, [currentView, viewParams]);

  return (
    <div className="flex h-screen w-screen bg-dark-bg text-gate-primary overflow-hidden font-sans">
      {/* Sidebar - hidden in Focus Mode */}
      {!isFocusMode && (
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          selectedSubjectId={viewParams.subjectId}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar
          breadcrumbs={breadcrumbs}
          isFocusMode={isFocusMode}
          onToggleFocusMode={() => setIsFocusMode(prev => !prev)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-dark-bg">
          {currentView === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
          {currentView === 'az-sheet' && <AZSheetView onNavigate={handleNavigate} />}
          {currentView === 'roadmap' && <RoadmapView onNavigate={handleNavigate} />}
          {currentView === 'daily-mission' && <DailyMissionView onNavigate={handleNavigate} />}
          {currentView === 'resources' && <ResourcesView onNavigate={handleNavigate} />}
          {currentView === 'formulas' && <FormulasView onNavigate={handleNavigate} />}
          {currentView === 'bookmarks' && <BookmarksView onNavigate={handleNavigate} />}
          {currentView === 'notes' && <NotesView onNavigate={handleNavigate} />}
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'pillar-ga' && <PillarView pillar="GA" onNavigate={handleNavigate} />}
          {currentView === 'pillar-math' && <PillarView pillar="MATH" onNavigate={handleNavigate} />}
          {currentView === 'subject' && viewParams.subjectId && (
            <SubjectView subjectId={viewParams.subjectId} onNavigate={handleNavigate} />
          )}
          {currentView === 'lesson' && viewParams.lessonId && (
            <LessonView
              lessonId={viewParams.lessonId}
              onNavigate={handleNavigate}
              isFocusMode={isFocusMode}
              onToggleFocusMode={() => setIsFocusMode(prev => !prev)}
            />
          )}
        </main>
      </div>

      {/* Global Search Command Palette Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}
