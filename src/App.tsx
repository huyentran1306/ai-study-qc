import React, { useEffect, useState } from 'react';
import { useRoute, navigate } from './lib/router';
import { useProgress } from './lib/progress';
import { AppHeader } from './views/AppHeader';
import { LabsView, RoadmapView, StageView } from './views/Roadmap';
import { PromptLibrary } from './components/PromptLibrary';
import { InterviewPrepView } from './components/InterviewPrepView';

const THEME_KEY = 'ai_qa_theme';

export default function App() {
  const route = useRoute();
  const api = useProgress();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved ? saved === 'dark' : window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  let page: React.ReactNode;
  switch (route.name) {
    case 'stage':
      page = <StageView key={route.id} stageId={route.id} api={api} />;
      break;
    case 'labs':
      page = <LabsView />;
      break;
    case 'lab':
      page = <LabsView key={route.id} labId={route.id} />;
      break;
    case 'prompts':
      page = (
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-8 animate-fadeIn">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">🪄 Prompt mẫu cho QA</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Copy, điền dữ liệu dự án của bạn, và luôn kiểm chứng kết quả.</p>
          </div>
          <PromptLibrary isDarkMode={isDarkMode} />
        </div>
      );
      break;
    case 'interview':
      page = <InterviewPrepView onClose={() => navigate('stage/stage-6')} isDarkMode={isDarkMode} />;
      break;
    default:
      page = <RoadmapView api={api} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors selection:bg-indigo-500 selection:text-white dark:bg-[#0B0F1A] dark:text-slate-100">
      <AppHeader route={route} progress={api.progress} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((d) => !d)} />
      <main>{page}</main>
    </div>
  );
}
