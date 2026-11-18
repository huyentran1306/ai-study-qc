import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Lightbulb, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { Comparison, DecideNode, DecisionTree, FlowDiagram } from '../types';

const W = 180;
const H = 66;

/* ═══════════════ ① Bức tranh lớn — interactive flow diagram ═══════════════ */
export const FlowMap: React.FC<{ diagram: FlowDiagram }> = ({ diagram }) => {
  const [sel, setSel] = useState(diagram.nodes[0].id);
  const byId = useMemo(() => Object.fromEntries(diagram.nodes.map((n) => [n.id, n])), [diagram]);
  const node = byId[sel];
  const linked = new Set(diagram.edges.filter(([a, b]) => a === sel || b === sel).flatMap(([a, b]) => [a, b]));
  const idx = diagram.nodes.findIndex((n) => n.id === sel);

  // Point on the box border in the direction of the other node, so arrows touch the box edge.
  const edgePoint = (x: number, y: number, tx: number, ty: number) => {
    const dx = tx - x;
    const dy = ty - y;
    const s = Math.min((W / 2 + 6) / Math.abs(dx || 1e-6), (H / 2 + 6) / Math.abs(dy || 1e-6));
    return [x + dx * s, y + dy * s];
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,.18)_1px,transparent_0)] bg-[length:22px_22px] p-2 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_1px_1px,rgba(129,140,248,.18)_1px,transparent_0)]">
        <svg viewBox="0 0 1200 440" className="h-auto w-full min-w-[720px] text-slate-400" role="img" aria-label={diagram.title}>
          <defs>
            <marker id="fm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="currentColor" />
            </marker>
          </defs>
          {diagram.edges.map(([a, b, label, dashed], i) => {
            const A = byId[a];
            const B = byId[b];
            const [x1, y1] = edgePoint(A.x, A.y, B.x, B.y);
            const [x2, y2] = edgePoint(B.x, B.y, A.x, A.y);
            const on = a === sel || b === sel;
            return (
              <g key={i} className={on ? 'text-indigo-500' : 'text-slate-300 dark:text-slate-600'}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={on ? 3 : 2.5} strokeDasharray={dashed ? '6 6' : undefined} markerEnd={dashed ? undefined : 'url(#fm-arrow)'} />
                {!dashed && (
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6366f1" strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" className="fm-flow" opacity={on ? 1 : 0.35} />
                )}
                {label && (
                  <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 9} textAnchor="middle" className="fill-slate-500 font-mono text-[13px] font-semibold dark:fill-slate-400" style={{ paintOrder: 'stroke', stroke: 'var(--fm-halo)', strokeWidth: 5 }}>
                    {label}
                  </text>
                )}
              </g>
            );
          })}
          {diagram.nodes.map((n, i) => {
            const isSel = n.id === sel;
            return (
              <g key={n.id} transform={`translate(${n.x - W / 2} ${n.y - H / 2})`}>
                <g
                  className="fm-node cursor-pointer outline-none"
                  style={{ animationDelay: `${i * 70}ms` }}
                  onClick={() => setSel(n.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={n.label}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(n.id)}
                >
                  <rect
                    width={W}
                    height={H}
                    rx={16}
                    className={
                      isSel
                        ? 'fill-indigo-600 stroke-indigo-600'
                        : `${n.side ? 'fill-slate-50 dark:fill-slate-900' : 'fill-white dark:fill-slate-800'} ${linked.has(n.id) ? 'stroke-indigo-300' : 'stroke-slate-300 dark:stroke-slate-600'} hover:stroke-indigo-500`
                    }
                    strokeWidth={1.5}
                    strokeDasharray={n.side && !isSel ? '5 4' : undefined}
                  />
                  <foreignObject x={10} y={0} width={W - 16} height={H}>
                    <div className={`flex h-full items-center gap-2.5 ${isSel ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-lg ${isSel ? 'bg-white/20' : 'bg-indigo-50 dark:bg-indigo-500/15'}`}>{n.emoji}</span>
                      <span className="min-w-0 leading-tight">
                        <b className="block text-[14px]">{n.label}</b>
                        {n.sub && <small className={`block text-[11px] ${isSel ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>{n.sub}</small>}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      <div key={node.id} className="animate-fadeIn grid gap-4 rounded-2xl border border-t-4 border-slate-200 border-t-indigo-500 bg-white p-5 md:grid-cols-[1.2fr_1fr] dark:border-slate-800 dark:border-t-indigo-500 dark:bg-slate-900">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-2xl dark:bg-indigo-500/15">{node.emoji}</span>
            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{node.label}</div>
              {node.sub && <div className="text-sm text-slate-500">{node.sub}</div>}
            </div>
          </div>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">{node.what}</p>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" /> {node.tip}
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400">Khối {idx + 1}/{diagram.nodes.length}</span>
            <button className="btn-ghost" onClick={() => setSel(diagram.nodes[(idx + 1) % diagram.nodes.length].id)}>
              Khối tiếp <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════ ③a Khi nào dùng gì — decision tree ═══════════════ */
export const DecisionFlow: React.FC<{ tree: DecisionTree }> = ({ tree }) => {
  const [path, setPath] = useState<{ id: string; picked?: string }[]>([{ id: tree.start }]);
  const current = path[path.length - 1];
  const node = tree.nodes[current.id] as DecideNode;
  const choose = (label: string, next: string) => setPath((p) => [...p.slice(0, -1), { ...p[p.length - 1], picked: label }, { id: next }]);
  const backTo = (i: number) => setPath((p) => [...p.slice(0, i), { id: p[i].id }]);
  const reset = () => setPath([{ id: tree.start }]);

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-indigo-50/60 p-5 dark:border-slate-800 dark:from-slate-900 dark:to-indigo-500/10">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">🧭 {tree.title}</h3>
        {path.length > 1 && <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600" onClick={reset}><RotateCcw className="h-3.5 w-3.5" /> Làm lại</button>}
      </div>

      {path.slice(0, -1).map((p, i) => {
        const n = tree.nodes[p.id];
        return (
          <button key={i} onClick={() => backTo(i)} className="flex w-full flex-wrap justify-between gap-x-4 gap-y-1 rounded-xl border border-dashed border-slate-300 bg-white/70 px-3 py-2 text-left text-sm hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900/60">
            <span className="text-slate-500">{'q' in n ? n.q : ''}</span>
            <span className="flex items-center gap-1 font-semibold text-indigo-700 dark:text-indigo-300"><Check className="h-3.5 w-3.5" /> {p.picked}</span>
          </button>
        );
      })}

      <div key={current.id + path.length} className="animate-fadeIn rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-indigo-500/5 dark:border-slate-700 dark:bg-slate-900">
        {'q' in node ? (
          <>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Bước {path.length}</div>
            <div className="mb-4 mt-1 text-xl font-bold text-slate-900 dark:text-white">{node.q}</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {node.opts.map(([label, next]) => (
                <button key={label} onClick={() => choose(label, next)} className="group flex items-center justify-between gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-left font-semibold transition hover:-translate-y-0.5 hover:border-indigo-500 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-indigo-500/10">
                  <span>{label}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-indigo-500 transition group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-600">Đáp án</div>
            <div className="flex items-center gap-2 text-2xl font-extrabold text-indigo-700 dark:text-indigo-300"><Sparkles className="h-5 w-5" /> {node.answer}</div>
            <p className="max-w-2xl leading-relaxed text-slate-700 dark:text-slate-300">{node.why}</p>
            {node.remember && (
              <div className="flex w-fit items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 font-semibold text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-200">
                <Lightbulb className="h-4 w-4" /> {node.remember}
              </div>
            )}
            <button className="btn-primary px-4 py-2.5 text-sm" onClick={reset}>Thử tình huống khác <RotateCcw className="h-3.5 w-3.5" /></button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════ ③b Đừng nhầm — A vs B ═══════════════ */
export const CompareTabs: React.FC<{ list: Comparison[] }> = ({ list }) => {
  const [i, setI] = useState(0);
  const c = list[i];
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">⚖️ Đừng nhầm</h3>
      <div className="flex flex-wrap gap-2">
        {list.map((x, k) => (
          <button key={k} onClick={() => setI(k)} className={`rounded-xl border-2 px-3 py-1.5 text-sm font-bold transition ${k === i ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}>
            {x.a} <span className="mx-1 font-mono text-[10px] opacity-70">vs</span> {x.b}
          </button>
        ))}
      </div>
      <div key={i} className="animate-fadeIn overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-2 sm:grid-cols-[150px_1fr_1fr]">
          <span className="hidden sm:block" />
          <span className="bg-indigo-50 px-4 py-3 text-base font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">{c.a}</span>
          <span className="bg-slate-100 px-4 py-3 text-base font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-100">{c.b}</span>
        </div>
        {c.rows.map(([k, a, b]) => (
          <div key={k} className="grid grid-cols-2 border-t border-slate-100 text-sm sm:grid-cols-[150px_1fr_1fr] dark:border-slate-800">
            <span className="col-span-2 px-4 pt-3 text-xs font-bold uppercase tracking-wide text-slate-500 sm:col-span-1 sm:py-3">{k}</span>
            <span className="px-4 py-3 leading-relaxed text-slate-800 sm:border-l sm:border-slate-100 dark:text-slate-200 dark:sm:border-slate-800">{a}</span>
            <span className="border-l border-slate-100 px-4 py-3 leading-relaxed text-slate-800 dark:border-slate-800 dark:text-slate-200">{b}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 bg-slate-900 px-4 py-3 font-semibold text-white dark:bg-black">
          <Zap className="h-4 w-4 shrink-0 text-amber-400" /> {c.rule}
        </div>
      </div>
    </div>
  );
};
