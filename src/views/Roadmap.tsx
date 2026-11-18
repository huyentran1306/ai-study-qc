import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, FlaskConical } from 'lucide-react';
import { ROADMAP, SOURCES, STAGE_BY_ID } from '../data/roadmap';
import { LABS, LAB_BY_ID } from '../components/labs/registry';
import { href } from '../lib/router';
import { ProgressApi } from '../lib/progress';
import { Stage } from '../types';
import { AiExplainer } from '../components/AiExplainer';

// ───────────────────────────── Home: the roadmap ─────────────────────────────
export const RoadmapView: React.FC<{ api: ProgressApi }> = ({ api }) => {
  const done = new Set(api.progress.doneStages);
  const next = ROADMAP.find((s) => !done.has(s.id)) ?? ROADMAP[0];

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 animate-fadeIn">
      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl dark:text-white">
          Hiểu AI trong 1 phút.<br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Dùng AI để test trong 6 chặng.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Dành cho tester chưa biết gì về AI. Không cần toán, không cần code — xem, bấm thử, rồi áp dụng ngay vào việc.
        </p>
      </header>

      <AiExplainer />

      <div className="flex flex-col items-center gap-2 pt-2 text-center">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Lộ trình 6 chặng</h2>
        <p className="text-xs text-slate-500">Mỗi chặng: vài ý cần nắm · 1 bài thực hành · 1 prompt dùng ngay · 3 câu tự kiểm tra</p>
        <div className="flex items-center gap-3 pt-1">
          <a href={href(`stage/${next.id}`)} className="btn-primary px-5 py-2.5 text-sm">
            {done.size ? 'Học tiếp' : 'Bắt đầu'} · Chặng {ROADMAP.indexOf(next) + 1} <ArrowRight className="h-4 w-4" />
          </a>
          <span className="text-xs font-semibold text-slate-500">{done.size}/{ROADMAP.length} chặng xong</span>
        </div>
      </div>

      <ol className="relative space-y-4 border-l-2 border-dashed border-indigo-200 pl-6 dark:border-indigo-500/30">
        {ROADMAP.map((s, i) => {
          const isDone = done.has(s.id);
          return (
            <li key={s.id} className="relative">
              <span className={`absolute -left-[37px] top-4 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isDone ? 'bg-emerald-500 text-white' : 'border-2 border-indigo-300 bg-white text-indigo-600 dark:border-indigo-500/50 dark:bg-slate-900 dark:text-indigo-300'}`}>
                {isDone ? '✓' : i + 1}
              </span>
              <a href={href(`stage/${s.id}`)} className="card block p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{s.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{s.title}</h2>
                      <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="h-3 w-3" /> {s.duration}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.goal}</p>
                    <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm italic leading-relaxed text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                      {s.analogy}
                    </p>
                  </div>
                </div>
              </a>
            </li>
          );
        })}
      </ol>

      <section className="card p-5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        <b className="text-slate-800 dark:text-slate-200">Muốn lấy chứng chỉ?</b> Học xong 6 chặng là có nền để đọc syllabus gốc. Chặng 1–3 tương ứng <b>ISTQB CT-GenAI</b> (dùng AI để test). Chặng 4–5 tương ứng <b>ISTQB CT-AI</b> (test hệ thống có AI). Cả hai yêu cầu có CTFL.
        <ul className="mt-2 space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>→ <a className="text-indigo-600 underline dark:text-indigo-400" href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>
          ))}
        </ul>
      </section>

      <p className="text-center text-xs text-slate-400">
        Tiến độ lưu trên trình duyệt này. <button className="underline" onClick={() => confirm('Xoá toàn bộ tiến độ?') && api.reset()}>Xoá tiến độ</button>
      </p>
    </div>
  );
};

// ───────────────────────────── Self-check (3 questions) ─────────────────────────────
const SelfCheck: React.FC<{ stage: Stage; onScore: (n: number) => void; best?: number }> = ({ stage, onScore, best }) => {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const answered = Object.keys(picked).length;
  const correct = stage.quiz.filter((q, i) => picked[i] === q.a).length;

  const pick = (qi: number, oi: number) => {
    if (picked[qi] !== undefined) return;
    const next = { ...picked, [qi]: oi };
    setPicked(next);
    if (Object.keys(next).length === stage.quiz.length) onScore(stage.quiz.filter((q, i) => next[i] === q.a).length);
  };

  return (
    <section className="card space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">✅ Tự kiểm tra</h2>
        {answered === stage.quiz.length ? (
          <button className="text-xs text-indigo-600 underline" onClick={() => setPicked({})}>Làm lại · {correct}/{stage.quiz.length} đúng</button>
        ) : (
          best !== undefined && <span className="text-xs text-slate-500">Lần trước: {best}/{stage.quiz.length}</span>
        )}
      </div>
      {stage.quiz.map((q, qi) => (
        <div key={qi} className="space-y-2 text-sm">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{qi + 1}. {q.q}</p>
          <div className="grid gap-1.5">
            {q.options.map((o, oi) => {
              const chosen = picked[qi];
              const state = chosen === undefined ? '' : oi === q.a ? 'right' : oi === chosen ? 'wrong' : 'dim';
              return (
                <button
                  key={oi}
                  onClick={() => pick(qi, oi)}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    state === 'right' ? 'border-emerald-400 bg-emerald-50 font-semibold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200'
                    : state === 'wrong' ? 'border-rose-400 bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-200'
                    : state === 'dim' ? 'border-slate-200 opacity-50 dark:border-slate-800'
                    : 'border-slate-200 hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-500'
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
          {picked[qi] !== undefined && <p className="text-slate-500 dark:text-slate-400">💡 {q.why}</p>}
        </div>
      ))}
    </section>
  );
};

// ───────────────────────────── "Dùng ngay hôm nay" ─────────────────────────────
const TryNow: React.FC<{ stage: Stage }> = ({ stage }) => {
  const [copied, setCopied] = useState(false);
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">⚡ Dùng ngay hôm nay: {stage.tryNow.label}</h2>
        <button
          className="btn-primary"
          onClick={() => { navigator.clipboard?.writeText(stage.tryNow.prompt); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        >
          {copied ? '✔ Đã copy' : '📋 Copy prompt'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap bg-slate-950 px-5 py-4 font-mono text-sm leading-relaxed text-indigo-200 lg:text-base">{stage.tryNow.prompt}</pre>
      <p className="px-5 py-2.5 text-xs text-slate-500">Dán vào công cụ AI công ty cho phép, thay phần [ … ] bằng dữ liệu của bạn — và nhớ kiểm chứng kết quả.</p>
    </section>
  );
};

// ───────────────────────────── Stage page ─────────────────────────────
export const StageView: React.FC<{ stageId: string; api: ProgressApi }> = ({ stageId, api }) => {
  const stage = STAGE_BY_ID[stageId];
  if (!stage) return <div className="p-10 text-center text-sm">Không tìm thấy chặng. <a className="underline" href={href('')}>Về lộ trình</a></div>;
  const idx = ROADMAP.indexOf(stage);
  const prev = ROADMAP[idx - 1];
  const next = ROADMAP[idx + 1];
  const isDone = api.progress.doneStages.includes(stage.id);
  const Lab = LAB_BY_ID[stage.lab].Component;

  return (
    <div className="mx-auto max-w-5xl space-y-7 px-4 py-10 animate-fadeIn">
      <a href={href('')} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600"><ArrowLeft className="h-3.5 w-3.5" /> Lộ trình</a>

      <header className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Chặng {idx + 1}/{ROADMAP.length} · {stage.duration}</div>
        <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl dark:text-white"><span>{stage.emoji}</span> {stage.title}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">🎯 {stage.goal}</p>
      </header>

      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 text-base leading-relaxed text-amber-950 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-orange-500/10 dark:text-amber-100">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Hiểu nhanh</span>
        {stage.analogy}
      </div>

      <section className="card p-6">
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">📌 Cần nắm</h2>
        <ol className="space-y-3">
          {stage.points.map((p, i) => (
            <li key={i} className="flex gap-3 text-base">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-mono text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">{i + 1}</span>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{p.t}</div>
                <div className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-400">{p.d}</div>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">Liên quan ISTQB: {stage.istqb}</p>
      </section>

      <TryNow stage={stage} />

      <section>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">🧪 Thực hành</h2>
        <Lab />
        {stage.extraLabs && (
          <p className="mt-2 text-xs text-slate-500">
            Thêm: {stage.extraLabs.map((l, i) => (
              <React.Fragment key={l}>{i > 0 && ' · '}<a className="text-indigo-600 underline dark:text-indigo-400" href={href(`lab/${l}`)}>{LAB_BY_ID[l].icon} {LAB_BY_ID[l].title}</a></React.Fragment>
            ))}
            {stage.id === 'stage-6' && <> · <a className="text-indigo-600 underline dark:text-indigo-400" href={href('interview')}>💬 Luyện phỏng vấn</a></>}
          </p>
        )}
      </section>

      <SelfCheck key={stage.id} stage={stage} best={api.progress.quizScores[stage.id]} onScore={(n) => api.saveQuiz(stage.id, n)} />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-5 dark:border-slate-800">
        {prev ? <a className="btn-ghost" href={href(`stage/${prev.id}`)}><ArrowLeft className="h-3.5 w-3.5" /> {prev.title}</a> : <span />}
        <button onClick={() => api.toggleDone(stage.id)} className={isDone ? 'btn-ghost text-emerald-600' : 'btn-primary bg-emerald-600 hover:bg-emerald-700'}>
          {isDone ? <><CheckCircle2 className="h-4 w-4" /> Đã xong chặng này</> : <><Circle className="h-4 w-4" /> Đánh dấu đã xong</>}
        </button>
        {next ? <a className="btn-ghost" href={href(`stage/${next.id}`)}>{next.title} <ArrowRight className="h-3.5 w-3.5" /></a> : <a className="btn-ghost" href={href('')}>Về lộ trình</a>}
      </div>
    </div>
  );
};

// ───────────────────────────── Labs ─────────────────────────────
export const LabsView: React.FC<{ labId?: string }> = ({ labId }) => {
  const lab = labId ? LAB_BY_ID[labId] : undefined;
  if (lab) {
    const L = lab.Component;
    const stage = ROADMAP.find((s) => s.lab === lab.id || s.extraLabs?.includes(lab.id));
    return (
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-8 animate-fadeIn">
        <a href={href('labs')} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600"><ArrowLeft className="h-3.5 w-3.5" /> Tất cả bài thực hành</a>
        <L />
        {stage && <p className="text-xs text-slate-500">Thuộc <a className="text-indigo-600 underline" href={href(`stage/${stage.id}`)}>Chặng {ROADMAP.indexOf(stage) + 1}: {stage.title}</a></p>}
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 py-10 animate-fadeIn">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white"><FlaskConical className="h-6 w-6 text-indigo-600" /> Thực hành</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Chạy ngay trên trình duyệt, không cần cài đặt hay API key.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {LABS.map((l) => (
          <a key={l.id} href={href(`lab/${l.id}`)} className="card flex gap-3 p-4 transition hover:border-indigo-300 hover:shadow-md">
            <span className="text-2xl">{l.icon}</span>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{l.title}</div>
              <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{l.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
