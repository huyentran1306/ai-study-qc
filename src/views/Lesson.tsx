import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, ClipboardCopy, Clock, FlaskConical, GraduationCap, Lightbulb, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { ROADMAP, STAGE_BY_ID } from '../data/roadmap';
import { VISUALS } from '../data/visuals';
import { LAB_BY_ID } from '../components/labs/registry';
import { CompareTabs, DecisionFlow, FlowMap } from '../components/Visuals';
import { href } from '../lib/router';
import { ProgressApi } from '../lib/progress';
import { stageVars } from '../lib/stageTheme';
import { Stage } from '../types';

const SECTIONS = [
  { id: 'map', icon: '🗺️', name: 'Bức tranh lớn', hint: 'Nhìn toàn cảnh' },
  { id: 'ideas', icon: '📖', name: 'Ý chính', hint: 'Mỗi ý một ví dụ' },
  { id: 'decide', icon: '🧭', name: 'Chọn đúng', hint: 'Tình huống thật' },
  { id: 'lab', icon: '🧪', name: 'Thực hành', hint: 'Bấm thử ngay' },
  { id: 'use', icon: '⚡', name: 'Dùng ngay', hint: 'Prompt mang đi làm' },
  { id: 'recap', icon: '🏁', name: 'Tổng kết', hint: 'Tóm tắt & tự kiểm tra' },
] as const;

const pad = (n: number) => String(n).padStart(2, '0');

/* ───────── small pieces ───────── */
const Ring: React.FC<{ value: number; total: number; size?: number; label?: string; light?: boolean }> = ({ value, total, size = 64, label, light }) => {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={5} className={light ? 'stroke-white/15' : 'stroke-slate-200 dark:stroke-slate-700'} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={5} strokeLinecap="round" stroke="var(--ac)" strokeDasharray={c} strokeDashoffset={c * (1 - value / total)} style={{ transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center font-mono text-sm font-bold ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{label ?? `${value}/${total}`}</span>
    </div>
  );
};

const SectionHead: React.FC<{ k: number; title: string; sub: string }> = ({ k, title, sub }) => (
  <header className="mb-6 flex items-end gap-4">
    <span className="ls-num select-none">{pad(k + 1)}</span>
    <div className="min-w-0 pb-0.5">
      <div className="ls-text text-xs font-bold uppercase tracking-[.18em]">{SECTIONS[k].icon} {SECTIONS[k].name}</div>
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-[1.75rem] dark:text-white">{title}</h2>
      <p className="mt-0.5 text-slate-500 dark:text-slate-400">{sub}</p>
    </div>
  </header>
);

/* ───────── 02 · Ý chính: master–detail ───────── */
type Ex = NonNullable<Stage['points'][number]['ex']>;
const BeforeAfter: React.FC<{ ex: Ex }> = ({ ex }) => {
  const neutral = Boolean(ex.ll || ex.rl);
  const side = (label: string, text: string, tone: 'bad' | 'good' | 'a' | 'b') => {
    const tones = {
      bad: 'border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10 [&_.lbl]:text-rose-600 dark:[&_.lbl]:text-rose-400',
      good: 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10 [&_.lbl]:text-emerald-600 dark:[&_.lbl]:text-emerald-400',
      a: 'border-sky-200 bg-sky-50 dark:border-sky-500/30 dark:bg-sky-500/10 [&_.lbl]:text-sky-600 dark:[&_.lbl]:text-sky-400',
      b: 'border-violet-200 bg-violet-50 dark:border-violet-500/30 dark:bg-violet-500/10 [&_.lbl]:text-violet-600 dark:[&_.lbl]:text-violet-400',
    };
    return (
      <div className={`h-full rounded-2xl border p-4 lg:p-5 ${tones[tone]}`}>
        <div className="lbl mb-2 text-xs font-bold uppercase tracking-wider">{label}</div>
        <div className="space-y-1.5 leading-relaxed text-slate-800 dark:text-slate-200">
          {text.split(' · ').map((line, k) => <p key={k}>{line}</p>)}
        </div>
      </div>
    );
  };
  return (
    <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
      {side(ex.ll ?? '❌ Chưa tốt', ex.l, neutral ? 'a' : 'bad')}
      <div className="flex items-center justify-center">
        <span className="ls-grad flex h-10 w-10 rotate-90 items-center justify-center rounded-full text-white shadow-lg md:rotate-0"><ArrowRight className="h-5 w-5" /></span>
      </div>
      {side(ex.rl ?? '✅ Tốt hơn', ex.r, neutral ? 'b' : 'good')}
    </div>
  );
};

const IdeaExplorer: React.FC<{ stage: Stage }> = ({ stage }) => {
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const go = (k: number) => { setI(k); setSeen((s) => new Set(s).add(k)); };
  const p = stage.points[i];
  const n = stage.points.length;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
      <ol className="flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-visible xl:pb-0">
        {stage.points.map((pt, k) => {
          const on = k === i;
          return (
            <li key={k} className="shrink-0 xl:shrink">
              <button
                onClick={() => go(k)}
                className={`group flex w-64 items-start gap-3 rounded-2xl border p-3.5 text-left transition xl:w-full ${
                  on ? 'ls-tint ls-ring border-2 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600'
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ${on ? 'ls-grad text-white' : seen.has(k) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {seen.has(k) && !on ? <Check className="h-4 w-4" /> : k + 1}
                </span>
                <span className={`pt-1 text-[0.95rem] font-semibold leading-snug ${on ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{pt.t}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <article key={i} className="card animate-fadeIn relative overflow-hidden p-6 lg:p-8">
        <div className="ls-grad absolute inset-x-0 top-0 h-1" />
        <div className="mb-1 flex items-center justify-between">
          <span className="ls-text font-mono text-xs font-bold uppercase tracking-widest">Ý {i + 1} / {n}</span>
          <span className="text-xs text-slate-400">Đã xem {seen.size}/{n}</span>
        </div>
        <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 lg:text-3xl dark:text-white">{p.t}</h3>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">{p.d}</p>
        {p.ex && (
          <div className="mt-6 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Ví dụ cụ thể</div>
            <BeforeAfter ex={p.ex} />
          </div>
        )}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <button className="btn-ghost" disabled={i === 0} onClick={() => go(i - 1)}><ArrowLeft className="h-4 w-4" /> Ý trước</button>
          <div className="flex gap-1.5">
            {stage.points.map((_, k) => (
              <button key={k} aria-label={`Ý ${k + 1}`} onClick={() => go(k)} className={`h-2 rounded-full transition-all ${k === i ? 'ls-grad w-6' : seen.has(k) ? 'w-2 bg-emerald-400' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} />
            ))}
          </div>
          <button className="btn-ghost" disabled={i === n - 1} onClick={() => go(i + 1)}>Ý tiếp <ArrowRight className="h-4 w-4" /></button>
        </div>
      </article>
    </div>
  );
};

/* ───────── 05 · Dùng ngay: terminal-style prompt ───────── */
const PromptTerminal: React.FC<{ stage: Stage }> = ({ stage }) => {
  const [copied, setCopied] = useState(false);
  const parts = stage.tryNow.prompt.split(/(\[[^\]]+\])/g);
  const steps = [
    ['Copy prompt', 'Bấm nút copy ở góc cửa sổ.'],
    ['Thay chỗ [ … ]', 'Các phần tô vàng là chỗ bạn điền dữ liệu thật của mình.'],
    ['Kiểm chứng', 'Đọc lại kết quả, đối chiếu với requirement trước khi dùng.'],
  ];
  return (
    <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
      <ol className="space-y-3">
        {steps.map(([t, d], k) => (
          <li key={t} className="card flex gap-3 p-4">
            <span className="ls-grad flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-white">{k + 1}</span>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{t}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{d}</div>
            </div>
          </li>
        ))}
      </ol>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-900/20">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-transparent">
          <span className="h-3 w-3 rounded-full bg-rose-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-3 truncate font-mono text-xs text-slate-500 dark:text-slate-400">prompt — {stage.tryNow.label}</span>
          <button
            className="ls-grad ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
            onClick={() => { navigator.clipboard?.writeText(stage.tryNow.prompt); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          >
            {copied ? <><Check className="h-3.5 w-3.5" /> Đã copy</> : <><ClipboardCopy className="h-3.5 w-3.5" /> Copy</>}
          </button>
        </div>
        <pre className="whitespace-pre-wrap px-5 py-5 font-mono text-[0.95rem] leading-relaxed text-slate-800 lg:px-6 dark:text-slate-200">
          <span className="ls-text select-none">❯ </span>
          {parts.map((s, k) => (s.startsWith('[') ? <mark key={k} className="rounded bg-amber-100 px-1 font-semibold text-amber-800 dark:bg-amber-400/20 dark:text-amber-300">{s}</mark> : <React.Fragment key={k}>{s}</React.Fragment>))}
        </pre>
        <div className="border-t border-slate-100 px-5 py-2.5 text-xs text-slate-500 dark:border-white/10">Dùng trong công cụ AI công ty cho phép. Không dán dữ liệu thật của khách hàng.</div>
      </div>
    </div>
  );
};

/* ───────── 06 · Tổng kết: cheat sheet + quiz ───────── */
const Quiz: React.FC<{ stage: Stage; best?: number; onScore: (n: number) => void }> = ({ stage, best, onScore }) => {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const total = stage.quiz.length;
  const answered = Object.keys(picked).length;
  const correct = stage.quiz.filter((q, k) => picked[k] === q.a).length;
  const pick = (qi: number, oi: number) => {
    if (picked[qi] !== undefined) return;
    const next = { ...picked, [qi]: oi };
    setPicked(next);
    if (Object.keys(next).length === total) onScore(stage.quiz.filter((q, k) => next[k] === q.a).length);
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Ring value={answered === total ? correct : answered} total={total} label={answered === total ? `${correct}/${total}` : `${answered}/${total}`} />
        <div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {answered < total ? `Tự kiểm tra · ${total} câu` : correct === total ? '🎉 Đúng hết! Bạn nắm chắc chặng này' : `Đúng ${correct}/${total} — xem lại giải thích bên dưới`}
          </div>
          <div className="text-sm text-slate-500">
            {answered === total ? <button className="ls-text inline-flex items-center gap-1 font-semibold" onClick={() => setPicked({})}><RotateCcw className="h-3.5 w-3.5" /> Làm lại</button> : best !== undefined ? `Lần trước: ${best}/${total}` : 'Chọn một đáp án cho mỗi câu.'}
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 min-[1400px]:grid-cols-3">
        {stage.quiz.map((q, qi) => (
          <div key={qi} className="card flex flex-col gap-3 p-5">
            <div className="flex gap-2">
              <span className="ls-text font-mono text-sm font-bold">Q{qi + 1}</span>
              <p className="font-semibold leading-snug text-slate-900 dark:text-white">{q.q}</p>
            </div>
            <div className="grid gap-2">
              {q.options.map((o, oi) => {
                const ch = picked[qi];
                const st = ch === undefined ? '' : oi === q.a ? 'right' : oi === ch ? 'wrong' : 'dim';
                return (
                  <button
                    key={oi}
                    onClick={() => pick(qi, oi)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                      st === 'right' ? 'border-emerald-400 bg-emerald-50 font-semibold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200'
                      : st === 'wrong' ? 'animate-shake border-rose-400 bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-200'
                      : st === 'dim' ? 'border-slate-200 opacity-45 dark:border-slate-800'
                      : 'border-slate-200 hover:-translate-y-px hover:border-slate-400 hover:shadow-sm dark:border-slate-700 dark:hover:border-slate-500'
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${st === 'right' ? 'bg-emerald-500 text-white' : st === 'wrong' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                      {st === 'right' ? '✓' : st === 'wrong' ? '✕' : 'ABCD'[oi]}
                    </span>
                    {o}
                  </button>
                );
              })}
            </div>
            {picked[qi] !== undefined && <p className="animate-fadeIn mt-auto rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">💡 {q.why}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const CheatSheet: React.FC<{ stage: Stage; remember: string[] }> = ({ stage, remember }) => (
  <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm lg:p-8 dark:border-transparent dark:bg-slate-950 dark:text-white">
    <div className="ls-grad absolute inset-x-0 top-0 h-1" />
    <div className="ls-blob pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-[.12] blur-3xl dark:opacity-40" />
    <div className="relative grid gap-8 lg:grid-cols-2">
      <div>
        <div className="ls-text mb-3 text-xs font-bold uppercase tracking-[.18em]">📌 Tóm tắt 1 trang</div>
        <ul className="space-y-2.5">
          {stage.points.map((p) => (
            <li key={p.t} className="flex gap-2.5">
              <CheckCircle2 className="ls-text mt-0.5 h-5 w-5 shrink-0" />
              <span><b className="text-slate-900 dark:text-white">{p.t}</b><span className="block text-sm leading-relaxed text-slate-500 dark:text-slate-400">{p.d}</span></span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-5">
        <div>
          <div className="ls-text mb-3 text-xs font-bold uppercase tracking-[.18em]">🧠 Câu cần thuộc</div>
          <div className="flex flex-wrap gap-2">
            {remember.map((r) => <span key={r} className="ls-tint ls-ring rounded-xl border px-3 py-2 text-sm font-semibold">{r}</span>)}
          </div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-amber-600 dark:text-amber-300">💡 Hiểu nhanh</div>
          <p className="leading-relaxed text-amber-950 dark:text-slate-200">{stage.analogy}</p>
        </div>
      </div>
    </div>
  </div>
);

/* ───────── Page ───────── */
export const StageView: React.FC<{ stageId: string; api: ProgressApi }> = ({ stageId, api }) => {
  const stage = STAGE_BY_ID[stageId];
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const [scroll, setScroll] = useState(0);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [stageId]);

  // Scroll-spy + reading progress
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(`sec-${s.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const k = SECTIONS.findIndex((s) => `sec-${s.id}` === (e.target as HTMLElement).id);
        setActive(k);
        setSeen((s) => (s.has(k) ? s : new Set(s).add(k)));
      }),
      { rootMargin: '-35% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, [stageId]);

  const visual = VISUALS[stageId];
  const remember = useMemo(
    () => (visual ? [...new Set(Object.values(visual.decide.nodes).flatMap((n) => ('remember' in n && n.remember ? [n.remember] : [])))] : []),
    [visual],
  );

  if (!stage) return <div className="p-10 text-center text-sm">Không tìm thấy chặng. <a className="underline" href={href('')}>Về lộ trình</a></div>;

  const idx = ROADMAP.indexOf(stage);
  const prev = ROADMAP[idx - 1];
  const next = ROADMAP[idx + 1];
  const isDone = api.progress.doneStages.includes(stage.id);
  const lab = LAB_BY_ID[stage.lab];
  const Lab = lab.Component;
  const jump = (k: number) => document.getElementById(`sec-${SECTIONS[k].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const px = 'px-4 sm:px-6 lg:px-10 xl:px-14';

  return (
    <div style={stageVars(stage.id)} className="animate-fadeIn">
      {/* reading progress */}
      <div className="fixed inset-x-0 top-14 z-40 h-1 bg-transparent">
        <div className="ls-grad h-full origin-left" style={{ transform: `scaleX(${scroll})` }} />
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white text-slate-900 dark:border-transparent dark:bg-slate-950 dark:text-white">
        <div className="ls-dots pointer-events-none absolute inset-0 opacity-60" />
        <div className="ls-blob pointer-events-none absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full opacity-[.18] blur-3xl dark:opacity-50" />
        <div className="ls-blob2 pointer-events-none absolute -bottom-48 right-0 h-[30rem] w-[30rem] rounded-full opacity-[.16] blur-3xl dark:opacity-40" />
        <span className="ls-hero-num pointer-events-none absolute -right-4 -top-10 hidden select-none lg:block">{pad(idx + 1)}</span>

        <div className={`relative ${px} pb-10 pt-6 lg:pb-14`}>
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm">
            <a href={href('')} className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"><ArrowLeft className="h-3.5 w-3.5" /> Lộ trình</a>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <div className="flex gap-1.5">
              {ROADMAP.map((s, k) => (
                <a key={s.id} href={href(`stage/${s.id}`)} title={`Chặng ${k + 1}: ${s.title}`}
                  className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 font-mono text-xs font-bold transition ${
                    s.id === stage.id ? 'ls-grad text-white shadow-lg' : api.progress.doneStages.includes(s.id) ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30' : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:border-transparent dark:bg-white/10 dark:text-slate-400 dark:hover:bg-white/20 dark:hover:text-white'
                  }`}>
                  {api.progress.doneStages.includes(s.id) && s.id !== stage.id ? '✓' : k + 1}
                </a>
              ))}
            </div>
          </nav>

          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="ls-tint flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 text-4xl shadow-lg shadow-slate-200/60 backdrop-blur dark:border-white/15 dark:shadow-xl dark:shadow-black/30">{stage.emoji}</span>
                <span className="ls-text text-sm font-bold uppercase tracking-[.2em]">Chặng {pad(idx + 1)} / {pad(ROADMAP.length)}</span>
              </div>
              <h1 className="max-w-4xl text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl xl:text-5xl">{stage.title}</h1>
              <p className="max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">🎯 {stage.goal}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="ls-chip"><Clock className="h-3.5 w-3.5" /> {stage.duration}</span>
                <span className="ls-chip">📖 {stage.points.length} ý chính</span>
                <span className="ls-chip"><FlaskConical className="h-3.5 w-3.5" /> {lab.title}</span>
                <span className="ls-chip"><GraduationCap className="h-3.5 w-3.5" /> {stage.istqb}</span>
              </div>
              <button onClick={() => jump(0)} className="ls-grad inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl">
                {seen.size > 1 ? 'Học tiếp' : 'Bắt đầu học'} <ArrowDown className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-md dark:border-white/10 dark:bg-white/[.06] dark:shadow-none">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-amber-600 dark:text-amber-300"><Lightbulb className="h-4 w-4" /> Hiểu trong 1 câu</div>
              <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-100">{stage.analogy}</p>
              <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4 dark:border-white/10">
                <Ring value={seen.size} total={SECTIONS.length} size={56} />
                <div className="text-sm text-slate-500 dark:text-slate-300">
                  <div className="font-semibold text-slate-900 dark:text-white">{isDone ? '🎉 Đã hoàn thành' : 'Tiến độ chặng này'}</div>
                  Đã xem {seen.size}/{SECTIONS.length} phần
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── mobile section nav ── */}
      <nav className={`sticky top-[3.75rem] z-30 border-b border-slate-200 bg-white/90 py-2 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-[#0B0F1A]/90 ${px}`}>
        <div className="flex gap-1.5 overflow-x-auto">
          {SECTIONS.map((s, k) => (
            <button key={s.id} onClick={() => jump(k)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${k === active ? 'ls-grad text-white' : seen.has(k) ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className={`grid gap-10 py-10 lg:grid-cols-[240px_minmax(0,1fr)] xl:gap-14 ${px}`}>
        {/* sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <div className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">Trong chặng này</div>
            <ol className="relative space-y-1">
              <span className="absolute bottom-4 left-[15px] top-4 w-px bg-slate-200 dark:bg-slate-800" />
              {SECTIONS.map((s, k) => {
                const on = k === active;
                const ok = seen.has(k) && !on;
                return (
                  <li key={s.id} className="relative">
                    <button onClick={() => jump(k)} className={`flex w-full items-center gap-3 rounded-xl py-2 pr-2 text-left transition ${on ? '' : 'opacity-75 hover:opacity-100'}`}>
                      <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ring-4 ring-slate-50 dark:ring-[#0B0F1A] ${on ? 'ls-grad text-white shadow-md' : ok ? 'bg-emerald-500 text-white' : 'bg-white text-slate-500 ring-offset-0 dark:bg-slate-800'} ${!on && !ok ? 'border border-slate-200 dark:border-slate-700' : ''}`}>
                        {ok ? <Check className="h-4 w-4" /> : s.icon}
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-sm font-bold ${on ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{s.name}</span>
                        <span className="block text-xs text-slate-400">{s.hint}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex justify-between text-xs font-semibold text-slate-500"><span>Đã xem</span><span>{Math.round((seen.size / SECTIONS.length) * 100)}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="ls-grad h-full rounded-full transition-all duration-500" style={{ width: `${(seen.size / SECTIONS.length) * 100}%` }} /></div>
              <button onClick={() => api.toggleDone(stage.id)} className={`mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold transition ${isDone ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'}`}>
                {isDone ? <><CheckCircle2 className="h-4 w-4" /> Đã xong chặng</> : <><Circle className="h-4 w-4" /> Đánh dấu xong</>}
              </button>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              {prev ? <a className="text-slate-500 hover:text-slate-900 dark:hover:text-white" href={href(`stage/${prev.id}`)}>← Chặng {idx}</a> : <span />}
              {next && <a className="ls-text hover:underline" href={href(`stage/${next.id}`)}>Chặng {idx + 2} →</a>}
            </div>
          </div>
        </aside>

        {/* content */}
        <main className="min-w-0 space-y-20">
          {visual && (
            <section id="sec-map" className="scroll-mt-28">
              <SectionHead k={0} title={visual.diagram.title} sub="Nhìn cả bức tranh trước khi đi vào chi tiết. Bấm từng khối để xem nó làm gì." />
              <FlowMap diagram={visual.diagram} />
            </section>
          )}

          <section id="sec-ideas" className="scroll-mt-28">
            <SectionHead k={1} title={`${stage.points.length} ý cần nắm`} sub="Chọn từng ý bên trái. Mỗi ý có một ví dụ trước/sau để thấy khác biệt ngay." />
            <IdeaExplorer key={stage.id} stage={stage} />
          </section>

          {visual && (
            <section id="sec-decide" className="scroll-mt-28 space-y-8">
              <SectionHead k={2} title="Gặp tình huống thì chọn gì?" sub="Biết rồi chưa đủ, phải chọn đúng. Đi theo cây quyết định, rồi xem các cặp hay nhầm." />
              <DecisionFlow key={stage.id} tree={visual.decide} />
              <CompareTabs key={stage.id + '-cmp'} list={visual.compare} />
            </section>
          )}

          <section id="sec-lab" className="scroll-mt-28">
            <SectionHead k={3} title={lab.title} sub="Bấm thử, quan sát kết quả thay đổi. Chạy ngay trên trình duyệt, không cần cài gì." />
            <Lab />
            {(stage.extraLabs || stage.id === 'stage-6') && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="self-center text-sm text-slate-500">Thử thêm:</span>
                {stage.extraLabs?.map((l) => (
                  <a key={l} className="btn-ghost text-sm" href={href(`lab/${l}`)}>{LAB_BY_ID[l].icon} {LAB_BY_ID[l].title}</a>
                ))}
                {stage.id === 'stage-6' && <a className="btn-ghost text-sm" href={href('interview')}>💬 Luyện phỏng vấn</a>}
              </div>
            )}
          </section>

          <section id="sec-use" className="scroll-mt-28">
            <SectionHead k={4} title={stage.tryNow.label} sub="Một prompt dùng được ngay trong công việc hôm nay." />
            <PromptTerminal stage={stage} />
          </section>

          <section id="sec-recap" className="scroll-mt-28 space-y-8">
            <SectionHead k={5} title="Gói lại trong 1 trang" sub="Đọc lại tóm tắt, rồi tự kiểm tra 3 câu." />
            <CheatSheet stage={stage} remember={remember} />
            <Quiz key={stage.id} stage={stage} best={api.progress.quizScores[stage.id]} onScore={(n) => api.saveQuiz(stage.id, n)} />

            {next ? (
              <a href={href(`stage/${next.id}`)} onClick={() => !isDone && api.toggleDone(stage.id)}
                className="group relative flex flex-wrap items-center gap-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-xl lg:p-8 dark:border-slate-800 dark:bg-slate-900"
                style={stageVars(next.id)}>
                <div className="ls-grad absolute inset-y-0 left-0 w-1.5" />
                <span className="text-5xl">{next.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="ls-text text-xs font-bold uppercase tracking-[.18em]">Hoàn thành & sang chặng {idx + 2}</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">{next.title}</div>
                  <div className="text-slate-500">{next.goal}</div>
                </div>
                <span className="ls-grad flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition group-hover:translate-x-1"><ArrowRight className="h-5 w-5" /></span>
              </a>
            ) : (
              <a href={href('')} onClick={() => !isDone && api.toggleDone(stage.id)} className="ls-grad flex items-center justify-center gap-3 rounded-3xl p-8 text-xl font-extrabold text-white shadow-xl transition hover:-translate-y-0.5">
                <Trophy className="h-7 w-7" /> Hoàn thành cả lộ trình! Về trang chính <Sparkles className="h-6 w-6" />
              </a>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
