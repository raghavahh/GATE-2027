import React from 'react';
import { 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Cpu, 
  Sigma, 
  FileText,
  Sliders
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { allSubjects, getSubjectsByPillar, getLessonById } from '../../data/syllabus';
import { roadmapPhases } from '../../data/roadmap/phases';
import { roadmapWeeks } from '../../data/roadmap/weeks';

interface DashboardViewProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { stats, dailyMode, customStudyMinutes, setDailyConfig, progress } = useProgress();

  // Current calendar phase & week calculation
  const currentPhase = roadmapPhases[0]; // Phase 0 (Sep 9-13)
  const currentWeek = roadmapWeeks[0]; // Week 1

  // Recommendations for "Continue Learning"
  const recommendedLessonIds = [
    'os-l1', // OS: Deadlock Conditions, RAG & Banker's Algorithm
    'db-l1', // DBMS: Normalization & Candidate Keys
    'cn-l2', // CN: CIDR Subnetting & Fragmentation
    'dm-l1', // Maths: Propositional Logic & Truth Tables
    'pds-l1' // PDS: C Pointers & Arithmetic
  ];

  const continueLessons = recommendedLessonIds.map(id => getLessonById(id)).filter(Boolean);

  // Daily task generation based on mode
  const getTasksForToday = () => {
    if (dailyMode === 'college') {
      return [
        { id: '1', subject: 'Operating Systems', topic: 'Deadlock Conditions & RAG Cycle Rules', lessonId: 'os-l1', minutes: 55, type: 'primary' },
        { id: '2', subject: 'Programming & Data Structures', topic: 'Pointer Arithmetic & Precedence', lessonId: 'pds-l1', minutes: 50, type: 'secondary' },
        { id: '3', subject: 'General Aptitude', topic: 'Nouns, Pronouns & Articles', lessonId: 'ga-v-l1', minutes: 30, type: 'ga' },
        { id: '4', subject: 'Discrete Mathematics', topic: 'Logical Operators & Tautologies', lessonId: 'dm-l1', minutes: 30, type: 'math' },
        { id: '5', subject: 'Review & Revision', topic: 'Active Recall & Master Check Audit', lessonId: 'os-l1', minutes: 20, type: 'revision' },
      ];
    } else {
      return [
        { id: '1', subject: 'Operating Systems', topic: 'Banker\'s Safety Algorithm Matrices', lessonId: 'os-l1', minutes: 100, type: 'primary' },
        { id: '2', subject: 'Computer Networks', topic: 'CIDR Subnetting & Longest Prefix Match', lessonId: 'cn-l2', minutes: 90, type: 'secondary' },
        { id: '3', subject: 'General Aptitude', topic: 'Percentages & Successive Variations', lessonId: 'ga-q-l2', minutes: 60, type: 'ga' },
        { id: '4', subject: 'Engineering Maths', topic: 'Matrix Rank & Systems of Equations', lessonId: 'la-l1', minutes: 60, type: 'math' },
        { id: '5', subject: 'Deep Revision', topic: 'Comprehensive Master Check Consolidation', lessonId: 'pds-l1', minutes: 90, type: 'revision' },
      ];
    }
  };

  const todayTasks = getTasksForToday();
  const totalTodayMinutes = todayTasks.reduce((acc, t) => acc + t.minutes, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Top Banner / Baseline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Target Card */}
        <div className="p-4 rounded bg-dark-surface border border-dark-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gate-secondary font-mono">
            <span>PREPARATION TARGET</span>
            <span className="text-[10px] text-gate-muted font-sans">GATE 2027</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold font-mono text-gate-primary tracking-tight">
              75<span className="text-blue-400 text-xl font-normal">+</span>
            </div>
            <div className="text-[11px] text-gate-secondary mt-0.5">
              Floor: <span className="font-mono text-gate-primary">60</span> • Stretch: <span className="font-mono text-gate-primary">80</span>
            </div>
          </div>
          <div className="text-[10px] text-gate-muted border-t border-dark-borderSubtle pt-2">
            Personal benchmark for top IIT admissions.
          </div>
        </div>

        {/* Curriculum Progress */}
        <div className="p-4 rounded bg-dark-surface border border-dark-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gate-secondary font-mono">
            <span>CURRICULUM COMPLETE</span>
            <span className="text-blue-400 font-mono font-medium">{stats.overallPercent}%</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold font-mono text-gate-primary tracking-tight">
              {stats.masteredCount + stats.strongCount}<span className="text-gate-muted text-lg font-normal"> / {stats.totalLessons}</span>
            </div>
            <div className="text-[11px] text-gate-secondary mt-0.5">
              {stats.masteredCount} Mastered • {stats.strongCount} Strong • {stats.learningCount} In Progress
            </div>
          </div>
          <div className="w-full bg-dark-highlight h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.max(stats.overallPercent, 2)}%` }} />
          </div>
        </div>

        {/* Current Phase */}
        <div 
          onClick={() => onNavigate('roadmap')}
          className="p-4 rounded bg-dark-surface border border-dark-border flex flex-col justify-between cursor-pointer hover:border-dark-borderActive transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-gate-secondary font-mono">
            <span>CURRENT PHASE</span>
            <span className="text-amber-400 font-mono text-[10px]">{currentPhase.code}</span>
          </div>
          <div className="my-2">
            <div className="text-lg font-semibold text-gate-primary leading-tight">
              {currentPhase.name}
            </div>
            <div className="text-[11px] text-gate-secondary mt-0.5 font-mono">
              {currentPhase.dates}
            </div>
          </div>
          <div className="text-[11px] text-blue-400 flex items-center space-x-1 border-t border-dark-borderSubtle pt-2">
            <span>View 21-Week Roadmap</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Current Week */}
        <div 
          onClick={() => onNavigate('roadmap')}
          className="p-4 rounded bg-dark-surface border border-dark-border flex flex-col justify-between cursor-pointer hover:border-dark-borderActive transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-gate-secondary font-mono">
            <span>CURRENT CALENDAR</span>
            <span className="text-emerald-400 font-mono text-[10px]">W01</span>
          </div>
          <div className="my-2">
            <div className="text-lg font-semibold text-gate-primary leading-tight">
              Week 01 Focus
            </div>
            <div className="text-[11px] text-gate-secondary mt-0.5">
              C Pointers • Propositional Logic • GA
            </div>
          </div>
          <div className="text-[11px] text-gate-muted border-t border-dark-borderSubtle pt-2 flex items-center justify-between">
            <span>Est: {currentWeek.estimatedHours} hrs</span>
            <span className="text-gate-secondary">Milestone: Calibration</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Learning & Continue Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Learning Plan */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gate-primary font-mono">
                Today's Learning Plan
              </h2>
            </div>

            {/* Daily Schedule Mode Selector */}
            <div className="flex items-center space-x-1.5 p-0.5 rounded bg-dark-elevated border border-dark-border text-xs">
              <button
                onClick={() => setDailyConfig('college')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  dailyMode === 'college'
                    ? 'bg-dark-highlight text-gate-primary font-medium'
                    : 'text-gate-secondary hover:text-gate-primary'
                }`}
              >
                College Day (3h 05m)
              </button>
              <button
                onClick={() => setDailyConfig('weekend')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  dailyMode === 'weekend'
                    ? 'bg-dark-highlight text-gate-primary font-medium'
                    : 'text-gate-secondary hover:text-gate-primary'
                }`}
              >
                Weekend (6h 40m)
              </button>
            </div>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded divide-y divide-dark-borderSubtle overflow-hidden">
            {todayTasks.map((task, index) => {
              const p = progress[task.lessonId]?.status || 'not-started';
              return (
                <div
                  key={task.id}
                  onClick={() => onNavigate('lesson', { lessonId: task.lessonId })}
                  className="p-3.5 flex items-center justify-between hover:bg-dark-elevated cursor-pointer group transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="font-mono text-xs text-gate-muted w-6">
                      0{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-dark-highlight text-gate-secondary border border-dark-borderSubtle">
                          {task.subject}
                        </span>
                        <span className="text-xs font-medium text-gate-primary group-hover:text-blue-400 transition-colors">
                          {task.topic}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <span className="text-gate-secondary">{task.minutes} min</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gate-dim group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}

            <div className="p-3 bg-dark-elevated/30 flex items-center justify-between text-xs font-mono text-gate-secondary">
              <span>TOTAL SCHEDULED TIME</span>
              <span className="font-semibold text-gate-primary">
                {Math.floor(totalTodayMinutes / 60)}h {totalTodayMinutes % 60}m
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Continue Learning Quick Jump */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gate-primary font-mono">
              Continue Learning
            </h2>
            <button
              onClick={() => onNavigate('az-sheet')}
              className="text-xs text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {continueLessons.map(item => {
              if (!item) return null;
              const { lesson, subject } = item;
              const p = progress[lesson.id]?.status || 'not-started';

              return (
                <div
                  key={lesson.id}
                  onClick={() => onNavigate('lesson', { lessonId: lesson.id })}
                  className="p-3 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive hover:bg-dark-elevated transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-gate-secondary mb-1">
                    <span>{subject.name}</span>
                    <span className="capitalize text-gate-muted">{p.replace('-', ' ')}</span>
                  </div>
                  <div className="text-xs font-medium text-gate-primary group-hover:text-blue-400 transition-colors">
                    {lesson.title}
                  </div>
                  <div className="text-[11px] text-gate-muted mt-1.5 flex items-center justify-between">
                    <span>{lesson.durationMin} mins</span>
                    <span className="text-blue-400 text-[10px] flex items-center space-x-1">
                      <span>Resume</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Official Syllabus Pillars (GA 15M, MATH 13M, CS 72M) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gate-primary font-mono">
              The 3 Pillars (IIT Madras GATE 2027)
            </h2>
            <p className="text-xs text-gate-muted mt-0.5">
              Official mark distribution: General Aptitude 15M • Engineering Mathematics 13M • CS Core 72M
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* General Aptitude */}
          <div 
            onClick={() => onNavigate('pillar-ga')}
            className="p-4 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-medium text-gate-primary">General Aptitude</span>
              </div>
              <span className="text-xs font-mono font-semibold text-yellow-400">15 MARKS</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gate-secondary mb-1.5 font-mono">
              <span>{stats.pillarStats.GA.completed} / {stats.pillarStats.GA.total} lessons</span>
              <span>{stats.pillarStats.GA.percent}%</span>
            </div>
            <div className="w-full bg-dark-highlight h-1.5 rounded-full overflow-hidden">
              <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${stats.pillarStats.GA.percent}%` }} />
            </div>
            <div className="text-[10px] text-gate-muted mt-2">
              Verbal Ability • Quantitative • Analytical • Spatial
            </div>
          </div>

          {/* Engineering Mathematics */}
          <div 
            onClick={() => onNavigate('pillar-math')}
            className="p-4 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Sigma className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-medium text-gate-primary">Engineering Mathematics</span>
              </div>
              <span className="text-xs font-mono font-semibold text-cyan-400">13 MARKS</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gate-secondary mb-1.5 font-mono">
              <span>{stats.pillarStats.MATH.completed} / {stats.pillarStats.MATH.total} lessons</span>
              <span>{stats.pillarStats.MATH.percent}%</span>
            </div>
            <div className="w-full bg-dark-highlight h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${stats.pillarStats.MATH.percent}%` }} />
            </div>
            <div className="text-[10px] text-gate-muted mt-2">
              Discrete Mathematics • Linear Algebra • Calculus • Probability
            </div>
          </div>

          {/* Computer Science */}
          <div 
            onClick={() => onNavigate('az-sheet')}
            className="p-4 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium text-gate-primary">Computer Science Core</span>
              </div>
              <span className="text-xs font-mono font-semibold text-blue-400">72 MARKS</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gate-secondary mb-1.5 font-mono">
              <span>{stats.pillarStats.CS.completed} / {stats.pillarStats.CS.total} lessons</span>
              <span>{stats.pillarStats.CS.percent}%</span>
            </div>
            <div className="w-full bg-dark-highlight h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${stats.pillarStats.CS.percent}%` }} />
            </div>
            <div className="text-[10px] text-gate-muted mt-2">
              DL • COA • PDS • Algo • TOC • Compiler • OS • DBMS • CN
            </div>
          </div>
        </div>
      </div>

      {/* Individual Subject Matrix */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gate-primary font-mono">
          Subject Breakdown Matrix
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {allSubjects.map(sub => {
            const sStat = stats.subjectStats[sub.id] || { percent: 0, completed: 0, total: 0 };
            return (
              <div
                key={sub.id}
                onClick={() => onNavigate('subject', { subjectId: sub.id })}
                className="p-3 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive cursor-pointer transition-colors"
              >
                <div className="text-[10px] font-mono text-gate-muted truncate">
                  {sub.code}
                </div>
                <div className="text-xs font-medium text-gate-primary truncate mt-0.5">
                  {sub.name}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-gate-secondary mt-2">
                  <span>{sStat.percent}%</span>
                  <span className="text-gate-muted">{sStat.total} lessons</span>
                </div>
                <div className="w-full bg-dark-highlight h-1 rounded-full overflow-hidden mt-1">
                  <div className="bg-blue-500/80 h-full rounded-full" style={{ width: `${sStat.percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
