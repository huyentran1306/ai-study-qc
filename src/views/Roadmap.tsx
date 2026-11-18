import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, FlaskConical } from 'lucide-react';
import { ROADMAP, SOURCES, STAGE_BY_ID } from '../data/roadmap';
import { LABS, LAB_BY_ID } from '../components/labs/registry';
import { href } from '../lib/router';
import { ProgressApi } from '../lib/progress';
import { Stage } from '../types';
import { AiExplainer } from '../components/AiExplainer';
import { CompareTabs, DecisionFlow, FlowMap } from '../components/Visuals';
import { VISUALS } from '../data/visuals';

// ───────────────────────────── Home: the roadmap ─────────────────────────────
export const RoadmapView: React.FC<{ api: ProgressApi }> = ({ api }) => {
  const done = new Set(api.progress.doneStages);
  const next = ROADMAP.find((s) => !done.has(s.id)) ?? ROADMAP[0];

  return (
    <div className="w-full space-y-10 px-4 sm:px-6 lg:px-10 xl:px-14 py-12 animate-fadeIn">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl dark:text-white">
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
        <p className="text-xs text-slate-500">Mỗi chặng: sơ đồ bức tranh lớn · ý chính có ví dụ · cây quyết định “chọn đúng” · thực hành · prompt dùng ngay · tự kiểm tra</p>
        <div className="flex items-center gap-3 pt-1">
          <a href={href(`stage/${next.id}`)} className="btn-primary px-5 py-2.5 text-sm">
            {done.size ? 'Học tiếp' : 'Bắt đầu'} · Chặng {ROADMAP.indexOf(next) + 1} <ArrowRight className="h-4 w-4" />
          </a>
          <span className="text-xs font-semibold text-slate-500">{done.size}/{ROADMAP.length} chặng xong</span>
        </div>
      </div>

      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ROADMAP.map((s, i) => {
          const isDone = done.has(s.id);
          return (
            <li key={s.id}>
              <a href={href(`stage/${s.id}`)} className="card flex h-full flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isDone ? 'bg-emerald-500 text-white' : 'border-2 border-indigo-300 bg-white text-indigo-600 dark:border-indigo-500/50 dark:bg-slate-900 dark:text-indigo-300'}`}>
                    {isDone ? '✓' : i + 1}
                  </span>
                  <span className="text-3xl">{s.emoji}</span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-slate-500"><Clock className="h-3 w-3" /> {s.duration}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{s.title}</h2>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.goal}</p>
                <p className="mt-auto rounded-lg bg-slate-50 px-3 py-2 text-sm italic leading-relaxed text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                  {s.analogy}
                </p>
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
const SECTIONS = [
  { icon: '🗺️', name: 'Bức tranh' },
  { icon: '📖', name: 'Ý chính' },
  { icon: '🧭', name: 'Chọn đúng' },
  { icon: '🧪', name: 'Thực hành' },
  { icon: '⚡', name: 'Dùng ngay' },
  { icon: '✅', name: 'Kiểm tra' },
];

/** One idea per card, each with a concrete side-by-side example. */
const ConceptCards: React.FC<{ stage: Stage; onFinish: () => void }> = ({ stage, onFinish }) => {
  const [i, setI] = useState(0);
  const [listMode, setListMode] = useState(false);
  const n = stage.points.length;
  const last = i === n - 1;

  useEffect(() => {
    if (listMode) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') setI((x) => Math.min(n - 1, x + 1));
      if (e.key === 'ArrowLeft') setI((x) => Math.max(0, x - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [listMode, n]);

  const Example: React.FC<{ ex: NonNullable<Stage['points'][number]['ex']> }> = ({ ex }) => {
    const neutral = Boolean(ex.ll || ex.rl);
    const box = (label: string, text: string, tone: 'bad' | 'good' | 'a' | 'b') => (
      <div
        className={`rounded-2xl border p-4 ${
          tone === 'bad' ? 'border-rose-200 bg-rose-50/80 dark:border-rose-500/30 dark:bg-rose-500/10'
          : tone === 'good' ? 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-500/30 dark:bg-emerald-500/10'
          : tone === 'a' ? 'border-sky-200 bg-sky-50/80 dark:border-sky-500/30 dark:bg-sky-500/10'
          : 'border-violet-200 bg-violet-50/80 dark:border-violet-500/30 dark:bg-violet-500/10'
        }`}
      >
        <div className={`mb-1.5 text-xs font-bold uppercase tracking-wider ${
          tone === 'bad' ? 'text-rose-600 dark:text-rose-400' : tone === 'good' ? 'text-emerald-600 dark:text-emerald-400' : tone === 'a' ? 'text-sky-600 dark:text-sky-400' : 'text-violet-600 dark:text-violet-400'
        }`}>{label}</div>
        <div className="space-y-1 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          {text.split(' · ').map((line, k) => <p key={k}>{line}</p>)}
        </div>
      </div>
    );
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {box(ex.ll ?? '❌ Chưa tốt', ex.l, neutral ? 'a' : 'bad')}
        {box(ex.rl ?? '✅ Tốt hơn', ex.r, neutral ? 'b' : 'good')}
      </div>
    );
  };

  if (listMode) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end"><button className="text-sm text-indigo-600 underline dark:text-indigo-400" onClick={() => setListMode(false)}>Học từng thẻ</button></div>
        {stage.points.map((p, k) => (
          <div key={k} className="card space-y-3 p-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{k + 1}. {p.t}</h3>
            <p className="text-slate-600 dark:text-slate-400">{p.d}</p>
            {p.ex && <Example ex={p.ex} />}
          </div>
        ))}
        <div className="flex justify-end"><button className="btn-primary px-5 py-2.5 text-sm" onClick={onFinish}>Sang chọn đúng →</button></div>
      </div>
    );
  }

  const p = stage.points[i];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {stage.points.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Ý ${k + 1}`} className={`h-2 flex-1 rounded-full transition-colors ${k <= i ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
          ))}
        </div>
        <span className="font-mono text-sm text-slate-500">{i + 1}/{n}</span>
        <button className="text-sm text-indigo-600 underline dark:text-indigo-400" onClick={() => setListMode(true)}>Xem tất cả</button>
      </div>

      <div key={i} className="card animate-fadeIn space-y-5 p-6 lg:p-8">
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Ý {i + 1}</div>
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{p.t}</h3>
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">{p.d}</p>
        </div>
        {p.ex && (
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Ví dụ</div>
            <Example ex={p.ex} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button className="btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)}><ArrowLeft className="h-4 w-4" /> Ý trước</button>
        <span className="hidden text-xs text-slate-400 sm:inline">Dùng phím ← → để chuyển</span>
        {last ? (
          <button className="btn-primary px-5 py-2.5 text-sm" onClick={onFinish}>Hiểu rồi · Luyện chọn đúng <ArrowRight className="h-4 w-4" /></button>
        ) : (
          <button className="btn-primary px-5 py-2.5 text-sm" onClick={() => setI(i + 1)}>Ý tiếp <ArrowRight className="h-4 w-4" /></button>
        )}
      </div>
    </div>
  );
};

export const StageView: React.FC<{ stageId: string; api: ProgressApi }> = ({ stageId, api }) => {
  const [section, setSection] = useState(0);
  const stage = STAGE_BY_ID[stageId];
  if (!stage) return <div className="p-10 text-center text-sm">Không tìm thấy chặng. <a className="underline" href={href('')}>Về lộ trình</a></div>;
  const idx = ROADMAP.indexOf(stage);
  const next = ROADMAP[idx + 1];
  const isDone = api.progress.doneStages.includes(stage.id);
  const Lab = LAB_BY_ID[stage.lab].Component;
  const visual = VISUALS[stage.id];
  const goSection = (k: number) => {
    setSection(k);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full space-y-6 px-4 sm:px-6 lg:px-10 xl:px-14 py-8 animate-fadeIn">
      <a href={href('')} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-indigo-600"><ArrowLeft className="h-3.5 w-3.5" /> Lộ trình</a>

      <header className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Chặng {idx + 1}/{ROADMAP.length} · {stage.duration}</div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl dark:text-white"><span>{stage.emoji}</span> {stage.title}</h1>
        <p className="text-base text-slate-600 dark:text-slate-400">🎯 {stage.goal}</p>
      </header>

      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-base leading-relaxed text-amber-950 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-orange-500/10 dark:text-amber-100">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Hiểu nhanh</span>
        {stage.analogy}
      </div>

      {/* Stepper */}
      <nav className="sticky top-14 z-30 -mx-4 bg-slate-50/90 px-4 py-2 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 xl:-mx-14 xl:px-14 backdrop-blur dark:bg-[#0B0F1A]/90">
        <ol className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2">
          {SECTIONS.map((sct, k) => (
            <li key={sct.name}>
              <button
                onClick={() => goSection(k)}
                className={`flex w-full flex-col items-center justify-center gap-0.5 rounded-xl border px-1 py-1.5 text-xs font-semibold transition sm:flex-row sm:gap-1.5 sm:px-2 sm:py-2 sm:text-sm ${
                  k === section ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : k < section ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <span>{k < section ? '✓' : sct.icon}</span>
                <span className="hidden sm:inline">{k + 1}. {sct.name}</span>
                <span className="sm:hidden">{sct.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {section === 0 && visual && (
        <section className="space-y-3 animate-fadeIn">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">🗺️ {visual.diagram.title}</h2>
            <p className="text-sm text-slate-500">Nhìn cả bức tranh trước khi đi vào chi tiết. Bấm từng khối để xem nó làm gì.</p>
          </div>
          <FlowMap diagram={visual.diagram} />
          <div className="flex justify-end pt-2">
            <button className="btn-primary px-5 py-2.5 text-sm" onClick={() => goSection(1)}>Đi vào từng ý <ArrowRight className="h-4 w-4" /></button>
          </div>
        </section>
      )}

      {section === 1 && <ConceptCards key={stage.id} stage={stage} onFinish={() => goSection(2)} />}

      {section === 2 && visual && (
        <section className="space-y-6 animate-fadeIn">
          <p className="text-base text-slate-600 dark:text-slate-400">Biết rồi chưa đủ — phải chọn đúng khi gặp tình huống thật. Đi theo cây, rồi xem các cặp hay nhầm.</p>
          <DecisionFlow key={stage.id} tree={visual.decide} />
          <CompareTabs key={stage.id + '-cmp'} list={visual.compare} />
          <div className="flex justify-between pt-2">
            <button className="btn-ghost" onClick={() => goSection(1)}><ArrowLeft className="h-4 w-4" /> Ý chính</button>
            <button className="btn-primary px-5 py-2.5 text-sm" onClick={() => goSection(3)}>Bắt tay thực hành <ArrowRight className="h-4 w-4" /></button>
          </div>
        </section>
      )}

      {section === 3 && (
        <section className="space-y-3 animate-fadeIn">
          <p className="text-base text-slate-600 dark:text-slate-400">Bấm thử, quan sát kết quả thay đổi — đây là cách nhanh nhất để “thấm”.</p>
          <Lab />
          {(stage.extraLabs || stage.id === 'stage-6') && (
            <p className="text-sm text-slate-500">
              Thử thêm:{' '}
              {stage.extraLabs?.map((l, k) => (
                <React.Fragment key={l}>{k > 0 && ' · '}<a className="text-indigo-600 underline dark:text-indigo-400" href={href(`lab/${l}`)}>{LAB_BY_ID[l].icon} {LAB_BY_ID[l].title}</a></React.Fragment>
              ))}
              {stage.id === 'stage-6' && <> · <a className="text-indigo-600 underline dark:text-indigo-400" href={href('interview')}>💬 Luyện phỏng vấn</a></>}
            </p>
          )}
          <div className="flex justify-between pt-2">
            <button className="btn-ghost" onClick={() => goSection(2)}><ArrowLeft className="h-4 w-4" /> Chọn đúng</button>
            <button className="btn-primary px-5 py-2.5 text-sm" onClick={() => goSection(4)}>Áp dụng vào việc thật <ArrowRight className="h-4 w-4" /></button>
          </div>
        </section>
      )}

      {section === 4 && (
        <section className="space-y-3 animate-fadeIn">
          <TryNow stage={stage} />
          <div className="flex justify-between pt-2">
            <button className="btn-ghost" onClick={() => goSection(3)}><ArrowLeft className="h-4 w-4" /> Thực hành</button>
            <button className="btn-primary px-5 py-2.5 text-sm" onClick={() => goSection(5)}>Tự kiểm tra <ArrowRight className="h-4 w-4" /></button>
          </div>
        </section>
      )}

      {section === 5 && (
        <section className="space-y-5 animate-fadeIn">
          <SelfCheck key={stage.id} stage={stage} best={api.progress.quizScores[stage.id]} onScore={(n) => api.saveQuiz(stage.id, n)} />
          <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{isDone ? '🎉 Bạn đã hoàn thành chặng này' : 'Xong chặng này chưa?'}</div>
              <div className="text-sm text-slate-500">{next ? `Tiếp theo: ${next.emoji} ${next.title}` : 'Đây là chặng cuối của lộ trình.'}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => api.toggleDone(stage.id)} className={isDone ? 'btn-ghost text-emerald-600' : 'btn-ghost'}>
                {isDone ? <><CheckCircle2 className="h-4 w-4" /> Đã xong</> : <><Circle className="h-4 w-4" /> Đánh dấu xong</>}
              </button>
              {next ? (
                <a className="btn-primary px-5 py-2.5 text-sm" href={href(`stage/${next.id}`)} onClick={() => !isDone && api.toggleDone(stage.id)}>
                  Chặng tiếp <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <a className="btn-primary px-5 py-2.5 text-sm" href={href('')} onClick={() => !isDone && api.toggleDone(stage.id)}>Về lộ trình</a>
              )}
            </div>
          </div>
        </section>
      )}
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
      <div className="w-full space-y-3 px-4 sm:px-6 lg:px-10 xl:px-14 py-8 animate-fadeIn">
        <a href={href('labs')} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600"><ArrowLeft className="h-3.5 w-3.5" /> Tất cả bài thực hành</a>
        <L />
        {stage && <p className="text-xs text-slate-500">Thuộc <a className="text-indigo-600 underline" href={href(`stage/${stage.id}`)}>Chặng {ROADMAP.indexOf(stage) + 1}: {stage.title}</a></p>}
      </div>
    );
  }
  return (
    <div className="w-full space-y-5 px-4 sm:px-6 lg:px-10 xl:px-14 py-10 animate-fadeIn">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white"><FlaskConical className="h-6 w-6 text-indigo-600" /> Thực hành</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Chạy ngay trên trình duyệt, không cần cài đặt hay API key.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
