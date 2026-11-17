import React from 'react';

interface LabShellProps {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
}

/** Common frame for every interactive lab so they look consistent inside lessons and on /labs. */
export const LabShell: React.FC<LabShellProps> = ({ icon, title, subtitle, badge, children }) => (
  <div className="mt-4 rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/40 p-4 shadow-sm dark:border-indigo-500/20 dark:from-indigo-950/30 dark:via-slate-950 dark:to-violet-950/20 lg:p-5">
    <div className="mb-4 flex flex-wrap items-start justify-between gap-2 border-b border-indigo-100 pb-3 dark:border-indigo-500/20">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-200 bg-white text-lg shadow-sm dark:border-indigo-500/30 dark:bg-slate-900">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
          {subtitle && <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {badge && (
        <span className="chip border-indigo-200 bg-indigo-100 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300">
          {badge}
        </span>
      )}
    </div>
    <div className="text-xs text-slate-700 dark:text-slate-300">{children}</div>
  </div>
);

export const Stat: React.FC<{ label: string; value: string; hint?: string; tone?: 'indigo' | 'emerald' | 'amber' | 'rose' }> = ({
  label,
  value,
  hint,
  tone = 'indigo',
}) => {
  const tones = {
    indigo: 'text-indigo-700 dark:text-indigo-300',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    amber: 'text-amber-700 dark:text-amber-300',
    rose: 'text-rose-700 dark:text-rose-300',
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-1 font-mono text-xl font-bold ${tones[tone]}`}>{value}</div>
      {hint && <div className="mt-0.5 font-mono text-[10px] text-slate-400">{hint}</div>}
    </div>
  );
};
