import React, { useState } from 'react';
import { LabShell, Stat } from './LabShell';

type Gender = 'Nam' | 'Nữ';
interface Applicant { income: number; debt: number; years: number; gender: Gender; age: number }

/**
 * Simulated loan model with a hidden algorithmic bias (penalises one gender slightly, and
 * applicants over 55 more strongly). Learners detect it with counterfactual / disparate impact analysis.
 */
const model = (a: Applicant) => {
  let score = a.income * 2.2 - a.debt * 1.6 + a.years * 3;
  if (a.gender === 'Nữ') score -= 6; // hidden bias #1
  if (a.age > 55) score -= 12; // hidden bias #2
  return score >= 50;
};

const rnd = (a: number, b: number) => Math.round(a + Math.random() * (b - a));
const gen = (): Applicant => ({ income: rnd(15, 60), debt: rnd(0, 40), years: rnd(0, 15), gender: Math.random() < 0.5 ? 'Nam' : 'Nữ', age: rnd(22, 65) });

export const BiasLab: React.FC = () => {
  const [attr, setAttr] = useState<'gender' | 'age'>('gender');
  const [n, setN] = useState(500);
  const [res, setRes] = useState<null | { flips: number; total: number; rateA: number; rateB: number; labelA: string; labelB: string }>(null);

  const run = () => {
    let flips = 0;
    let approvedA = 0, approvedB = 0;
    for (let i = 0; i < n; i++) {
      const base = gen();
      const a: Applicant = attr === 'gender' ? { ...base, gender: 'Nam' } : { ...base, age: 40 };
      const b: Applicant = attr === 'gender' ? { ...base, gender: 'Nữ' } : { ...base, age: 60 };
      const ra = model(a), rb = model(b);
      if (ra) approvedA++;
      if (rb) approvedB++;
      if (ra !== rb) flips++;
    }
    setRes({
      flips, total: n,
      rateA: approvedA / n, rateB: approvedB / n,
      labelA: attr === 'gender' ? 'Nam' : 'Tuổi 40',
      labelB: attr === 'gender' ? 'Nữ' : 'Tuổi 60',
    });
  };

  const ratio = res ? (res.rateA ? res.rateB / res.rateA : 0) : 0;

  return (
    <LabShell icon="⚖️" title="Bias Lab — Disparate Impact Analysis cho model duyệt vay" subtitle="Sinh hồ sơ ngẫu nhiên, tạo counterfactual chỉ đổi MỘT thuộc tính nhạy cảm, so sánh quyết định trên nhiều mẫu để có ý nghĩa thống kê." badge="CT-AI 5.1.2">
      <div className="flex flex-wrap items-center gap-2">
        <span>Thuộc tính nhạy cảm:</span>
        <button className={attr === 'gender' ? 'btn-primary' : 'btn-ghost'} onClick={() => { setAttr('gender'); setRes(null); }}>Giới tính (Nam ↔ Nữ)</button>
        <button className={attr === 'age' ? 'btn-primary' : 'btn-ghost'} onClick={() => { setAttr('age'); setRes(null); }}>Tuổi (40 ↔ 60)</button>
        <select className="input w-24" value={n} onChange={(e) => setN(+e.target.value)}>
          {[20, 500, 5000].map((v) => <option key={v} value={v}>{v} hồ sơ</option>)}
        </select>
        <button className="btn-primary" onClick={run}>▶ Chạy counterfactual</button>
      </div>

      <ol className="mt-3 list-decimal space-y-0.5 pl-5 text-[11px] text-slate-500 dark:text-slate-400">
        <li>Xác định thuộc tính nhạy cảm → 2. Sinh counterfactual (giữ nguyên thu nhập, nợ, thâm niên) → 3. Lấy output model → 4. Phân tích nhiều kết quả.</li>
      </ol>

      {res && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label={`Tỉ lệ duyệt · ${res.labelA}`} value={`${(res.rateA * 100).toFixed(1)}%`} />
            <Stat label={`Tỉ lệ duyệt · ${res.labelB}`} value={`${(res.rateB * 100).toFixed(1)}%`} tone="amber" />
            <Stat label="Quyết định bị đảo" value={`${res.flips}/${res.total}`} tone="rose" hint="chỉ vì đổi thuộc tính nhạy cảm" />
            <Stat label="Disparate impact ratio" value={ratio.toFixed(2)} tone={ratio < 0.8 ? 'rose' : 'emerald'} hint="< 0.8 thường bị coi là dấu hiệu bất lợi (quy tắc 4/5)" />
          </div>
          <p className={`rounded-xl p-3 ${res.flips ? 'bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-200' : 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200'}`}>
            {res.flips
              ? `❌ Có ${res.flips} hồ sơ đổi kết quả chỉ vì thay đổi ${attr === 'gender' ? 'giới tính' : 'tuổi'} — dấu hiệu bias. ${res.total < 100 ? 'Với cỡ mẫu nhỏ, hãy chạy thêm để chắc chắn có ý nghĩa thống kê.' : 'Cỡ mẫu đủ lớn để kết luận và báo cáo defect kèm bằng chứng.'}`
              : '✅ Không phát hiện khác biệt trong lần chạy này. Với cỡ mẫu nhỏ, bias có thể chưa lộ — tăng số hồ sơ.'}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Lưu ý từ syllabus: counterfactual phải <b>thực tế</b> (vd. đổi tuổi 40 → 60 nhưng vẫn giữ “thâm niên 30 năm” có thể phi lý), và có thể kiểm tra <b>tổ hợp</b> thuộc tính (Nữ + trên 55) để lộ bias ẩn.
          </p>
        </div>
      )}
    </LabShell>
  );
};
