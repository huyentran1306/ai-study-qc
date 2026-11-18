import type React from 'react';

/** Each stage gets its own accent pair so lessons feel distinct. Used via CSS vars --ac / --ac2. */
const THEMES: Record<string, [string, string]> = {
  'stage-1': ['#10b981', '#0ea5e9'],
  'stage-2': ['#6366f1', '#a855f7'],
  'stage-3': ['#f43f5e', '#f97316'],
  'stage-4': ['#0ea5e9', '#6366f1'],
  'stage-5': ['#8b5cf6', '#ec4899'],
  'stage-6': ['#f59e0b', '#ef4444'],
};

export const stageVars = (id: string) => {
  const [a, b] = THEMES[id] ?? THEMES['stage-2'];
  return { '--ac': a, '--ac2': b } as React.CSSProperties;
};
