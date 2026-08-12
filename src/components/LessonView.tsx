import React, { useState } from 'react';
import { 
  CheckCircle, 
  HelpCircle, 
  FileText, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Zap, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft,
  Share2
} from 'lucide-react';
import { Lesson, UserProgress } from '../types';
import { TokenizerSimulator } from './TokenizerSimulator';
import { CAREBuilder } from './CAREBuilder';
import { SdlcFlowDiagram } from './SdlcFlowDiagram';
import { RiskMatrixTool } from './RiskMatrixTool';
import { PromptLibrary } from './PromptLibrary';
import { EssayEvaluator } from './EssayEvaluator';
import { ESSAY_QUESTIONS } from '../data/essayData';
import { CuteMarkdownRenderer } from './CuteMarkdownRenderer';

interface LessonViewProps {
  lesson: Lesson;
  progress: UserProgress;
  onToggleBookmark: (lessonId: string) => void;
  onMarkCompleted: (lessonId: string) => void;
  onOpenQuiz: (lessonId: string) => void;
  onNextLesson: () => void;
  onPrevLesson: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isDarkMode?: boolean;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  progress,
  onToggleBookmark,
  onMarkCompleted,
  onOpenQuiz,
  onNextLesson,
  onPrevLesson,
  hasPrev,
  hasNext,
  isDarkMode = false
}) => {
  const isBookmarked = progress.bookmarks.includes(lesson.id);
  const isCompleted = progress.completedLessons.includes(lesson.id);

  // Filter essays related to this lesson
  const relatedEssays = ESSAY_QUESTIONS.filter(e => e.lessonId === lesson.id);

  return (
    <div className={`max-w-4xl mx-auto p-4 lg:p-8 space-y-8 animate-fadeIn ${
      isDarkMode ? 'text-slate-200' : 'text-slate-800'
    }`}>
      
      {/* Header Banner */}
      <div className={`border rounded-2xl p-6 lg:p-8 space-y-5 shadow-sm relative overflow-hidden transition-colors ${
        isDarkMode ? 'bg-[#111827] border-slate-800 shadow-xl' : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider border ${
            isDarkMode ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'
          }`}>
            {lesson.badgeText}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(lesson.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isBookmarked
                  ? isDarkMode ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-800'
                  : isDarkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-500" /> : <Bookmark className="w-4 h-4" />}
              <span>{isBookmarked ? 'Đã Lưu' : 'Lưu Bài Học'}</span>
            </button>

            <button
              onClick={() => onMarkCompleted(lesson.id)}
              className={`px-4 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                isCompleted
                  ? isDarkMode ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCompleted ? 'Đã Hoàn Thành' : 'Đánh Dấu Hoàn Thành'}</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold tracking-tight leading-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {lesson.title}
          </h1>
          <p className={`text-xs lg:text-sm mt-2 leading-relaxed ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {lesson.description}
          </p>
        </div>

        {/* Quick Quiz CTA bar */}
        <div className={`pt-4 border-t flex items-center justify-between flex-wrap gap-3 text-xs ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className={`flex items-center gap-4 font-mono ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <span>⏱️ {lesson.estimatedMinutes}m</span>
            <span>📝 {lesson.quizIds.length} Quiz questions</span>
          </div>

          <button
            onClick={() => onOpenQuiz(lesson.id)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>Làm Bài Trắc Nghiệm Tương Tác</span>
          </button>
        </div>
      </div>

      {/* Lesson Sections Content */}
      <div className="space-y-6">
        {lesson.sections.map((section, idx) => (
          <div key={section.id} className={`border rounded-2xl p-6 lg:p-7 space-y-4 shadow-sm transition-colors ${
            isDarkMode ? 'bg-[#111827] border-slate-800 shadow-lg' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-base lg:text-lg font-bold flex items-center gap-2.5 border-b pb-3 ${
              isDarkMode ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'
            }`}>
              <span className={`w-6 h-6 rounded font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                isDarkMode ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' : 'bg-indigo-100 border-indigo-200 text-indigo-700'
              }`}>
                0{idx + 1}
              </span>
              <span>{section.title}</span>
            </h2>

            {/* Markdown Body */}
            <div className="max-w-none">
              <CuteMarkdownRenderer content={section.contentMarkdown} isDarkMode={isDarkMode} />
            </div>

            {/* Key Takeaway Banner */}
            {section.keyTakeaway && (
              <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 border shadow-2xs transition-all ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-amber-950/20 via-slate-900 to-indigo-950/20 border-amber-500/30 text-amber-200' 
                  : 'bg-gradient-to-r from-amber-50/80 via-white to-indigo-50/80 border-amber-200 text-amber-950'
              }`}>
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-sm shadow-2xs mt-0.5">
                  💡
                </div>
                <div>
                  <strong className={isDarkMode ? 'text-amber-400 font-bold block text-xs mb-0.5' : 'text-amber-900 font-bold block text-xs mb-0.5'}>
                    🌟 Bí Kíp Khâu Rút Kinh Nghiệm Senior QA:
                  </strong>
                  <p className={`leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{section.keyTakeaway}</p>
                </div>
              </div>
            )}

            {/* Bad vs Good Real World Example */}
            {section.realWorldExample && (
              <div className={`border rounded-2xl p-4 lg:p-5 space-y-3.5 text-xs shadow-2xs transition-all ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50/80 border-slate-200/90'
              }`}>
                <div className={`flex items-center gap-2 border-b pb-2.5 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <span className="text-base">🐱</span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-indigo-300' : 'text-indigo-900'
                  }`}>
                    Góc Tình Huống Thực Tế: {section.realWorldExample.scenario}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`p-3.5 border rounded-xl space-y-1.5 transition-transform hover:-translate-y-0.5 ${
                    isDarkMode 
                      ? 'bg-rose-950/20 border-rose-800/40 text-rose-200' 
                      : 'bg-rose-50/80 border-rose-200 text-rose-950 shadow-2xs'
                  }`}>
                    <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                      <span>❌</span> Cách Tiếp Cận Cần Tránh:
                    </span>
                    <p className="leading-relaxed">{section.realWorldExample.badApproach}</p>
                  </div>

                  <div className={`p-3.5 border rounded-xl space-y-1.5 transition-transform hover:-translate-y-0.5 ${
                    isDarkMode 
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' 
                      : 'bg-emerald-50/80 border-emerald-200 text-emerald-950 shadow-2xs'
                  }`}>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                      <span>✅</span> Cách Tiếp Cận Chuẩn Senior QA:
                    </span>
                    <p className="leading-relaxed">{section.realWorldExample.goodApproach}</p>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
                  isDarkMode ? 'bg-indigo-950/30 border-indigo-800/40 text-indigo-300' : 'bg-indigo-50/80 border-indigo-100 text-indigo-900'
                }`}>
                  <span className="text-sm shrink-0">💡</span>
                  <div>
                    <strong>Phân tích từ Mascot QA:</strong> {section.realWorldExample.explanation}
                  </div>
                </div>
              </div>
            )}

            {/* Embedded Interactive Components */}
            {section.interactiveComponent === 'tokenizer' && <TokenizerSimulator isDarkMode={isDarkMode} />}
            {section.interactiveComponent === 'care-builder' && <CAREBuilder isDarkMode={isDarkMode} />}
            {section.interactiveComponent === 'sdlc-flow' && <SdlcFlowDiagram isDarkMode={isDarkMode} />}
            {section.interactiveComponent === 'risk-matrix' && <RiskMatrixTool isDarkMode={isDarkMode} />}
            {section.interactiveComponent === 'prompt-library' && <PromptLibrary isDarkMode={isDarkMode} />}
          </div>
        ))}
      </div>

      {/* Essay Assessment Exercises Section */}
      {relatedEssays.length > 0 && (
        <div className={`pt-6 border-t space-y-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className={`font-bold text-base ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Bài Tập Tự Luận & Thực Hành Phỏng Vấn AI
            </h3>
          </div>

          {relatedEssays.map(essay => (
            <EssayEvaluator key={essay.id} essay={essay} isDarkMode={isDarkMode} />
          ))}
        </div>
      )}

      {/* Navigation Prev / Next Footer */}
      <div className={`flex items-center justify-between pt-6 border-t text-xs ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          onClick={onPrevLesson}
          disabled={!hasPrev}
          className={`px-4 py-2 disabled:opacity-40 border rounded-xl transition-all flex items-center gap-1.5 font-medium ${
            isDarkMode 
              ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' 
              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Bài Trước</span>
        </button>

        <button
          onClick={() => onOpenQuiz(lesson.id)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
        >
          <HelpCircle className="w-4 h-4 text-amber-300" />
          <span>Thực Hành Quiz ({lesson.quizIds.length} câu)</span>
        </button>

        <button
          onClick={onNextLesson}
          disabled={!hasNext}
          className={`px-4 py-2 disabled:opacity-40 border rounded-xl transition-all flex items-center gap-1.5 font-medium ${
            isDarkMode 
              ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' 
              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
          }`}
        >
          <span>Bài Tiếp</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
