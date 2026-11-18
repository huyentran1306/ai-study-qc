import React from 'react';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { ROADMAP } from '../data/roadmap';
import { LABS, LAB_BY_ID } from '../components/labs/registry';
import { href } from '../lib/router';

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
