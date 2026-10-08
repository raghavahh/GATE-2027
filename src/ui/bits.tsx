import { Check } from 'lucide-react';
import type { Diff } from '../catalog';
import { DIFF_LABEL } from '../catalog';
import type { Status } from '../lib/store';

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-semibold tracking-tight">
      <span className={`grid place-items-center rounded-md bg-brand text-on-brand font-mono font-medium ${small ? 'h-6 w-6 text-[11px]' : 'h-7 w-7 text-xs'}`}>A–Z</span>
      <span className={small ? 'text-sm' : 'text-[15px]'}>GATE A–Z</span>
    </span>
  );
}

const DIFF_CLS: Record<Diff, string> = {
  E: 'text-easy bg-easy/10',
  M: 'text-medium bg-medium/10',
  H: 'text-hard bg-hard/10',
};

export function DiffBadge({ d }: { d: Diff }) {
  return <span className={`chip ${DIFF_CLS[d]}`}>{DIFF_LABEL[d]}</span>;
}

/** LeetCode-style difficulty text (compact rows). */
export function DiffText({ d }: { d: Diff }) {
  const c = d === 'E' ? 'text-easy' : d === 'M' ? 'text-medium' : 'text-hard';
  return <span className={`text-[13px] font-medium ${c}`}>{DIFF_LABEL[d]}</span>;
}

export function StatusBox({ s, onClick, label }: { s: Status; onClick?: () => void; label: string }) {
  const done = s === 'done';
  const doing = s === 'doing';
  return (
    <button type="button" onClick={onClick} aria-label={label} aria-pressed={done} className="-m-2.5 grid h-11 w-11 shrink-0 place-items-center">
      <span className={`grid h-6 w-6 place-items-center rounded-md border transition-colors duration-150 ${
        done ? 'border-ok bg-ok text-page' : doing ? 'border-medium bg-medium/15' : 'border-line-strong hover:border-sub'
      }`}>
        {done && <Check size={14} strokeWidth={3} />}
        {doing && <span className="h-2 w-2 rounded-full bg-medium" />}
      </span>
    </button>
  );
}

export function Bar({ value, total, className = '' }: { value: number; total: number; className?: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-raised ${className}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-ok transition-[width] duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}
