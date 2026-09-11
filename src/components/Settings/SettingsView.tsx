import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Target, 
  Clock, 
  Download, 
  Upload, 
  RotateCcw, 
  AlertTriangle, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Save
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    exportData, 
    importData, 
    resetProgress, 
    stats 
  } = useProgress();

  const [floorInput, setFloorInput] = useState(settings.targetFloor.toString());
  const [targetInput, setTargetInput] = useState(settings.targetScore.toString());
  const [stretchInput, setStretchInput] = useState(settings.targetStretch.toString());
  const [collegeMins, setCollegeMins] = useState(settings.collegeStudyMinutes.toString());
  const [weekendMins, setWeekendMins] = useState(settings.weekendStudyMinutes.toString());
  const [importJson, setImportJson] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveTargets = () => {
    const floor = parseInt(floorInput) || 60;
    const target = parseInt(targetInput) || 75;
    const stretch = parseInt(stretchInput) || 80;
    const colMins = parseInt(collegeMins) || 230;
    const wkMins = parseInt(weekendMins) || 420;

    updateSettings({
      targetFloor: floor,
      targetScore: target,
      targetStretch: stretch,
      collegeStudyMinutes: colMins,
      weekendStudyMinutes: wkMins
    });

    setFeedbackMsg({ type: 'success', text: 'Settings and benchmarks updated successfully!' });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gate27-progress-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedbackMsg({ type: 'success', text: 'Backup downloaded successfully.' });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const ok = importData(importJson);
    if (ok) {
      setFeedbackMsg({ type: 'success', text: 'Progress data imported successfully!' });
      setShowImportArea(false);
      setImportJson('');
    } else {
      setFeedbackMsg({ type: 'error', text: 'Invalid JSON format. Please verify your backup file.' });
    }
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    setFeedbackMsg({ type: 'success', text: 'All progress and notes have been reset to factory state.' });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-dark-border pb-6">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-gate-secondary" />
          <h1 className="text-xl font-bold font-mono text-gate-primary tracking-tight">
            SYSTEM SETTINGS & TARGET CALIBRATION
          </h1>
        </div>
        <p className="text-xs text-gate-secondary mt-1">
          Tune your benchmark score thresholds, daily study commitments, and manage local data backups.
        </p>
      </div>

      {feedbackMsg && (
        <div className={`p-3 rounded border text-xs font-mono flex items-center space-x-2 ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Target Score Calibration */}
      <div className="p-5 rounded bg-dark-surface border border-dark-border space-y-4">
        <div className="flex items-center space-x-2 border-b border-dark-borderSubtle pb-3">
          <Target className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold font-mono text-gate-primary">
            GATE 2027 TARGET SCORE BENCHMARKS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-mono text-gate-secondary block mb-1">
              FLOOR SCORE (MINIMUM)
            </label>
            <input
              type="number"
              value={floorInput}
              onChange={(e) => setFloorInput(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-dark-bg border border-dark-border text-sm font-mono text-gate-primary focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-gate-muted mt-1 block">Baseline cutoff floor for top NITs/IITs.</span>
          </div>

          <div>
            <label className="text-[11px] font-mono text-blue-400 block mb-1">
              PRIMARY TARGET SCORE
            </label>
            <input
              type="number"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-dark-bg border border-blue-500/40 text-sm font-mono text-blue-400 focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-gate-muted mt-1 block">Primary aim for Top 100 AIR in GATE CS.</span>
          </div>

          <div>
            <label className="text-[11px] font-mono text-purple-400 block mb-1">
              STRETCH GOAL
            </label>
            <input
              type="number"
              value={stretchInput}
              onChange={(e) => setStretchInput(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-dark-bg border border-dark-border text-sm font-mono text-purple-400 focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-gate-muted mt-1 block">Peak aspiration score.</span>
          </div>
        </div>
      </div>

      {/* Daily Study Allocation */}
      <div className="p-5 rounded bg-dark-surface border border-dark-border space-y-4">
        <div className="flex items-center space-x-2 border-b border-dark-borderSubtle pb-3">
          <Clock className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold font-mono text-gate-primary">
            DAILY STUDY TIME BUDGETS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono text-gate-secondary block mb-1">
              COLLEGE DAY BUDGET (MINUTES)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={collegeMins}
                onChange={(e) => setCollegeMins(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-dark-bg border border-dark-border text-sm font-mono text-gate-primary focus:outline-none focus:border-blue-500"
              />
              <span className="text-xs font-mono text-gate-muted whitespace-nowrap">
                ~{(parseInt(collegeMins) / 60 || 0).toFixed(1)} hrs
              </span>
            </div>
            <span className="text-[10px] text-gate-muted mt-1 block">Default: 230 mins (3h 50m) balanced for college days.</span>
          </div>

          <div>
            <label className="text-[11px] font-mono text-gate-secondary block mb-1">
              WEEKEND DAY BUDGET (MINUTES)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={weekendMins}
                onChange={(e) => setWeekendMins(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-dark-bg border border-dark-border text-sm font-mono text-gate-primary focus:outline-none focus:border-blue-500"
              />
              <span className="text-xs font-mono text-gate-muted whitespace-nowrap">
                ~{(parseInt(weekendMins) / 60 || 0).toFixed(1)} hrs
              </span>
            </div>
            <span className="text-[10px] text-gate-muted mt-1 block">Default: 420 mins (7h 00m) deep mastery & problem sessions.</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSaveTargets}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Backup, Restore & Data Management */}
      <div className="p-5 rounded bg-dark-surface border border-dark-border space-y-4">
        <div className="flex items-center space-x-2 border-b border-dark-borderSubtle pb-3">
          <Download className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold font-mono text-gate-primary">
            LOCAL STORAGE BACKUP & MIGRATION
          </h2>
        </div>

        <p className="text-xs text-gate-secondary">
          All your learning progress, mastery checks, and personal notes are stored privately in your browser's LocalStorage.
          Download a JSON backup periodically so you never lose your notes across devices or cache clears.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded bg-dark-highlight hover:bg-dark-elevated text-gate-primary border border-dark-border font-mono text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Progress (JSON)</span>
          </button>

          <button
            onClick={() => setShowImportArea(!showImportArea)}
            className="px-3 py-1.5 rounded bg-dark-highlight hover:bg-dark-elevated text-gate-primary border border-dark-border font-mono text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Import Backup (JSON)</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/20 font-mono text-xs flex items-center space-x-1.5 transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Data</span>
          </button>
        </div>

        {showImportArea && (
          <div className="space-y-2 pt-3 border-t border-dark-borderSubtle">
            <label className="text-[11px] font-mono text-gate-secondary block">
              PASTE BACKUP JSON DATA:
            </label>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              rows={4}
              placeholder="Paste JSON exported from GATE//27..."
              className="w-full p-2.5 rounded bg-dark-bg border border-dark-border text-xs font-mono text-gate-primary focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={handleImport}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs transition-colors"
              >
                Apply Restore
              </button>
              <button
                onClick={() => setShowImportArea(false)}
                className="px-3 py-1 rounded bg-dark-elevated text-gate-secondary hover:text-gate-primary font-mono text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showResetConfirm && (
          <div className="p-4 rounded bg-red-950/30 border border-red-500/30 space-y-2">
            <div className="text-xs font-semibold text-red-400 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Are you sure you want to reset all data?</span>
            </div>
            <p className="text-[11px] text-gate-secondary">
              This will erase all marked lessons ({stats.masteredCount + stats.strongCount} completed), personal notes, and bookmarks. This action cannot be undone.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={handleReset}
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs transition-colors"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1 rounded bg-dark-elevated text-gate-secondary hover:text-gate-primary font-mono text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Official Links & Information */}
      <div className="p-5 rounded bg-dark-surface border border-dark-border space-y-3">
        <div className="flex items-center space-x-2 border-b border-dark-borderSubtle pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold font-mono text-gate-primary">
            OFFICIAL GATE 2027 CURRICULUM SOURCES
          </h2>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-dark-borderSubtle">
            <span className="text-gate-secondary">Organizing Institute:</span>
            <span className="font-mono text-gate-primary">IIT Madras</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-dark-borderSubtle">
            <span className="text-gate-secondary">Paper Structure:</span>
            <span className="font-mono text-gate-primary">15M GA + 13M Maths + 72M CS Core (100 Marks)</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-gate-secondary">Official Portal:</span>
            <a
              href="https://gate2027.iitm.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline flex items-center space-x-1 font-mono"
            >
              <span>gate2027.iitm.ac.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
