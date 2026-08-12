import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Search, 
  HelpCircle, 
  Award, 
  Layers,
  Sparkles,
  Zap,
  ShieldAlert,
  Terminal,
  FileQuestion
} from 'lucide-react';
import { Lesson, UserProgress } from '../types';

interface SidebarProps {
  lessons: Lesson[];
  activeLessonId: string;
  onSelectLesson: (id: string) => void;
  progress: UserProgress;
  onOpenMockInterview: () => void;
  onOpenPromptLibrary: () => void;
  isDarkMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lessons,
  activeLessonId,
  onSelectLesson,
  progress,
  onOpenMockInterview,
  onOpenPromptLibrary,
  isDarkMode = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.levelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={`w-full lg:w-80 border-r flex flex-col h-[calc(100vh-61px)] sticky top-[61px] transition-colors ${
      isDarkMode 
        ? 'bg-[#111827] border-slate-800 text-slate-200' 
        : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Search Header */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3.5 top-2.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Tìm bài học, chủ đề AI QA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-xl pl-9 pr-3 py-1.5 text-xs transition-colors focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
              isDarkMode 
                ? 'bg-[#0B0F1A] border-slate-800 text-slate-200 placeholder-slate-500' 
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Progress Box & Fast Shortcuts */}
      <div className={`p-4 border-b space-y-3 ${
        isDarkMode ? 'border-slate-800/80 bg-[#0B0F1A]/50' : 'border-slate-200 bg-slate-50/70'
      }`}>
        <div className={`p-3 rounded-xl border ${
          isDarkMode 
            ? 'bg-indigo-600/10 border-indigo-500/30' 
            : 'bg-indigo-50 border-indigo-100'
        }`}>
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className={isDarkMode ? 'text-indigo-400' : 'text-indigo-700 font-semibold'}>Tiến độ Lộ trình QA</span>
            <span className={`font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {Math.round((progress.completedLessons.length / lessons.length) * 100)}%
            </span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-300" 
              style={{ width: `${(progress.completedLessons.length / lessons.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenPromptLibrary}
            className={`flex items-center gap-2 p-2 border rounded-xl text-xs font-semibold transition-all text-left ${
              isDarkMode 
                ? 'bg-slate-800/80 hover:bg-indigo-950/60 border-slate-700/80 hover:border-indigo-500/50 text-slate-200 hover:text-indigo-300' 
                : 'bg-white hover:bg-indigo-50 border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 shadow-sm'
            }`}
          >
            <Terminal className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="truncate">Prompt Library</span>
          </button>

          <button
            onClick={onOpenMockInterview}
            className={`flex items-center gap-2 p-2 border rounded-xl text-xs font-semibold transition-all text-left ${
              isDarkMode 
                ? 'bg-indigo-950/50 hover:bg-indigo-900/70 border-indigo-800/60 hover:border-indigo-500 text-indigo-200' 
                : 'bg-indigo-50/80 hover:bg-indigo-100 border-indigo-200 text-indigo-800 shadow-sm'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">Phỏng Vấn AI</span>
          </button>
        </div>
      </div>

      {/* Lesson Tree List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        <div className={`text-[10px] uppercase font-bold px-2 pt-1 pb-1 tracking-wider ${
          isDarkMode ? 'text-slate-500' : 'text-slate-400'
        }`}>
          Bài học hiện tại ({filteredLessons.length})
        </div>

        {filteredLessons.map((lesson) => {
          const isCompleted = progress.completedLessons.includes(lesson.id);
          const isActive = lesson.id === activeLessonId;

          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors border flex flex-col gap-1.5 relative group ${
                isActive
                  ? isDarkMode 
                    ? 'bg-slate-800 text-white border-slate-700 shadow-md' 
                    : 'bg-indigo-50 border-indigo-200 text-indigo-950 shadow-sm font-semibold'
                  : isDarkMode
                    ? 'bg-transparent hover:bg-slate-800/60 border-transparent text-slate-300'
                    : 'bg-transparent hover:bg-slate-100 border-transparent text-slate-700'
              }`}
            >
              {/* Level Badge Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold ${
                    isActive ? 'text-indigo-600' : isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    0{lesson.levelNumber}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>
                    {lesson.badgeText}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {lesson.estimatedMinutes}m
                  </span>

                  {isCompleted ? (
                    <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      isDarkMode 
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' 
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    }`}>
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Xong
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Title */}
              <h3 className={`text-xs ${
                isActive 
                  ? 'font-bold text-indigo-950' 
                  : isDarkMode 
                    ? 'text-slate-200 group-hover:text-white font-semibold' 
                    : 'text-slate-800 group-hover:text-slate-950 font-medium'
              }`}>
                {lesson.title}
              </h3>

              {/* Quiz indicator count */}
              <div className={`flex items-center justify-between pt-1 border-t text-[10px] ${
                isDarkMode ? 'border-slate-800/80 text-slate-500' : 'border-slate-200/80 text-slate-400'
              }`}>
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-indigo-600" />
                  {lesson.quizIds.length} Quiz • {lesson.essayIds.length} Tự luận
                </span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                  isActive ? 'text-indigo-600 translate-x-0.5' : isDarkMode ? 'text-slate-600' : 'text-slate-400 group-hover:translate-x-0.5'
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className={`p-4 border-t text-[11px] flex items-center justify-between ${
        isDarkMode ? 'border-slate-800 bg-[#0B0F1A]/80 text-slate-500' : 'border-slate-200 bg-slate-50 text-slate-500'
      }`}>
        <span>QA Senior Master</span>
        <span className="text-indigo-600 font-mono font-semibold">v2.5 AI</span>
      </div>
    </aside>
  );
};
