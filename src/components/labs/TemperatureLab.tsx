import React, { useMemo, useState } from 'react';
import { LabShell } from './LabShell';

const PROMPTS = [
  {
    prompt: 'Test case cho form đăng nhập nên kiểm tra mật khẩu ...',
    logits: { 'sai': 4.2, 'trống': 3.6, 'quá ngắn': 3.1, 'có khoảng trắng': 2.2, 'chứa emoji': 1.4, 'bằng tiếng Klingon': -0.5, 'của Tổng thống': -1.5 },
  },
  {
    prompt: 'Nguyên nhân phổ biến nhất của flaky test là ...',
    logits: { 'timing/race condition': 4.5, 'dữ liệu dùng chung': 3.4, 'môi trường không ổn định': 3.0, 'thứ tự chạy test': 2.6, 'locator động': 2.1, 'trăng tròn': -1.0, 'con mèo đi qua bàn phím': -1.8 },
  },
];

const softmax = (logits: number[], t: number) => {
  const temp = Math.max(t, 0.01);
  const scaled = logits.map((l) => l / temp);
  const max = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
};

export const TemperatureLab: React.FC = () => {
  const [pi, setPi] = useState(0);
  const [t, setT] = useState(0.7);
  const [topP, setTopP] = useState(1);
  const [samples, setSamples] = useState<string[]>([]);

  const { tokens, probs, kept } = useMemo(() => {
    const entries = Object.entries(PROMPTS[pi].logits);
    const tokens = entries.map(([k]) => k);
    const probs = softmax(entries.map(([, v]) => v), t);
    // nucleus (top-p) filtering
    const order = probs.map((p, i) => [p, i] as const).sort((a, b) => b[0] - a[0]);
    const kept = new Set<number>();
    let acc = 0;
    for (const [p, i] of order) {
      kept.add(i);
      acc += p;
      if (acc >= topP) break;
    }
    return { tokens, probs, kept };
  }, [pi, t, topP]);

  const sample = (count: number) => {
    const idx = [...kept];
    const total = idx.reduce((s, i) => s + probs[i], 0);
    const out: string[] = [];
    for (let k = 0; k < count; k++) {
      let r = Math.random() * total;
      for (const i of idx) {
        r -= probs[i];
        if (r <= 0) { out.push(tokens[i]); break; }
      }
    }
    setSamples(out);
  };

  const distinct = new Set(samples).size;

  return (
    <LabShell icon="🌡️" title="Temperature & Top-p Playground" subtitle="Mô phỏng phân phối xác suất token kế tiếp. Kéo temperature để thấy vì sao cùng prompt lại cho kết quả khác nhau." badge="CT-GenAI 1.1.2 · 3.1.4">
      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((p, i) => (
          <button key={i} onClick={() => { setPi(i); setSamples([]); }} className={i === pi ? 'btn-primary' : 'btn-ghost'}>
            Prompt {i + 1}
          </button>
        ))}
      </div>
      <p className="mt-3 rounded-xl bg-slate-900 p-3 font-mono text-[11px] text-emerald-300">› {PROMPTS[pi].prompt}<span className="animate-pulse">▌</span></p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label>Temperature: <b className="font-mono">{t.toFixed(2)}</b>
          <input type="range" min={0} max={2} step={0.05} value={t} onChange={(e) => setT(+e.target.value)} className="w-full accent-indigo-600" />
        </label>
        <label>Top-p (nucleus): <b className="font-mono">{topP.toFixed(2)}</b>
          <input type="range" min={0.1} max={1} step={0.05} value={topP} onChange={(e) => setTopP(+e.target.value)} className="w-full accent-violet-600" />
        </label>
      </div>

      <div className="mt-3 space-y-1.5">
        {tokens.map((tok, i) => (
          <div key={tok} className={`flex items-center gap-2 ${kept.has(i) ? '' : 'opacity-30'}`}>
            <span className="w-44 shrink-0 truncate font-mono text-[11px]">{tok}</span>
            <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${(probs[i] * 100).toFixed(1)}%` }} />
            </div>
            <span className="w-14 text-right font-mono text-[11px]">{(probs[i] * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button className="btn-primary" onClick={() => sample(10)}>🎲 Sinh 10 lần</button>
        {samples.length > 0 && <span className="muted">→ {distinct} kết quả khác nhau / 10 lần</span>}
      </div>
      {samples.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {samples.map((s, i) => (
            <span key={i} className="rounded-lg border border-indigo-200 bg-white px-2 py-1 font-mono text-[11px] dark:border-indigo-500/30 dark:bg-slate-900">{s}</span>
          ))}
        </div>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
        Temperature → 0: gần như luôn chọn token xác suất cao nhất (ổn định, hợp sinh script). Temperature cao: token “lạ” có cơ hội → đa dạng nhưng dễ bịa. Top-p loại bỏ đuôi phân phối xác suất thấp.
      </p>
    </LabShell>
  );
};
