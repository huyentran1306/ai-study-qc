export type LabId = 'temperature' | 'prompt-magic' | 'prompt-6' | 'red-team' | 'confusion-matrix' | 'metamorphic' | 'bias' | 'dataset-constraint' | 'rag';

export interface StageQuiz {
  q: string;
  options: string[];
  a: number; // index of the correct option
  why: string;
}

export interface Stage {
  id: string;
  emoji: string;
  title: string;
  goal: string;
  duration: string;
  /** One everyday analogy a total beginner gets instantly */
  analogy: string;
  /** A ready-to-copy prompt the learner can use at work today */
  tryNow: { label: string; prompt: string };
  points: { t: string; d: string }[];
  lab: LabId;
  extraLabs?: LabId[];
  istqb: string;
  quiz: StageQuiz[];
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: 'Strategy' | 'Playwright UI' | 'API CRUD' | 'Reviewer';
  description: string;
  fullPrompt: string;
  usageNotes: string;
}

export interface UserProgress {
  doneStages: string[];
  quizScores: Record<string, number>; // stageId -> correct answers
}
