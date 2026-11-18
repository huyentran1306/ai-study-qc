import React, { useState } from 'react';
import { LabShell } from './LabShell';

/**
 * Toggle the ingredients of a prompt and watch the (simulated) AI answer go from
 * vague + hallucinated to a precise, reviewable test-case table.
 */
type Key = 'role' | 'context' | 'technique' | 'constraints' | 'format';

const INGREDIENTS: { k: Key; icon: string; name: string; text: string; effect: string }[] = [
  { k: 'context', icon: '📋', name: 'Bối cảnh & yêu cầu', text: 'User story: chuyển tiền nội bộ. AC1: 10.000đ – 50.000.000đ/lần. AC2: cần OTP, sai 3 lần khoá 30 phút.', effect: 'AI biết app thật làm gì → hết đoán mò.' },
  { k: 'technique', icon: '🧪', name: 'Kỹ thuật test', text: 'Áp dụng phân tích giá trị biên (boundary value) cho số tiền.', effect: 'Xuất hiện các giá trị biên mà người mới hay quên.' },
  { k: 'constraints', icon: '🚧', name: 'Ràng buộc', text: 'Chỉ dựa trên AC ở trên. Thiếu thông tin thì ghi “CẦN LÀM RÕ”, không tự bịa.', effect: 'Các ý bịa biến mất, AI biết hỏi lại.' },
  { k: 'format', icon: '📐', name: 'Định dạng kết quả', text: 'Trả về bảng: ID | Tình huống | Dữ liệu | Kết quả mong đợi.', effect: 'Ra bảng gọn, copy thẳng vào tool test.' },
  { k: 'role', icon: '🎭', name: 'Vai trò', text: 'Bạn là tester theo chuẩn ISTQB.', effect: 'Dùng đúng thuật ngữ, có cột kỹ thuật.' },
];

interface Row { id: string; name: string; data: string; exp: string; tech?: string; fake?: boolean }

const build = (on: Set<Key>) => {
  let rows: Row[];
  if (!on.has('context')) {
    rows = [
      { id: '1', name: 'Chuyển tiền thành công', data: '—', exp: 'Hệ thống hoạt động đúng' },
      { id: '2', name: 'Chuyển tiền thất bại', data: '—', exp: 'Hiển thị lỗi phù hợp' },
      { id: '3', name: 'Chuyển tiền quốc tế bằng Bitcoin', data: '0.01 BTC', exp: 'Thành công', fake: true },
      { id: '4', name: 'Xác thực bằng vân tay', data: 'Vân tay', exp: 'Đăng nhập thành công', fake: true },
    ];
  } else {
    rows = [
      { id: 'TC1', name: 'Chuyển tiền hợp lệ, OTP đúng', data: '1.000.000đ', exp: 'Thành công, trừ số dư', tech: 'EP' },
      { id: 'TC2', name: 'Số tiền dưới mức tối thiểu', data: '5.000đ', exp: 'Báo lỗi: tối thiểu 10.000đ', tech: 'EP' },
      { id: 'TC3', name: 'Nhập sai OTP 3 lần', data: 'OTP sai ×3', exp: 'Khoá giao dịch 30 phút', tech: 'EP' },
    ];
    if (on.has('technique')) {
      rows.push(
        { id: 'TC4', name: 'Biên dưới − 1', data: '9.999đ', exp: 'Báo lỗi', tech: 'BVA' },
        { id: 'TC5', name: 'Biên dưới', data: '10.000đ', exp: 'Thành công', tech: 'BVA' },
        { id: 'TC6', name: 'Biên trên', data: '50.000.000đ', exp: 'Thành công', tech: 'BVA' },
        { id: 'TC7', name: 'Biên trên + 1', data: '50.000.001đ', exp: 'Báo lỗi', tech: 'BVA' },
      );
    }
    if (!on.has('constraints')) rows.push({ id: 'TC8', name: 'Hoàn tiền tự động sau 24 giờ', data: '—', exp: 'Tiền về lại tài khoản', fake: true });
  }
  return rows;
};

const LEVELS = ['😬 Kém', '😐 Tạm', '🙂 Khá', '😀 Tốt', '🤩 Rất tốt', '🏆 Xuất sắc'];

export const PromptMagicLab: React.FC = () => {
  const [on, setOn] = useState<Set<Key>>(new Set());
  const toggle = (k: Key) => setOn((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const rows = build(on);
  const fakes = rows.filter((r) => r.fake).length;
  const level = on.size;
  const prompt = ['Viết test case cho chức năng chuyển tiền.', ...INGREDIENTS.filter((i) => on.has(i.k)).map((i) => i.text)].join('\n');

  return (
    <LabShell icon="🪄" title="Prompt tệ vs Prompt tốt" subtitle="Cùng một yêu cầu “viết test case chuyển tiền”. Bật từng thành phần và xem câu trả lời của AI thay đổi thế nào. (Câu trả lời là mô phỏng.)">
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="space-y-2">
          {INGREDIENTS.map((i) => {
            const active = on.has(i.k);
            return (
              <button key={i.k} onClick={() => toggle(i.k)} className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition ${active ? 'border-indigo-500 bg-indigo-50 shadow-sm dark:bg-indigo-500/15' : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900'}`}>
                <span className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition ${active ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <span className={`h-4 w-4 rounded-full bg-white shadow transition ${active ? 'translate-x-4' : ''}`} />
                </span>
                <span>
                  <span className="font-bold text-slate-900 dark:text-white">{i.icon} {i.name}</span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{active ? `✨ ${i.effect}` : i.text}</span>
                </span>
              </button>
            );
          })}
          <button className="text-xs text-indigo-600 underline" onClick={() => setOn(on.size === INGREDIENTS.length ? new Set() : new Set(INGREDIENTS.map((i) => i.k)))}>
            {on.size === INGREDIENTS.length ? 'Tắt hết' : 'Bật hết'}
          </button>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl bg-slate-950 p-3 font-mono text-xs leading-relaxed text-indigo-200">
            <div className="mb-1 text-xs uppercase tracking-wider text-slate-500">Prompt bạn gửi</div>
            <pre className="whitespace-pre-wrap">{prompt}</pre>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className={`h-full rounded-full transition-all duration-500 ${level >= 4 ? 'bg-emerald-500' : level >= 2 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${(level / 5) * 100}%` }} />
            </div>
            <span className="w-24 text-right text-sm font-bold">{LEVELS[level]}</span>
          </div>

          <div key={[...on].sort().join()} className="animate-fadeIn rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>🤖 AI trả lời</span>
              {fakes > 0 && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">{fakes} ý bịa</span>}
            </div>
            {on.has('format') ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-500"><tr><th className="py-1 pr-2">ID</th>{on.has('role') && <th className="pr-2">Kỹ thuật</th>}<th className="pr-2">Tình huống</th><th className="pr-2">Dữ liệu</th><th>Kết quả mong đợi</th></tr></thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className={`border-t border-slate-100 dark:border-slate-800 ${r.fake ? 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300' : ''}`}>
                        <td className="py-1.5 pr-2 font-mono">{r.id}</td>
                        {on.has('role') && <td className="pr-2 font-mono">{r.tech ?? '—'}</td>}
                        <td className="pr-2">{r.name}{r.fake && ' ⚠️'}</td>
                        <td className="pr-2 font-mono">{r.data}</td>
                        <td>{r.exp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                Dưới đây là một số test case bạn có thể tham khảo:{' '}
                {rows.map((r, i) => (
                  <span key={r.id} className={r.fake ? 'rounded bg-rose-100 px-1 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300' : ''}>
                    {i + 1}) {r.name}{r.data !== '—' ? ` (${r.data})` : ''} — {r.exp.toLowerCase()}{r.fake ? ' ⚠️' : ''}.{' '}
                  </span>
                ))}
                Hy vọng hữu ích!
              </p>
            )}
            {on.has('constraints') && on.has('context') && (
              <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1.5 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">❓ CẦN LÀM RÕ: AC chưa nói về phí chuyển khoản và hạn mức theo ngày.</p>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {level === 0 && '👉 Bắt đầu bằng cách bật “Bối cảnh & yêu cầu” — thay đổi lớn nhất nằm ở đây.'}
            {level > 0 && level < 5 && '👉 Bật tiếp các thành phần còn lại để thấy câu trả lời tốt dần lên.'}
            {level === 5 && '🎉 Đây là prompt đầy đủ. Nhưng vẫn phải đối chiếu với AC trước khi dùng!'}
          </p>
        </div>
      </div>
    </LabShell>
  );
};
