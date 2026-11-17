import { useEffect, useState } from 'react';
import { UserProgress } from '../types';

const KEY = 'ai_tester_roadmap_progress';
const empty = (): UserProgress => ({ doneStages: [], quizScores: {} });

const load = (): UserProgress => {
  try {
    return { ...empty(), ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return empty();
  }
};

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(load);
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(progress)), [progress]);

  const toggleDone = (id: string) =>
    setProgress((p) => ({
      ...p,
      doneStages: p.doneStages.includes(id) ? p.doneStages.filter((s) => s !== id) : [...p.doneStages, id],
    }));

  const saveQuiz = (id: string, score: number) =>
    setProgress((p) => ({ ...p, quizScores: { ...p.quizScores, [id]: score } }));

  const reset = () => setProgress(empty());

  return { progress, toggleDone, saveQuiz, reset };
};

export type ProgressApi = ReturnType<typeof useProgress>;
