export type LevelId = 
  | 'level-1' 
  | 'level-2' 
  | 'level-3' 
  | 'level-4' 
  | 'level-5' 
  | 'level-6' 
  | 'level-7';

export interface LessonSection {
  id: string;
  title: string;
  contentMarkdown: string;
  keyTakeaway?: string;
  realWorldExample?: {
    scenario: string;
    badApproach: string;
    goodApproach: string;
    explanation: string;
  };
  interactiveComponent?: 'tokenizer' | 'care-builder' | 'sdlc-flow' | 'risk-matrix' | 'prompt-library';
}

export interface Lesson {
  id: string;
  levelId: LevelId;
  levelNumber: number;
  levelName: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  badgeText: string;
  sections: LessonSection[];
  quizIds: string[];
  essayIds: string[];
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  seniorTip?: string;
}

export interface EssayQuestion {
  id: string;
  lessonId: string;
  title: string;
  scenario: string;
  expectedKeyPoints: string[];
  sampleSeniorAnswer: string;
}

export interface CarePromptParts {
  context: string;
  action: string;
  rules: string;
  example: string;
  sourceOfTruth: string;
  coverage: string;
  evidence: string;
  stopCondition: string;
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
  completedLessons: string[];
  quizScores: Record<string, number>; // quizId -> score (1 or 0)
  essaySubmissions: Record<string, { answer: string; score?: number; feedback?: string }>;
  streakDays: number;
  lastActiveDate: string;
  bookmarks: string[];
}
