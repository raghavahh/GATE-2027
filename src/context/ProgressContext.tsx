import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { LearningStatus, UserLessonProgress, UserNote, UserSettings } from '../types';
import { allSubjects, getAllLessons, getLessonById } from '../data/syllabus';

interface ProgressContextType {
  progress: Record<string, UserLessonProgress>;
  updateStatus: (lessonId: string, status: LearningStatus) => void;
  toggleMasterCheck: (lessonId: string, index: number) => void;
  updateNotes: (lessonId: string, notes: string) => void;
  toggleBookmark: (lessonId: string) => void;
  toggleResourceBookmark: (resourceId: string) => void;
  
  // Note management
  notes: Record<string, UserNote>;
  getNote: (lessonId: string) => UserNote | undefined;
  saveNote: (lessonId: string, content: string) => void;
  deleteNote: (lessonId: string) => void;
  allNotes: UserNote[];

  // Settings & Customization
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  dailyMode: 'college' | 'weekend' | 'custom';
  customStudyMinutes: number;
  setDailyConfig: (mode: 'college' | 'weekend' | 'custom', minutes?: number) => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  resetProgress: () => void;

  // Analytics & Aggregates
  stats: {
    overallPercent: number;
    totalLessons: number;
    masteredCount: number;
    strongCount: number;
    practicingCount: number;
    learningCount: number;
    notStartedCount: number;
    subjectStats: Record<string, { percent: number; completed: number; total: number }>;
    pillarStats: {
      GA: { percent: number; completed: number; total: number };
      MATH: { percent: number; completed: number; total: number };
      CS: { percent: number; completed: number; total: number };
    };
  };
  bookmarkedLessons: string[];
  bookmarkedResources: string[];
}

const STORAGE_PROGRESS_V2 = 'gate27_user_progress_v2';
const STORAGE_PROGRESS_V1 = 'gate27_user_progress_v1';
const STORAGE_NOTES_V1 = 'gate27_user_notes_v1';
const STORAGE_BOOKMARKS_V1 = 'gate27_user_bookmarks_v1';
const STORAGE_SETTINGS_V1 = 'gate27_user_settings_v1';

const defaultSettings: UserSettings = {
  targetFloor: 60,
  targetScore: 75,
  targetStretch: 80,
  dailyMode: 'college',
  collegeStudyMinutes: 230, // 3h 50m (90 + 60 + 30 + 30 + 20)
  weekendStudyMinutes: 420, // 7h 00m (120 + 120 + 60 + 60 + 60)
  customStudyMinutes: 230
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load progress with v1 migration
  const [progress, setProgress] = useState<Record<string, UserLessonProgress>>(() => {
    try {
      const v2 = localStorage.getItem(STORAGE_PROGRESS_V2);
      if (v2) return JSON.parse(v2);

      // Check legacy v1
      const v1 = localStorage.getItem(STORAGE_PROGRESS_V1);
      if (v1) {
        const parsed = JSON.parse(v1);
        localStorage.setItem(STORAGE_PROGRESS_V2, v1);
        return parsed;
      }
      return {};
    } catch {
      return {};
    }
  });

  // Notes state
  const [notes, setNotes] = useState<Record<string, UserNote>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTES_V1);
      if (saved) return JSON.parse(saved);

      // Extract existing notes from v1 progress if present
      const initialNotes: Record<string, UserNote> = {};
      const v1 = localStorage.getItem(STORAGE_PROGRESS_V1);
      if (v1) {
        const parsed = JSON.parse(v1);
        Object.keys(parsed).forEach(lid => {
          if (parsed[lid]?.notes?.trim()) {
            const info = getLessonById(lid);
            initialNotes[lid] = {
              id: `note-${lid}`,
              lessonId: lid,
              lessonTitle: info?.lesson.title || 'Lesson',
              subjectName: info?.subject.name || 'Subject',
              subjectCode: info?.subject.code || 'CS',
              content: parsed[lid].notes,
              updatedAt: new Date().toISOString()
            };
          }
        });
      }
      return initialNotes;
    } catch {
      return {};
    }
  });

  // Resource bookmarks
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BOOKMARKS_V1);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Settings state
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_V1);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
      return defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Sync progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROGRESS_V2, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Sync notes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTES_V1, JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  // Sync resource bookmarks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_V1, JSON.stringify(bookmarkedResources));
    } catch {
      // ignore
    }
  }, [bookmarkedResources]);

  // Sync settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_V1, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const setDailyConfig = (mode: 'college' | 'weekend' | 'custom', minutes?: number) => {
    updateSettings({
      dailyMode: mode,
      ...(minutes !== undefined ? { customStudyMinutes: minutes } : {})
    });
  };

  const getOrCreateLessonProgress = (lessonId: string): UserLessonProgress => {
    return progress[lessonId] || {
      status: 'not-started',
      masterCheck: [false, false, false, false, false, false],
      notes: '',
      bookmarked: false
    };
  };

  const updateStatus = (lessonId: string, status: LearningStatus) => {
    setProgress(prev => {
      const current = prev[lessonId] || {
        status: 'not-started',
        masterCheck: [false, false, false, false, false, false],
        notes: '',
        bookmarked: false
      };
      return {
        ...prev,
        [lessonId]: {
          ...current,
          status,
          lastStudied: new Date().toISOString()
        }
      };
    });
  };

  const toggleMasterCheck = (lessonId: string, index: number) => {
    setProgress(prev => {
      const current = prev[lessonId] || {
        status: 'not-started',
        masterCheck: [false, false, false, false, false, false],
        notes: '',
        bookmarked: false
      };
      const newChecks = [...current.masterCheck];
      newChecks[index] = !newChecks[index];

      // Exact 6-criteria status mapping from Master PRD:
      // 0 checks = not-started
      // 1 check = learning
      // 2-3 checks = practicing
      // 4-5 checks = strong
      // 6 checks = mastered
      const checkedCount = newChecks.filter(Boolean).length;
      let newStatus: LearningStatus = 'not-started';
      if (checkedCount === 6) {
        newStatus = 'mastered';
      } else if (checkedCount >= 4) {
        newStatus = 'strong';
      } else if (checkedCount >= 2) {
        newStatus = 'practicing';
      } else if (checkedCount === 1) {
        newStatus = 'learning';
      }

      return {
        ...prev,
        [lessonId]: {
          ...current,
          masterCheck: newChecks,
          status: newStatus,
          lastStudied: new Date().toISOString()
        }
      };
    });
  };

  // Notes operations
  const saveNote = (lessonId: string, content: string) => {
    const info = getLessonById(lessonId);
    const newNote: UserNote = {
      id: `note-${lessonId}`,
      lessonId,
      lessonTitle: info?.lesson.title || 'Lesson',
      subjectName: info?.subject.name || 'Subject',
      subjectCode: info?.subject.code || 'CS',
      content,
      updatedAt: new Date().toISOString()
    };

    setNotes(prev => ({
      ...prev,
      [lessonId]: newNote
    }));

    // Mirror to progress.notes for backward compatibility
    setProgress(prev => {
      const current = getOrCreateLessonProgress(lessonId);
      return {
        ...prev,
        [lessonId]: { ...current, notes: content }
      };
    });
  };

  const deleteNote = (lessonId: string) => {
    setNotes(prev => {
      const next = { ...prev };
      delete next[lessonId];
      return next;
    });
    setProgress(prev => {
      const current = getOrCreateLessonProgress(lessonId);
      return {
        ...prev,
        [lessonId]: { ...current, notes: '' }
      };
    });
  };

  const getNote = (lessonId: string): UserNote | undefined => {
    return notes[lessonId];
  };

  const allNotes = useMemo(() => {
    return Object.values(notes).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes]);

  const updateNotes = (lessonId: string, notesContent: string) => {
    saveNote(lessonId, notesContent);
  };

  // Lesson bookmarks
  const toggleBookmark = (lessonId: string) => {
    setProgress(prev => {
      const current = getOrCreateLessonProgress(lessonId);
      return {
        ...prev,
        [lessonId]: {
          ...current,
          bookmarked: !current.bookmarked
        }
      };
    });
  };

  // Resource bookmarks
  const toggleResourceBookmark = (resourceId: string) => {
    setBookmarkedResources(prev => {
      if (prev.includes(resourceId)) {
        return prev.filter(id => id !== resourceId);
      } else {
        return [...prev, resourceId];
      }
    });
  };

  const bookmarkedLessons = useMemo(() => {
    return Object.keys(progress).filter(id => progress[id]?.bookmarked);
  }, [progress]);

  // Export / Import / Reset
  const exportData = (): string => {
    const backup = {
      version: 'v2',
      exportDate: new Date().toISOString(),
      progress,
      notes,
      bookmarkedResources,
      settings
    };
    return JSON.stringify(backup, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.progress) setProgress(parsed.progress);
      if (parsed.notes) setNotes(parsed.notes);
      if (parsed.bookmarkedResources) setBookmarkedResources(parsed.bookmarkedResources);
      if (parsed.settings) setSettings(parsed.settings);
      return true;
    } catch {
      return false;
    }
  };

  const resetProgress = () => {
    setProgress({});
    setNotes({});
    setBookmarkedResources([]);
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_PROGRESS_V2);
    localStorage.removeItem(STORAGE_PROGRESS_V1);
    localStorage.removeItem(STORAGE_NOTES_V1);
    localStorage.removeItem(STORAGE_BOOKMARKS_V1);
    localStorage.removeItem(STORAGE_SETTINGS_V1);
  };

  // Stats calculation
  const stats = useMemo(() => {
    const allLessons = getAllLessons();
    const totalLessons = allLessons.length;
    let weightedScore = 0;
    let masteredCount = 0;
    let strongCount = 0;
    let practicingCount = 0;
    let learningCount = 0;
    let notStartedCount = 0;

    const subjectStats: Record<string, { percent: number; completed: number; total: number }> = {};
    const pillarScores: Record<'GA' | 'MATH' | 'CS', { weighted: number; total: number }> = {
      GA: { weighted: 0, total: 0 },
      MATH: { weighted: 0, total: 0 },
      CS: { weighted: 0, total: 0 }
    };

    allSubjects.forEach(s => {
      let sWeighted = 0;
      let sTotal = 0;
      s.modules.forEach(m => {
        m.topics.forEach(t => {
          t.lessons.forEach(l => {
            sTotal += 1;
            const p = progress[l.id]?.status || 'not-started';
            let factor = 0;
            if (p === 'mastered') { factor = 1.0; masteredCount++; }
            else if (p === 'strong') { factor = 0.8; strongCount++; }
            else if (p === 'practicing') { factor = 0.5; practicingCount++; }
            else if (p === 'learning') { factor = 0.25; learningCount++; }
            else { notStartedCount++; }

            sWeighted += factor;
            weightedScore += factor;
            pillarScores[s.pillar].weighted += factor;
            pillarScores[s.pillar].total += 1;
          });
        });
      });
      subjectStats[s.id] = {
        percent: sTotal > 0 ? Math.round((sWeighted / sTotal) * 100) : 0,
        completed: Math.round(sWeighted),
        total: sTotal
      };
    });

    const overallPercent = totalLessons > 0 ? Math.round((weightedScore / totalLessons) * 100) : 0;

    const pillarStats = {
      GA: {
        percent: pillarScores.GA.total > 0 ? Math.round((pillarScores.GA.weighted / pillarScores.GA.total) * 100) : 0,
        completed: Math.round(pillarScores.GA.weighted),
        total: pillarScores.GA.total
      },
      MATH: {
        percent: pillarScores.MATH.total > 0 ? Math.round((pillarScores.MATH.weighted / pillarScores.MATH.total) * 100) : 0,
        completed: Math.round(pillarScores.MATH.weighted),
        total: pillarScores.MATH.total
      },
      CS: {
        percent: pillarScores.CS.total > 0 ? Math.round((pillarScores.CS.weighted / pillarScores.CS.total) * 100) : 0,
        completed: Math.round(pillarScores.CS.weighted),
        total: pillarScores.CS.total
      }
    };

    return {
      overallPercent,
      totalLessons,
      masteredCount,
      strongCount,
      practicingCount,
      learningCount,
      notStartedCount,
      subjectStats,
      pillarStats
    };
  }, [progress]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateStatus,
        toggleMasterCheck,
        updateNotes,
        toggleBookmark,
        toggleResourceBookmark,
        notes,
        getNote,
        saveNote,
        deleteNote,
        allNotes,
        settings,
        updateSettings,
        dailyMode: settings.dailyMode,
        customStudyMinutes: settings.customStudyMinutes,
        setDailyConfig,
        exportData,
        importData,
        resetProgress,
        stats,
        bookmarkedLessons,
        bookmarkedResources
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
