import React, { useState } from 'react';
import { LabShell } from './LabShell';

type Part = 'role' | 'context' | 'instruction' | 'input' | 'constraints' | 'output';

const META: Record<Part, { label: string; hint: string; good: RegExp[] }> = {
  role: { label: 'Role', hint: 'Bạn là … (tester, test manager, automation engineer)', good: [/bạn là|you are|đóng vai|act as/i] },
  context: { label: 'Context', hint: 'Hệ thống gì, chức năng nào, môi trường, release…', good: [/ứng dụng|hệ thống|app|tính năng|module|release|môi trường|api/i] },
  instruction: { label: 'Instruction', hint: 'Động từ mệnh lệnh rõ ràng: Sinh / Phân tích / Liệt kê…', good: [/^(sinh|tạo|viết|phân tích|liệt kê|đánh giá|review|generate|create|list|analy[sz]e)/im] },
  input: { label: 'Input data', hint: 'Dán user story, AC, API spec, screenshot…', good: [/ac\d|acceptance|user story|us-|spec|"|“/i] },
  constraints: { label: 'Constraints', hint: 'Chỉ dựa trên…, không bịa…, tối đa…, ghi CẦN LÀM RÕ nếu…', good: [/chỉ|không|tối đa|tối thiểu|must|only|do not|không được|nếu thiếu/i] },
  output: { label: 'Output format', hint: 'Bảng Markdown cột…, JSON schema…, Gherkin…', good: [/bảng|table|json|gherkin|markdown|csv|cột|columns/i] },
};

const ORDER: Part[] = ['role', 'context', 'instruction', 'input', 'constraints', 'output'];

const EXAMPLE: Record<Part, string> = {
  role: 'Bạn là Senior Test Analyst theo chuẩn ISTQB.',
  context: 'Ứng dụng ví điện tử, tính năng nạp tiền từ thẻ ngân hàng, release 2.4, môi trường staging.',
  instruction: 'Sinh test condition và test case áp dụng equivalence partitioning và boundary value analysis (2-value).',
  input: 'US-88: "Là user, tôi muốn nạp 10.000đ – 20.000.000đ/lần từ thẻ đã liên kết." AC1: số tiền ngoài khoảng bị từ chối với thông báo E-101. AC2: thẻ hết hạn bị từ chối (E-102).',
  constraints: 'Chỉ dựa trên AC1–AC2; không bịa mã lỗi; nếu thiếu thông tin ghi "CẦN LÀM RÕ"; tối đa 12 test case.',
  output: 'Bảng Markdown cột: ID | AC | Kỹ thuật | Dữ liệu | Expected result.',
};

type Technique = 'zero' | 'few' | 'chain' | 'meta';
const TECH: Record<Technique, { name: string; addon: string }> = {
  zero: { name: 'Zero-shot', addon: '' },
  few: { name: 'Few-shot', addon: '\n\n[VÍ DỤ]\nVí dụ 1: AC "mật khẩu 8–64 ký tự" → TC: 7 ký tự (invalid), 8 (valid), 64 (valid), 65 (invalid).\nVí dụ 2: …' },
  chain: { name: 'Prompt chaining', addon: '\n\n[BƯỚC 1/3] Chỉ liệt kê test condition. Dừng lại chờ tôi xác nhận trước khi sinh test case.' },
  meta: { name: 'Meta prompting', addon: '\n\n[META] Trước khi làm, hãy đề xuất phiên bản cải tiến của chính prompt này và giải thích vì sao.' },
};

export const PromptSixLab: React.FC = () => {
  const [parts, setParts] = useState<Record<Part, string>>({ role: '', context: '', instruction: '', input: '', constraints: '', output: '' });
  const [tech, setTech] = useState<Technique>('zero');
  const [copied, setCopied] = useState(false);

  const scorePart = (p: Part) => {
    const v = parts[p].trim();
    if (!v) return 0;
    const good = META[p].good.some((r) => r.test(v));
    return v.length > 15 && good ? 2 : 1;
  };
  const total = ORDER.reduce((s, p) => s + scorePart(p), 0);
  const pct = Math.round((total / 12) * 100);

  const prompt =
    ORDER.filter((p) => parts[p].trim())
      .map((p) => `[${META[p].label.toUpperCase()}] ${parts[p].trim()}`)
      .join('\n') + TECH[tech].addon;

  return (
    <LabShell icon="🧩" title="Prompt Builder 6 thành phần (ISTQB CT-GenAI)" subtitle="Điền từng thành phần, chọn kỹ thuật prompting, xem điểm đầy đủ. Bấm “Điền ví dụ” để xem prompt mẫu." badge="CT-GenAI 2.1.1 – 2.1.2">
      <div className="mb-3 flex flex-wrap gap-2">
        <button className="btn-ghost" onClick={() => setParts(EXAMPLE)}>✨ Điền ví dụ</button>
        <button className="btn-ghost" onClick={() => setParts({ role: '', context: '', instruction: '', input: '', constraints: '', output: '' })}>↺ Xoá</button>
        <div className="ml-auto flex flex-wrap gap-1">
          {(Object.keys(TECH) as Technique[]).map((t) => (
            <button key={t} className={t === tech ? 'btn-primary' : 'btn-ghost'} onClick={() => setTech(t)}>{TECH[t].name}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          {ORDER.map((p) => {
            const s = scorePart(p);
            return (
              <label key={p} className="block">
                <span className="flex items-center justify-between font-bold">
                  {META[p].label}
                  <span className={`font-mono text-xs ${s === 2 ? 'text-emerald-600' : s === 1 ? 'text-amber-600' : 'text-slate-400'}`}>{s === 2 ? '✔ tốt' : s === 1 ? '~ cần cụ thể hơn' : '— trống'}</span>
                </span>
                <textarea rows={p === 'input' ? 3 : 2} className="input mt-1" placeholder={META[p].hint} value={parts[p]} onChange={(e) => setParts({ ...parts, [p]: e.target.value })} />
              </label>
            );
          })}
        </div>
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className={`h-full rounded-full transition-all ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="font-mono font-bold">{pct}%</span>
          </div>
          <pre className="max-h-80 min-h-40 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-3 font-mono text-xs text-indigo-200">{prompt || '// Prompt sẽ hiện ở đây…'}</pre>
          <button className="btn-primary mt-2" disabled={!prompt} onClick={() => { navigator.clipboard?.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
            {copied ? '✔ Đã copy' : '📋 Copy prompt'}
          </button>
          <ul className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
            <li>• <b>Few-shot</b>: tác vụ lặp lại, cần format cố định (Gherkin, keyword-driven).</li>
            <li>• <b>Prompt chaining</b>: tác vụ phức tạp, cần người kiểm tra từng bước.</li>
            <li>• <b>Meta prompting</b>: tác vụ mới, chưa biết viết prompt thế nào.</li>
          </ul>
        </div>
      </div>
    </LabShell>
  );
};
