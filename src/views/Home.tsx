import React from 'react';
import { ArrowRight, BadgeCheck, CheckCircle2, ExternalLink, FlaskConical, GraduationCap, PlayCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { ROADMAP, SOURCES } from '../data/roadmap';
import { LABS, LAB_BY_ID } from '../components/labs/registry';
import { href } from '../lib/router';
import { ProgressApi } from '../lib/progress';
import { stageVars } from '../lib/stageTheme';
import { AiExplainer } from '../components/AiExplainer';
import { Ring, SECTIONS } from './Lesson';
import { Stage } from '../types';

const px = 'px-4 sm:px-6 lg:px-10 xl:px-14';
const pad = (n: number) => String(n).padStart(2, '0');

const PHASES: Record<number, { tag: string; title: string; sub: string }> = {
  0: { tag: 'Giai đoạn 1', title: 'Dùng AI để test', sub: 'Hiểu AI, viết prompt đúng, dùng an toàn · ISTQB CT-GenAI' },
  3: { tag: 'Giai đoạn 2', title: 'Test hệ thống CÓ AI', sub: 'Đo chất lượng model, kỹ thuật test, đưa vào thực chiến · ISTQB CT-AI' },
};

const SectionTitle: React.FC<{ kicker: string; title: React.ReactNode; sub?: string; center?: boolean }> = ({ kicker, title, sub, center }) => (
  <div className={center ? 'mx-auto max-w-3xl text-center' : ''}>
    <div className="text-xs font-bold uppercase tracking-[.2em] text-indigo-600 dark:text-indigo-400">{kicker}</div>
    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 lg:text-4xl dark:text-white">{title}</h2>
    {sub && <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-400">{sub}</p>}
  </div>
);

/* ───────── Timeline card ───────── */
const StageCard: React.FC<{ s: Stage; i: number; status: 'done' | 'next' | 'todo' }> = ({ s, i, status }) => {
  const lab = LAB_BY_ID[s.lab];
  const tags = s.points.slice(0, 4).map((p) => p.t);
  const more = s.points.length - tags.length;
  return (
    <a href={href(`stage/${s.id}`)} style={stageVars(s.id)}
      className={`card group relative block overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:p-7 ${status === 'next' ? 'ring-2 ring-[color:var(--ac)] ring-offset-2 ring-offset-slate-50 dark:ring-offset-[#0B0F1A]' : ''}`}>
      <div className="ls-grad absolute inset-x-0 top-0 h-1.5" />
      <div className="ls-blob pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-[.08] blur-2xl transition group-hover:opacity-20" />

      <div className="relative flex items-start gap-4">
        <span className="ls-tint flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl">{s.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="ls-text text-xs font-bold uppercase tracking-[.16em]">Chặng {pad(i + 1)} · {s.duration}</span>
            {status === 'done' && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"><CheckCircle2 className="h-3 w-3" /> Đã xong</span>}
            {status === 'next' && <span className="ls-grad rounded-full px-2 py-0.5 text-[11px] font-bold text-white">Học tiếp</span>}
          </div>
          <h3 className="mt-1 text-xl font-extrabold leading-snug tracking-tight text-slate-900 dark:text-white">{s.title}</h3>
        </div>
      </div>

      <p className="relative mt-3 leading-relaxed text-slate-600 dark:text-slate-400">{s.goal}</p>

      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {tags.map((t) => <span key={t} className="ls-tint ls-ring rounded-lg border px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">{t}</span>)}
        {more > 0 && <span className="rounded-lg border border-dashed border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:border-slate-600">+{more} ý</span>}
      </div>

      <p className="relative mt-4 rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm italic leading-relaxed text-slate-500 lg:hidden dark:bg-slate-800/50 dark:text-slate-400">{s.analogy}</p>

      <div className="relative mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5"><FlaskConical className="h-4 w-4" /> {lab.title}</span>
        <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> {s.istqb.split(' · ')[0]}</span>
        <span className="ls-text ml-auto inline-flex items-center gap-1 font-bold">Vào học <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
    </a>
  );
};

/* ───────── Page ───────── */
export const RoadmapView: React.FC<{ api: ProgressApi }> = ({ api }) => {
  const done = new Set(api.progress.doneStages);
  const next = ROADMAP.find((s) => !done.has(s.id)) ?? ROADMAP[0];
  const nextIdx = ROADMAP.indexOf(next);
  const allDone = done.size === ROADMAP.length;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="animate-fadeIn">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="ls-dots pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-indigo-400 opacity-[.16] blur-3xl dark:opacity-30" />
        <div className="pointer-events-none absolute -bottom-56 right-[-6rem] h-[34rem] w-[34rem] rounded-full bg-fuchsia-400 opacity-[.14] blur-3xl dark:opacity-25" />

        <div className={`relative grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:py-20 xl:gap-16 ${px}`}>
          <div className="space-y-7">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Sparkles className="h-4 w-4" /> Dành cho tester · Không cần toán, không cần code
            </span>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl xl:text-[4rem] dark:text-white">
              Học AI cho Tester<br />
              <span className="relative inline-block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                từ con số 0.
                <svg className="absolute -bottom-3 left-0 w-full text-violet-300 dark:text-violet-500/60" viewBox="0 0 300 12" preserveAspectRatio="none"><path d="M2 9 Q 75 2 150 7 T 298 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
              </span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl dark:text-slate-300">
              Hiểu AI trong 1 phút, rồi đi 6 chặng để <b className="text-slate-900 dark:text-white">dùng AI để test</b> và <b className="text-slate-900 dark:text-white">test được hệ thống có AI</b>. Mỗi chặng: xem sơ đồ, bấm thử, mang prompt về dùng ngay.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href={href(`stage/${next.id}`)} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:shadow-2xl">
                {done.size ? `Học tiếp · Chặng ${nextIdx + 1}` : 'Bắt đầu Chặng 1'} <ArrowRight className="h-5 w-5" />
              </a>
              <button onClick={() => scrollTo('how')} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-base font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <PlayCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> AI hoạt động thế nào?
              </button>
            </div>
            <dl className="grid max-w-2xl grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
              {[
                [String(ROADMAP.length), 'chặng học'],
                [String(LABS.length), 'bài thực hành'],
                ['6–10', 'tuần'],
                ['2', 'chứng chỉ ISTQB'],
              ].map(([v, l]) => (
                <div key={l} className="border-l-2 border-indigo-200 pl-3 dark:border-indigo-500/40">
                  <dt className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{v}</dt>
                  <dd className="text-sm text-slate-500">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Journey card */}
          <div style={stageVars(next.id)} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-300/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
            <div className="flex items-center gap-4">
              <Ring value={done.size} total={ROADMAP.length} size={68} />
              <div>
                <div className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">Hành trình của bạn</div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">{allDone ? '🎉 Đã hoàn thành lộ trình!' : done.size ? `Đã xong ${done.size}/${ROADMAP.length} chặng` : 'Chưa bắt đầu — vào thôi!'}</div>
              </div>
            </div>

            <a href={href(`stage/${next.id}`)} className="ls-tint ls-ring group mt-5 flex items-center gap-4 rounded-2xl border p-4 transition hover:shadow-md">
              <span className="text-4xl">{next.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="ls-text text-xs font-bold uppercase tracking-[.16em]">{allDone ? 'Ôn lại' : 'Tiếp theo'} · Chặng {pad(nextIdx + 1)}</div>
                <div className="font-extrabold leading-snug text-slate-900 dark:text-white">{next.title}</div>
              </div>
              <span className="ls-grad flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-md transition group-hover:translate-x-1"><ArrowRight className="h-5 w-5" /></span>
            </a>

            <ol className="mt-5 space-y-1">
              {ROADMAP.map((s, i) => {
                const st = done.has(s.id) ? 'done' : s.id === next.id ? 'next' : 'todo';
                return (
                  <li key={s.id} style={stageVars(s.id)}>
                    <a href={href(`stage/${s.id}`)} className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold ${st === 'done' ? 'bg-emerald-500 text-white' : st === 'next' ? 'ls-grad text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                        {st === 'done' ? '✓' : i + 1}
                      </span>
                      <span className={`truncate ${st === 'todo' ? 'text-slate-500 dark:text-slate-400' : 'font-semibold text-slate-800 dark:text-slate-100'}`}>{s.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ── HOW AI WORKS ── */}
      <section id="how" className={`scroll-mt-16 py-16 lg:py-20 ${px}`}>
        <div className="grid items-start gap-10 xl:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] xl:gap-14">
          <div className="space-y-6 xl:sticky xl:top-24">
            <SectionTitle kicker="Bước 0 · 1 phút" title="AI thật ra làm gì khi bạn hỏi?" sub="Một mô phỏng ngắn, tự chạy. Xem xong là hiểu vì sao AI giỏi, và vì sao nó bịa." />
            <ul className="space-y-3">
              {[
                ['🧩', 'Cắt câu thành token', 'AI đọc từng mảnh nhỏ, không đọc cả câu.'],
                ['🎲', 'Đoán chữ tiếp theo', 'Chọn chữ có xác suất cao, lặp lại tới hết.'],
                ['📎', 'Cho tài liệu, bớt bịa', 'Có nguồn sự thật thì đoán đúng hơn hẳn.'],
              ].map(([e, t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl dark:bg-indigo-500/15">{e}</span>
                  <div><div className="font-bold text-slate-900 dark:text-white">{t}</div><div className="text-sm text-slate-500 dark:text-slate-400">{d}</div></div>
                </li>
              ))}
            </ul>
          </div>
          <AiExplainer />
        </div>
      </section>

      {/* ── LEARNING FORMAT ── */}
      <section className={`border-y border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-slate-950/60 ${px}`}>
        <SectionTitle center kicker="Cách học" title="Mỗi chặng đi qua 6 bước" sub="Từ nhìn toàn cảnh tới tự kiểm tra, đi hết là nhớ được và dùng được." />
        <ol className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
          {SECTIONS.map((s, k) => (
            <li key={s.id} className="relative">
              <div className="flex h-full flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-800 dark:bg-slate-900">
                <span className="font-mono text-xs font-bold text-indigo-500">{pad(k + 1)}</span>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm dark:bg-slate-800">{s.icon}</span>
                <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{s.hint}</span>
              </div>
              {k < SECTIONS.length - 1 && <ArrowRight className="absolute -right-3.5 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 rounded-full bg-white text-slate-300 xl:block dark:bg-slate-950 dark:text-slate-600" />}
            </li>
          ))}
        </ol>
      </section>

      {/* ── TIMELINE ── */}
      <section id="roadmap" className={`py-16 lg:py-20 ${px}`}>
        <SectionTitle center kicker="Lộ trình" title={<>6 chặng, 2 giai đoạn</>} sub="Đi theo thứ tự là tốt nhất, nhưng bạn có thể nhảy vào chặng nào cũng được." />

        <ol className="relative mx-auto mt-12 max-w-[1500px]">
          <span className="absolute bottom-0 left-5 top-0 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-300 via-indigo-300 to-amber-300 opacity-60 lg:left-1/2 dark:opacity-40" />
          {ROADMAP.map((s, i) => {
            const status = done.has(s.id) ? 'done' : s.id === next.id && !allDone ? 'next' : 'todo';
            const right = i % 2 === 1;
            const phase = PHASES[i];
            return (
              <React.Fragment key={s.id}>
                {phase && (
                  <li className={`relative flex pb-8 pl-14 lg:justify-center lg:pl-0 ${i ? 'pt-10' : ''}`}>
                    <div className="relative z-10 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm lg:text-center dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-xs font-bold uppercase tracking-[.2em] text-indigo-600 dark:text-indigo-400">{phase.tag}</div>
                      <div className="text-xl font-black text-slate-900 dark:text-white">{phase.title}</div>
                      <div className="text-sm text-slate-500">{phase.sub}</div>
                    </div>
                  </li>
                )}
                <li className="relative grid pb-10 pl-14 lg:grid-cols-2 lg:gap-24 lg:pl-0" style={stageVars(s.id)}>
                  <span className={`absolute left-5 top-7 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full font-mono text-sm font-black text-white shadow-lg ring-4 ring-slate-50 lg:left-1/2 dark:ring-[#0B0F1A] ${status === 'done' ? 'bg-emerald-500' : 'ls-grad'}`}>
                    {status === 'done' ? '✓' : pad(i + 1)}
                  </span>
                  <div className={right ? 'lg:col-start-2' : ''}>
                    <StageCard s={s} i={i} status={status} />
                  </div>
                  <div className={`hidden items-center lg:flex ${right ? 'lg:col-start-1 lg:row-start-1 lg:justify-end lg:text-right' : ''}`}>
                    <p className="max-w-md text-lg italic leading-relaxed text-slate-400 dark:text-slate-500">
                      <span className="ls-text mb-1 block text-xs font-bold uppercase not-italic tracking-[.18em]">Hiểu nhanh</span>
                      {s.analogy}
                    </p>
                  </div>
                </li>
              </React.Fragment>
            );
          })}
          <li className="relative flex pl-14 lg:justify-center lg:pl-0">
            <span className="absolute left-5 top-1 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-4 ring-slate-50 lg:left-1/2 dark:bg-white dark:text-slate-900 dark:ring-[#0B0F1A]">🏁</span>
            <div className="pt-16 text-slate-500 lg:text-center">
              <div className="text-lg font-black text-slate-900 dark:text-white">Về đích</div>
              Tự tin dùng AI trong công việc và test được sản phẩm có AI.
            </div>
          </li>
        </ol>
      </section>

      {/* ── CERTS ── */}
      <section className={`pb-16 ${px}`}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 lg:p-10 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-8 lg:grid-cols-[minmax(260px,340px)_1fr]">
            <div>
              <div className="text-xs font-bold uppercase tracking-[.2em] text-indigo-600 dark:text-indigo-400">Muốn lấy chứng chỉ?</div>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Học xong là có nền để đọc syllabus gốc</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Cả hai chứng chỉ ISTQB đều yêu cầu đã có CTFL.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { src: SOURCES[1], icon: <BadgeCheck className="h-6 w-6" />, name: 'ISTQB CT-GenAI', what: 'Dùng AI để test', map: 'Chặng 1 · 2 · 3', tone: 'from-emerald-500 to-sky-500' },
                { src: SOURCES[0], icon: <GraduationCap className="h-6 w-6" />, name: 'ISTQB CT-AI', what: 'Test hệ thống có AI', map: 'Chặng 4 · 5 · 6', tone: 'from-indigo-500 to-violet-500' },
                { src: SOURCES[2], icon: <ShieldAlert className="h-6 w-6" />, name: 'OWASP LLM Top 10', what: 'Rủi ro bảo mật ứng dụng LLM', map: 'Chặng 3 · 6', tone: 'from-rose-500 to-orange-500' },
              ].map((c) => (
                <a key={c.name} href={c.src.url} target="_blank" rel="noreferrer" className="group flex flex-col gap-3 rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow ${c.tone}`}>{c.icon}</span>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white">{c.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{c.what}</div>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2 text-sm">
                    <span className="rounded-lg bg-slate-100 px-2 py-1 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{c.map}</span>
                    <ExternalLink className="h-4 w-4 text-slate-400 transition group-hover:text-indigo-600" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">
          Tiến độ lưu trên trình duyệt này. <button className="underline" onClick={() => confirm('Xoá toàn bộ tiến độ?') && api.reset()}>Xoá tiến độ</button>
        </p>
      </section>
    </div>
  );
};
