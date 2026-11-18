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
  /** Key points; `ex` is a side-by-side example (default labels: ❌ Chưa tốt / ✅ Tốt hơn). */
  points: { t: string; d: string; ex?: { l: string; r: string; ll?: string; rl?: string } }[];
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

/* ───────── Visual learning (diagram · decision tree · comparison) ───────── */
export interface FlowNode {
  id: string;
  label: string;
  sub?: string;
  emoji: string;
  /** Centre position inside a 1200 × 440 canvas */
  x: number;
  y: number;
  side?: boolean;
  what: string;
  tip: string;
}
export interface FlowDiagram {
  title: string;
  nodes: FlowNode[];
  /** [from, to, label?, dashed?] */
  edges: [string, string, string?, boolean?][];
}
export type DecideNode = { q: string; opts: [string, string][] } | { answer: string; why: string; remember?: string };
export interface DecisionTree {
  title: string;
  start: string;
  nodes: Record<string, DecideNode>;
}
export interface Comparison {
  a: string;
  b: string;
  rows: [string, string, string][];
  rule: string;
}
export interface StageVisual {
  diagram: FlowDiagram;
  decide: DecisionTree;
  compare: Comparison[];
}
