import React from 'react';
import { 
  CheckCircle2, 
  Flame, 
  Bookmark, 
  Award,
  Sun,
  Moon
} from 'lucide-react';
import { UserProgress } from '../types';

interface NavbarProps {
  progress: UserProgress;
  totalLessons: number;
  completedCount: number;
  onOpenInterviewPrep: () => void;
  onOpenBookmarks: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  totalLessons,
  completedCount,
  onOpenInterviewPrep,
  onOpenBookmarks,
  isDarkMode,
  onToggleTheme
}) => {
  const percent = Math.round((completedCount / totalLessons) * 100) || 0;

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
      isDarkMode 
        ? 'bg-[#0F172A]/90 border-slate-800/90 text-slate-100' 
        : 'bg-white/90 border-slate-200/90 text-slate-900 shadow-sm'
    } px-4 lg:px-8 py-3`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30 shrink-0">
            QA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-bold text-base md:text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                AI Mastery for Senior QA
              </h1>
              <span className={`hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded border ${
                isDarkMode 
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                  : 'bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}>
                Interview Ready
              </span>
            </div>
            <p className={`text-xs hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Lộ trình học AI Testing toàn diện từ căn bản tới Senior Test Architect
            </p>
          </div>
        </div>

        {/* Middle Progress Stats */}
        <div className={`hidden md:flex items-center gap-6 border rounded-full px-5 py-2 text-xs ${
          isDarkMode 
            ? 'bg-[#0B0F1A] border-slate-800' 
            : 'bg-slate-100/90 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Tiến độ:</span>
            <span className="font-bold text-emerald-600 font-mono">{completedCount}/{totalLessons} bài</span>
          </div>

          <div className={`w-28 rounded-full h-1.5 overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-amber-600 font-semibold font-mono text-xs">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Streak: {progress.streakDays}d</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg border transition-all text-xs font-semibold flex items-center gap-1.5 ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title={isDarkMode ? "Chuyển sang Giao diện Sáng (Light Mode)" : "Chuyển sang Giao diện Tối (Dark Mode)"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            <span className="hidden sm:inline text-xs">{isDarkMode ? 'Giao diện Sáng' : 'Light Mode'}</span>
          </button>

          <button
            onClick={onOpenBookmarks}
            className={`p-2 rounded-lg border transition-all text-xs font-semibold flex items-center gap-1.5 ${
              isDarkMode 
                ? 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border-slate-700/80' 
                : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}
            title="Xem bài học đã lưu"
          >
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Đã lưu ({progress.bookmarks.length})</span>
          </button>

          <button
            onClick={onOpenInterviewPrep}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Bí Kíp Phỏng Vấn (60s)</span>
          </button>
        </div>
      </div>
    </header>
  );
};

