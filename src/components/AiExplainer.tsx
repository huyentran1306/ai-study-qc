import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';

/**
 * "Bên trong AI" — a scripted, animated story that shows a complete beginner
 * how an LLM produces an answer, why it makes things up, and how context fixes it.
 * Everything is simulated for teaching; numbers are illustrative.
 */

type Cand = { w: string; p: number };
const QUESTION = 'Viết test case cho form đăng nhập';
const TOKENS = ['Viết', ' test', ' case', ' cho', ' form', ' đăng', ' nhập'];

const GEN: Cand[][] = [
  [{ w: '1.', p: 62 }, { w: 'Dưới đây', p: 18 }, { w: 'Test', p: 12 }, { w: 'Chào bạn', p: 8 }],
  [{ w: ' Đăng nhập', p: 55 }, { w: ' Nhập', p: 25 }, { w: ' Kiểm tra', p: 15 }, { w: ' Mở', p: 5 }],
  [{ w: ' với', p: 48 }, { w: ' thành công', p: 30 }, { w: ' bằng', p: 17 }, { w: ' khi', p: 5 }],
  [{ w: ' email', p: 52 }, { w: ' tài khoản', p: 28 }, { w: ' số điện thoại', p: 15 }, { w: ' khuôn mặt', p: 5 }],
  [{ w: ' và mật khẩu đúng', p: 70 }, { w: ' hợp lệ', p: 20 }, { w: ' sai', p: 10 }],
  [{ w: ' →', p: 81 }, { w: '.', p: 14 }, { w: ',', p: 5 }],
  [{ w: ' vào trang chủ', p: 66 }, { w: ' thành công', p: 24 }, { w: ' hiện lỗi', p: 10 }],
];

const MAP_POINTS = [
  { w: 'đăng nhập', x: 30, y: 32, g: 'a' }, { w: 'login', x: 38, y: 24, g: 'a' }, { w: 'mật khẩu', x: 24, y: 44, g: 'a' },
  { w: 'tài khoản', x: 42, y: 40, g: 'a' }, { w: 'bug', x: 72, y: 30, g: 'b' }, { w: 'lỗi', x: 80, y: 38, g: 'b' },
  { w: 'defect', x: 68, y: 42, g: 'b' }, { w: 'quả chuối', x: 50, y: 82, g: 'c' }, { w: 'con mèo', x: 62, y: 88, g: 'c' },
];

const STEPS = [
  { title: 'Bạn gõ một câu hỏi', note: 'Mọi thứ bắt đầu từ một câu bình thường như bạn vẫn chat.' },
  { title: '① AI cắt câu thành từng mảnh nhỏ (token)', note: 'AI không đọc “câu”, nó đọc từng mảnh. Mỗi mảnh có thể là một từ hoặc một phần của từ.' },
  { title: '② Mỗi mảnh thành một điểm trên “bản đồ ý nghĩa”', note: 'Từ gần nghĩa nằm gần nhau. Nhờ vậy AI “hiểu” đăng nhập gần với login, mật khẩu — và rất xa quả chuối.' },
  { title: '③ AI đoán chữ tiếp theo — từng chữ một', note: 'Ở mỗi bước, AI chấm điểm các chữ có thể đứng tiếp và chọn chữ có khả năng cao. Lặp lại tới khi xong câu trả lời. Đó là toàn bộ “phép màu”.' },
  { title: '④ Vì sao AI bịa?', note: 'Hỏi điều AI không thể biết (chuyện riêng của dự án bạn), nó vẫn đoán chữ tiếp theo như mọi lần. Một đáp án “nghe giống mã lỗi” thường được điểm cao hơn câu “Tôi không biết” → AI trả lời rất tự tin mà không có căn cứ.' },
  { title: '⑤ Cách dùng đúng: đưa tài liệu cho AI', note: 'Dán đúng tài liệu vào câu hỏi, chữ đúng lập tức có điểm cao nhất. AI giỏi nhất khi bạn cho nó “nguồn sự thật”.' },
  { title: 'Tóm lại, chỉ cần nhớ 3 điều', note: '' },
];

const Bars: React.FC<{ cands: Cand[]; chosen?: number; danger?: boolean }> = ({ cands, chosen = 0, danger }) => (
  <div className="space-y-1.5">
    {cands.map((c, i) => (
      <div key={c.w} className="flex items-center gap-2 text-xs">
        <span className={`w-36 shrink-0 truncate font-mono ${i === chosen ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500'}`}>{c.w.trim() || c.w}</span>
        <div className="h-5 flex-1 overflow-hidden rounded-md bg-slate-200/70 dark:bg-slate-800">
          <div
            className={`h-full rounded-md transition-all duration-700 ${i === chosen ? (danger ? 'bg-gradient-to-r from-rose-500 to-orange-400' : 'bg-gradient-to-r from-indigo-500 to-violet-500') : 'bg-slate-400/60 dark:bg-slate-600'}`}
            style={{ width: `${c.p}%` }}
          />
        </div>
        <span className="w-10 text-right font-mono text-slate-500">{c.p}%</span>
      </div>
    ))}
  </div>
);

export const AiExplainer: React.FC = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [tok, setTok] = useState(0); // tokens revealed in step 1
  const [gen, setGen] = useState(0); // generated words in step 3
  const timer = useRef<number | undefined>(undefined);

  // Per-step animation + auto-advance while playing
  useEffect(() => {
    window.clearInterval(timer.current);
    if (step === 1) {
      setTok(0);
      timer.current = window.setInterval(() => setTok((t) => Math.min(t + 1, TOKENS.length)), 380);
    }
    if (step === 3) {
      setGen(0);
      timer.current = window.setInterval(() => setGen((g) => Math.min(g + 1, GEN.length)), 1100);
    }
    return () => window.clearInterval(timer.current);
  }, [step]);

  const durations = [2500, 4200, 5500, 9800, 7000, 7000, 0];
  useEffect(() => {
    if (!playing || step === STEPS.length - 1) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), durations[step]);
    return () => window.clearTimeout(t);
  }, [step, playing]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (s: number) => {
    setPlaying(false);
    setStep(Math.max(0, Math.min(STEPS.length - 1, s)));
  };

  const answer = GEN.slice(0, gen).map((c) => c[0].w).join('');

  return (
    <div className="overflow-hidden rounded-3xl border border-indigo-200/70 bg-white shadow-xl shadow-indigo-500/10 dark:border-indigo-500/20 dark:bg-[#0F1424]">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-white dark:border-slate-800">
        <span className="text-sm font-bold">🔍 Bên trong AI — xem trong 1 phút</span>
        <span className="ml-auto font-mono text-[11px] opacity-80">{step + 1}/{STEPS.length}</span>
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-4 pt-3">
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => go(i)} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`} aria-label={`Bước ${i + 1}`} />
        ))}
      </div>

      <div className="min-h-[300px] space-y-4 p-5">
        <div key={step} className="animate-fadeIn space-y-1">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{STEPS[step].title}</h3>
          {STEPS[step].note && <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{STEPS[step].note}</p>}
        </div>

        {/* Step visuals */}
        {step === 0 && (
          <div className="animate-fadeIn rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
            <div className="ml-auto w-fit rounded-2xl rounded-br-sm bg-indigo-600 px-4 py-2.5 text-sm text-white shadow">{QUESTION}</div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
            {TOKENS.slice(0, tok).map((t, i) => (
              <span key={i} className="animate-pop rounded-lg border px-2.5 py-1.5 font-mono text-sm font-semibold" style={{ borderColor: `hsl(${i * 47} 70% 55%)`, background: `hsl(${i * 47} 80% 55% / .12)` }}>
                {t.replace(' ', '␣')}
              </span>
            ))}
            {tok === TOKENS.length && <span className="animate-fadeIn self-center text-xs text-slate-500">→ {TOKENS.length} token</span>}
          </div>
        )}

        {step === 2 && (
          <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
            <div className="absolute left-[18%] top-[14%] h-[42%] w-[34%] rounded-full bg-indigo-400/15 blur-md" />
            <div className="absolute left-[60%] top-[16%] h-[36%] w-[30%] rounded-full bg-rose-400/15 blur-md" />
            <div className="absolute left-[42%] top-[70%] h-[26%] w-[30%] rounded-full bg-amber-400/20 blur-md" />
            {MAP_POINTS.map((m, i) => (
              <div key={m.w} className="animate-pop absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${m.x}%`, top: `${m.y}%`, animationDelay: `${i * 0.12}s` }}>
                <span className={`h-3 w-3 rounded-full shadow ${m.g === 'a' ? 'bg-indigo-500' : m.g === 'b' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                <span className="mt-0.5 whitespace-nowrap text-[11px] font-semibold text-slate-700 dark:text-slate-300">{m.w}</span>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-slate-900">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">AI đang viết</div>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {answer}
                <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-indigo-500 align-middle" />
              </p>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Chữ tiếp theo có thể là…</div>
              <Bars key={gen} cands={GEN[Math.min(gen, GEN.length - 1)]} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-2xl bg-slate-100 p-4 text-sm dark:bg-slate-900">
              <div className="ml-auto w-fit rounded-2xl rounded-br-sm bg-indigo-600 px-3 py-2 text-white">Mã lỗi khi khoá tài khoản ở app của tôi là gì?</div>
              <div className="w-fit rounded-2xl rounded-bl-sm border border-rose-300 bg-rose-50 px-3 py-2 text-rose-900 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
                Mã lỗi là <b>E-401</b>. <span className="text-[11px]">← nghe rất tự tin, nhưng là đoán</span>
              </div>
            </div>
            <Bars danger cands={[{ w: 'E-401', p: 31 }, { w: 'ERR_LOCKED', p: 27 }, { w: '1003', p: 22 }, { w: 'AUTH-423', p: 14 }, { w: 'Tôi không biết', p: 6 }]} />
          </div>
        )}

        {step === 5 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-2xl bg-slate-100 p-4 text-sm dark:bg-slate-900">
              <div className="ml-auto w-fit max-w-full rounded-2xl rounded-br-sm bg-indigo-600 px-3 py-2 text-white">
                <span className="mb-1 block rounded-lg bg-white/15 px-2 py-1 text-[11px]">📎 Tài liệu: “Khoá tài khoản sau 5 lần sai, trả mã AUTH-423”</span>
                Mã lỗi khi khoá tài khoản là gì?
              </div>
              <div className="w-fit rounded-2xl rounded-bl-sm border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
                Theo tài liệu, mã lỗi là <b>AUTH-423</b> ✅
              </div>
            </div>
            <Bars cands={[{ w: 'AUTH-423', p: 91 }, { w: 'E-401', p: 4 }, { w: 'ERR_LOCKED', p: 3 }, { w: 'Tôi không biết', p: 2 }]} />
          </div>
        )}

        {step === 6 && (
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { e: '🔮', t: 'AI đoán chữ, không tra cứu sự thật', d: 'Câu trả lời “nghe hay” chưa chắc đã đúng.' },
              { e: '📎', t: 'Cho đủ bối cảnh, AI đoán đúng hơn', d: 'Dán user story, AC, tài liệu vào câu hỏi.' },
              { e: '🕵️', t: 'Bạn luôn là người kiểm chứng', d: 'AI làm nhanh, bạn chịu trách nhiệm kết quả.' },
            ].map((c, i) => (
              <div key={c.t} className="animate-pop rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-4 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-violet-500/10" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="text-3xl">{c.e}</div>
                <div className="mt-2 font-bold text-slate-900 dark:text-white">{c.t}</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{c.d}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
        <button className="btn-ghost" onClick={() => go(step - 1)} disabled={step === 0}><ChevronLeft className="h-4 w-4" /></button>
        {step < STEPS.length - 1 ? (
          <button className="btn-ghost" onClick={() => setPlaying((p) => !p)}>{playing ? <><Pause className="h-3.5 w-3.5" /> Tạm dừng</> : <><Play className="h-3.5 w-3.5" /> Tự chạy</>}</button>
        ) : (
          <button className="btn-ghost" onClick={() => { setStep(0); setPlaying(true); }}><RotateCcw className="h-3.5 w-3.5" /> Xem lại</button>
        )}
        <span className="ml-auto text-[10px] text-slate-400">Mô phỏng minh hoạ</span>
        <button className="btn-primary" onClick={() => go(step + 1)} disabled={step === STEPS.length - 1}>Tiếp <ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
};
