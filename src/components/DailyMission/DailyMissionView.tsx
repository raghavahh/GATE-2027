import React from 'react';
import { 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Sliders, 
  Play,
  RotateCcw
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { getLessonById } from '../../data/syllabus';

interface DailyMissionViewProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const DailyMissionView: React.FC<DailyMissionViewProps> = ({ onNavigate }) => {
  const { dailyMode, setDailyConfig, progress, updateStatus } = useProgress();

  const collegeTasks = [
    { id: '1', title: 'Operating Systems: Deadlock Conditions & Coffman Rules', lessonId: 'os-l1', minutes: 90, type: 'Primary Subject' },
    { id: '2', title: 'Data Structures: C Pointers & Array Decaying', lessonId: 'pds-l1', minutes: 60, type: 'Secondary Topic / Practice' },
    { id: '3', title: 'General Aptitude: Nouns & Pronoun Concord', lessonId: 'ga-v-l1', minutes: 30, type: 'General Aptitude' },
    { id: '4', title: 'Discrete Mathematics: Propositional Tautologies', lessonId: 'dm-l1', minutes: 30, type: 'Engineering Maths' },
    { id: '5', title: 'Daily Consolidation & Master Check Self-Audit', lessonId: 'os-l1', minutes: 20, type: 'Daily Revision' },
  ];

  const weekendTasks = [
    { id: '1', title: 'Operating Systems: Banker\'s Safety Algorithm Matrices', lessonId: 'os-l1', minutes: 120, type: 'Primary Subject' },
    { id: '2', title: 'Computer Networks: CIDR Subnetting & Fragmentation', lessonId: 'cn-l2', minutes: 120, type: 'Secondary Topic / Practice' },
    { id: '3', title: 'General Aptitude: Percentages & Successive Discounts', lessonId: 'ga-q-l2', minutes: 60, type: 'General Aptitude' },
    { id: '4', title: 'Linear Algebra: Matrix Rank & System Consistency', lessonId: 'la-l1', minutes: 60, type: 'Engineering Maths' },
    { id: '5', title: 'Deep Weekly Revision & Formula Flash Recalls', lessonId: 'pds-l1', minutes: 80, type: 'Weekly Deep Revision' },
  ];

  const tasks = dailyMode === 'college' ? collegeTasks : weekendTasks;
  const totalMinutes = tasks.reduce((a, b) => a + b.minutes, 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold font-mono text-gate-primary tracking-tight">
              TODAY'S LEARNING MISSION
            </h1>
          </div>
          <p className="text-xs text-gate-secondary mt-1">
            Dynamic study scheduler scaling between college days and weekends.
            Sustainable consistency without cognitive burnout.
          </p>
        </div>

        {/* Schedule Mode Selector */}
        <div className="flex items-center space-x-2 p-1 rounded bg-dark-surface border border-dark-border self-start sm:self-auto">
          <button
            onClick={() => setDailyConfig('college')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              dailyMode === 'college'
                ? 'bg-dark-highlight text-gate-primary font-semibold border border-dark-borderSubtle'
                : 'text-gate-secondary hover:text-gate-primary'
            }`}
          >
            College Day (3h 50m)
          </button>
          <button
            onClick={() => setDailyConfig('weekend')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              dailyMode === 'weekend'
                ? 'bg-dark-highlight text-gate-primary font-semibold border border-dark-borderSubtle'
                : 'text-gate-secondary hover:text-gate-primary'
            }`}
          >
            Weekend (7h 20m)
          </button>
        </div>
      </div>

      {/* Target Allocation Banner */}
      <div className="p-4 rounded bg-dark-surface border border-dark-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div>
          <div className="text-[10px] text-gate-muted uppercase">Today's Total Time</div>
          <div className="text-lg font-bold text-gate-primary mt-0.5">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gate-muted uppercase">Primary & Core</div>
          <div className="text-lg font-bold text-blue-400 mt-0.5">
            {dailyMode === 'college' ? '90 mins' : '120 mins'}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gate-muted uppercase">Daily GA + Maths</div>
          <div className="text-lg font-bold text-amber-400 mt-0.5">
            {dailyMode === 'college' ? '60 mins' : '120 mins'}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gate-muted uppercase">Active Recall</div>
          <div className="text-lg font-bold text-purple-400 mt-0.5">
            {dailyMode === 'college' ? '20 mins' : '80 mins'}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-gate-muted">
          Scheduled Learning Blocks for Today
        </h2>

        <div className="space-y-2.5">
          {tasks.map((task, idx) => {
            const p = progress[task.lessonId]?.status || 'not-started';
            const isCompleted = p === 'mastered' || p === 'strong';

            return (
              <div
                key={task.id}
                className="p-4 rounded bg-dark-surface border border-dark-border hover:border-dark-borderActive flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="font-mono text-xs text-gate-muted w-6">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-highlight text-gate-secondary border border-dark-borderSubtle">
                        {task.type}
                      </span>
                      <span className="text-xs font-mono text-gate-muted">
                        {task.minutes} min block
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-gate-primary group-hover:text-blue-400 transition-colors mt-1">
                      {task.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onNavigate('lesson', { lessonId: task.lessonId })}
                    className="px-3 py-1.5 rounded bg-dark-elevated hover:bg-dark-highlight border border-dark-border text-xs font-mono text-gate-primary flex items-center space-x-1.5 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current text-blue-400" />
                    <span>Launch Study</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
