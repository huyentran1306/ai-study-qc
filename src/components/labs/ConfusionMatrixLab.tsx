import React, { useMemo, useState } from 'react';
import { LabShell, Stat } from './LabShell';

type Metric = 'accuracy' | 'precision' | 'recall' | 'f1';
const METRIC_LABEL: Record<Metric, string> = { accuracy: 'Accuracy', precision: 'Precision', recall: 'Recall', f1: 'F1-score' };

const compute = (tp: number, fp: number, fn: number, tn: number) => {
  const total = tp + fp + fn + tn;
  const accuracy = total ? (tp + tn) / total : 0;
  const precision = tp + fp ? tp / (tp + fp) : 0;
  const recall = tp + fn ? tp / (tp + fn) : 0;
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
  return { accuracy, precision, recall, f1 };
};

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const SCENARIOS = [
  'Model phát hiện email phishing',
  'Model dự đoán module có defect',
  'Model nhận diện biển báo STOP',
  'Model phát hiện giao dịch gian lận',
  'Model phân loại ticket là “Critical”',
];

export const ConfusionMatrixLab: React.FC = () => {
  const [m, setM] = useState({ tp: 40, fp: 10, fn: 20, tn: 130 });
  const r = useMemo(() => compute(m.tp, m.fp, m.fn, m.tn), [m]);

  // Practice mode
  const [quiz, setQuiz] = useState<null | { tp: number; fp: number; fn: number; tn: number; metric: Metric; swapped: boolean; scenario: string }>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<null | { ok: boolean; text: string }>(null);
  const [streak, setStreak] = useState(0);

  const newQuiz = () => {
    const metrics: Metric[] = ['accuracy', 'precision', 'recall', 'f1'];
    setQuiz({
      tp: rnd(10, 90), fp: rnd(2, 40), fn: rnd(2, 40), tn: rnd(30, 200),
      metric: metrics[rnd(0, 3)],
      swapped: Math.random() < 0.4,
      scenario: SCENARIOS[rnd(0, SCENARIOS.length - 1)],
    });
    setAnswer('');
    setFeedback(null);
  };

  const check = () => {
    if (!quiz) return;
    const truth = compute(quiz.tp, quiz.fp, quiz.fn, quiz.tn)[quiz.metric] * 100;
    const val = parseFloat(answer.replace(',', '.'));
    if (Number.isNaN(val)) return;
    const ok = Math.abs(val - truth) <= 0.6;
    setStreak((s) => (ok ? s + 1 : 0));
    const f = {
      accuracy: `(TP+TN)/Tổng = (${quiz.tp}+${quiz.tn})/${quiz.tp + quiz.fp + quiz.fn + quiz.tn}`,
      precision: `TP/(TP+FP) = ${quiz.tp}/(${quiz.tp}+${quiz.fp})`,
      recall: `TP/(TP+FN) = ${quiz.tp}/(${quiz.tp}+${quiz.fn})`,
      f1: `2PR/(P+R) với P=${pct(compute(quiz.tp, quiz.fp, quiz.fn, quiz.tn).precision)}, R=${pct(compute(quiz.tp, quiz.fp, quiz.fn, quiz.tn).recall)}`,
    }[quiz.metric];
    setFeedback({ ok, text: `${ok ? '✅ Chính xác!' : '❌ Chưa đúng.'} ${METRIC_LABEL[quiz.metric]} = ${f} = ${truth.toFixed(1)}%` });
  };

  const cell = (key: keyof typeof m, label: string, tone: string) => (
    <label className={`flex flex-col gap-1 rounded-xl border p-3 ${tone}`}>
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      <input
        type="number"
        min={0}
        value={m[key]}
        onChange={(e) => setM({ ...m, [key]: Math.max(0, parseInt(e.target.value || '0', 10)) })}
        className="w-full rounded-lg border border-black/10 bg-white/80 px-2 py-1 font-mono text-lg font-bold outline-none dark:border-white/10 dark:bg-slate-900/80"
      />
    </label>
  );

  // Practice matrix render (rows/cols possibly swapped, like real exam questions)
  const PracticeMatrix = () => {
    if (!quiz) return null;
    const { tp, fp, fn, tn, swapped } = quiz;
    const rowA = swapped ? 'Thực tế Positive' : 'Dự đoán Positive';
    const rowB = swapped ? 'Thực tế Negative' : 'Dự đoán Negative';
    const colA = swapped ? 'Dự đoán Positive' : 'Thực tế Positive';
    const colB = swapped ? 'Dự đoán Negative' : 'Thực tế Negative';
    // Normal: [ [TP, FP], [FN, TN] ]  Swapped (actual rows): [ [TP, FN], [FP, TN] ]
    const grid = swapped ? [[tp, fn], [fp, tn]] : [[tp, fp], [fn, tn]];
    return (
      <table className="w-full border-collapse overflow-hidden rounded-xl text-center font-mono text-xs">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800">
            <th className="p-2" />
            <th className="p-2">{colA}</th>
            <th className="p-2">{colB}</th>
          </tr>
        </thead>
        <tbody>
          {[rowA, rowB].map((row, i) => (
            <tr key={row} className="border-t border-slate-200 dark:border-slate-800">
              <th className="bg-slate-100 p-2 dark:bg-slate-800">{row}</th>
              <td className="p-2 text-base font-bold">{grid[i][0]}</td>
              <td className="p-2 text-base font-bold">{grid[i][1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <LabShell icon="🧮" title="Confusion Matrix Lab" subtitle="Nhập 4 ô để thấy các metric thay đổi, rồi tự luyện với đề ngẫu nhiên." badge="CT-AI 3.3.1">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 grid grid-cols-[auto_1fr_1fr] items-center gap-2 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
            <span />
            <span>Thực tế Positive</span>
            <span>Thực tế Negative</span>
          </div>
          <div className="grid grid-cols-[auto_1fr_1fr] items-stretch gap-2">
            <span className="flex items-center text-xs font-bold uppercase text-slate-500 [writing-mode:vertical-rl] rotate-180">Dự đoán +</span>
            {cell('tp', 'TP', 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300')}
            {cell('fp', 'FP (báo nhầm)', 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300')}
            <span className="flex items-center text-xs font-bold uppercase text-slate-500 [writing-mode:vertical-rl] rotate-180">Dự đoán −</span>
            {cell('fn', 'FN (bỏ sót)', 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300')}
            {cell('tn', 'TN', 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300')}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Accuracy" value={pct(r.accuracy)} hint="(TP+TN)/Tổng" />
          <Stat label="Precision" value={pct(r.precision)} hint="TP/(TP+FP)" tone="amber" />
          <Stat label="Recall" value={pct(r.recall)} hint="TP/(TP+FN)" tone="rose" />
          <Stat label="F1-score" value={pct(r.f1)} hint="2PR/(P+R)" tone="emerald" />
          <p className="col-span-2 rounded-xl bg-white/70 p-2 text-xs leading-relaxed dark:bg-slate-900/70">
            💡 Thử đặt TP=0, FP=0, FN=10, TN=990: accuracy 99% nhưng recall 0% — bẫy <b>class imbalance</b>.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-indigo-300 p-3 dark:border-indigo-500/40">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold">🎯 Tự luyện tính {streak > 0 && <span className="text-emerald-600">· chuỗi đúng {streak} 🔥</span>}</span>
          <button className="btn-primary" onClick={newQuiz}>{quiz ? 'Đề khác' : 'Bắt đầu luyện'}</button>
        </div>
        {quiz && (
          <div className="mt-3 space-y-3">
            <p>
              <b>{quiz.scenario}</b> có kết quả như bảng. Tính <b className="text-indigo-600 dark:text-indigo-300">{METRIC_LABEL[quiz.metric]}</b> (đơn vị %, làm tròn 1 chữ số).
              {quiz.swapped && <span className="ml-1 text-amber-600">⚠️ Chú ý trục bảng!</span>}
            </p>
            <PracticeMatrix />
            <div className="flex gap-2">
              <input className="input max-w-[160px]" placeholder="vd. 72.7" value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && check()} />
              <button className="btn-ghost" onClick={check}>Kiểm tra</button>
            </div>
            {feedback && (
              <p className={`rounded-lg p-2 font-mono text-xs ${feedback.ok ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300'}`}>
                {feedback.text}
              </p>
            )}
          </div>
        )}
      </div>
    </LabShell>
  );
};
