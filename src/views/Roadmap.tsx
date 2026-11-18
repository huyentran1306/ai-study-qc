import React from 'react';
import { ArrowLeft, ArrowRight, Clock, FlaskConical } from 'lucide-react';
import { ROADMAP, SOURCES } from '../data/roadmap';
import { LABS, LAB_BY_ID } from '../components/labs/registry';
import { href } from '../lib/router';
import { ProgressApi } from '../lib/progress';
import { stageVars } from '../lib/stageTheme';
import { AiExplainer } from '../components/AiExplainer';

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
            <li key={s.id} style={stageVars(s.id)}>
              <a href={href(`stage/${s.id}`)} className="card relative flex h-full flex-col gap-3 overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                <span className="ls-grad absolute inset-x-0 top-0 h-1" />
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
