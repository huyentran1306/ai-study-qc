import React, { useState, useEffect } from 'react';
import { LESSONS } from './data/lessonsData';
import { QUIZ_QUESTIONS } from './data/quizData';
import { PROMPT_TEMPLATES } from './data/promptLibraryData';
import { UserProgress } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LessonView } from './components/LessonView';
import { QuizModal } from './components/QuizModal';
import { InterviewPrepView } from './components/InterviewPrepView';
import { PromptLibrary } from './components/PromptLibrary';
import { Sparkles, Menu, X, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeLessonId, setActiveLessonId] = useState<string>(LESSONS[0].id);
  const [activeQuizLessonId, setActiveQuizLessonId] = useState<string | null>(null);
  const [showInterviewPrep, setShowInterviewPrep] = useState<boolean>(false);
  const [showPromptLibraryModal, setShowPromptLibraryModal] = useState<boolean>(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);

  // User Progress persisted in localStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('ai_qa_mastery_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading user progress:', e);
      }
    }
    return {
      completedLessons: [],
      quizScores: {},
      essaySubmissions: {},
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      bookmarks: []
    };
  });

  // Save progress on update
  useEffect(() => {
    localStorage.setItem('ai_qa_mastery_progress', JSON.stringify(progress));
  }, [progress]);

  // Current lesson instance
  const currentLessonIndex = LESSONS.findIndex(l => l.id === activeLessonId);
  const currentLesson = LESSONS[currentLessonIndex] || LESSONS[0];

  const handleToggleBookmark = (lessonId: string) => {
    setProgress(prev => {
      const exists = prev.bookmarks.includes(lessonId);
      const newBookmarks = exists 
        ? prev.bookmarks.filter(id => id !== lessonId)
        : [...prev.bookmarks, lessonId];
      return { ...prev, bookmarks: newBookmarks };
    });
  };

  const handleMarkCompleted = (lessonId: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId]
      };
    });
  };

  const handleCompleteQuiz = (score: number, total: number) => {
    if (!activeQuizLessonId) return;
    setProgress(prev => ({
      ...prev,
      quizScores: { ...prev.quizScores, [activeQuizLessonId]: score },
      completedLessons: prev.completedLessons.includes(activeQuizLessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, activeQuizLessonId]
    }));
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < LESSONS.length - 1) {
      setActiveLessonId(LESSONS[currentLessonIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setActiveLessonId(LESSONS[currentLessonIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get quizzes for current active quiz lesson
  const activeQuizQuestions = activeQuizLessonId 
    ? QUIZ_QUESTIONS.filter(q => q.lessonId === activeQuizLessonId)
    : [];

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white flex flex-col transition-colors ${
      isDarkMode ? 'bg-[#0B0F1A] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Navbar */}
      <Navbar
        progress={progress}
        totalLessons={LESSONS.length}
        completedCount={progress.completedLessons.length}
        onOpenInterviewPrep={() => setShowInterviewPrep(true)}
        onOpenBookmarks={() => {
          if (progress.bookmarks.length > 0) {
            setActiveLessonId(progress.bookmarks[0]);
          } else {
            alert('Bạn chưa lưu bài học nào! Hãy bấm "Lưu Bài Học" ở bất kỳ bài nào.');
          }
        }}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Mobile Toggle Button */}
        <div className={`lg:hidden p-3 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className={`px-3 py-1.5 border rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
              isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {showMobileSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>{showMobileSidebar ? 'Đóng Danh Sách' : 'Xem Danh Sách Bài Học'}</span>
          </button>

          <span className="text-xs font-medium text-indigo-600">
            {currentLesson.title}
          </span>
        </div>

        {/* Sidebar Navigation */}
        <div className={`${showMobileSidebar ? 'block' : 'hidden'} lg:block`}>
          <Sidebar
            lessons={LESSONS}
            activeLessonId={activeLessonId}
            onSelectLesson={(id) => {
              setActiveLessonId(id);
              setShowMobileSidebar(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            progress={progress}
            onOpenMockInterview={() => setShowInterviewPrep(true)}
            onOpenPromptLibrary={() => setShowPromptLibraryModal(true)}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Lesson Content Area */}
        <main className={`flex-1 overflow-y-auto ${
          isDarkMode ? 'bg-[#0F172A]' : 'bg-slate-50'
        }`}>
          {showPromptLibraryModal ? (
            <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
              <div className={`flex items-center justify-between border-b pb-4 ${
                isDarkMode ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Thư Viện Prompt Sản Xuất Senior QA</h2>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Tất cả Prompt mẫu thực chiến đã qua kiểm chứng cho Test Strategy, Playwright UI, API CRUD & Reviewer</p>
                </div>

                <button
                  onClick={() => setShowPromptLibraryModal(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  Trở Về Bài Học
                </button>
              </div>

              <PromptLibrary isDarkMode={isDarkMode} />
            </div>
          ) : (
            <LessonView
              lesson={currentLesson}
              progress={progress}
              onToggleBookmark={handleToggleBookmark}
              onMarkCompleted={handleMarkCompleted}
              onOpenQuiz={(id) => setActiveQuizLessonId(id)}
              onNextLesson={handleNextLesson}
              onPrevLesson={handlePrevLesson}
              hasPrev={currentLessonIndex > 0}
              hasNext={currentLessonIndex < LESSONS.length - 1}
              isDarkMode={isDarkMode}
            />
          )}
        </main>
      </div>

      {/* Quiz Modal */}
      {activeQuizLessonId && (
        <QuizModal
          questions={activeQuizQuestions}
          lessonTitle={LESSONS.find(l => l.id === activeQuizLessonId)?.title || ''}
          onCompleteQuiz={handleCompleteQuiz}
          onClose={() => setActiveQuizLessonId(null)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Interview Prep Modal */}
      {showInterviewPrep && (
        <InterviewPrepView onClose={() => setShowInterviewPrep(false)} isDarkMode={isDarkMode} />
      )}
    </div>
  );
}
