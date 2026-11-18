import React from 'react';
import { Brain, Moon, Sun } from 'lucide-react';
import { Route, href } from '../lib/router';
import { ROADMAP } from '../data/roadmap';
import { UserProgress } from '../types';

interface Props {
  route: Route;
  progress: UserProgress;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const NAV = [
  { to: '', label: 'Lộ trình', match: ['home', 'stage'] },
  { to: 'labs', label: 'Thực hành', match: ['labs', 'lab'] },
  { to: 'prompts', label: 'Prompt mẫu', match: ['prompts'] },
];

export const AppHeader: React.FC<Props> = ({ route, progress, isDarkMode, onToggleTheme }) => {
  const done = new Set(progress.doneStages);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-[#0B0F1A]/85">
      <div className="flex h-14 w-full items-center gap-2 px-4 sm:px-6 lg:px-10 xl:px-14">
        <a href={href('')} className="mr-2 flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30">
            <Brain className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-extrabold tracking-tight text-slate-900 sm:inline dark:text-white">AI cho Tester</span>
        </a>
        <nav className="flex items-center gap-1">
          {NAV.map((n) => (
            <a
              key={n.to}
              href={href(n.to)}
              className={`whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-semibold sm:px-3 sm:text-sm transition ${
                n.match.includes(route.name)
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex" title={`${done.size}/${ROADMAP.length} chặng đã xong`}>
            {ROADMAP.map((s, i) => (
              <a
                key={s.id}
                href={href(`stage/${s.id}`)}
                className={`h-2 w-5 rounded-full ${done.has(s.id) ? 'bg-emerald-500' : route.name === 'stage' && route.id === s.id ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                title={`Chặng ${i + 1}: ${s.title}`}
              />
            ))}
          </div>
          <button onClick={onToggleTheme} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" title="Đổi giao diện sáng/tối">
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
