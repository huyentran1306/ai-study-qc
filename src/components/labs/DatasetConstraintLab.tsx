import React, { useState } from 'react';
import { LabShell } from './LabShell';

type Row = { id: string; age: number | null; income: number | string | null; loc: number; loc_defect: number; label: string };

// Training data for a "defect-prone module" / loan-like toy model — with planted defects.
const DATA: Row[] = [
  { id: 'R01', age: 34, income: 18.5, loc: 1200, loc_defect: 40, label: 'approve' },
  { id: 'R02', age: 41, income: 25.0, loc: 800, loc_defect: 12, label: 'approve' },
  { id: 'R03', age: null, income: 12.0, loc: 450, loc_defect: 30, label: 'reject' },
  { id: 'R04', age: 29, income: 'mười lăm', loc: 900, loc_defect: 15, label: 'approve' },
  { id: 'R05', age: 212, income: 30.0, loc: 1500, loc_defect: 20, label: 'approve' },
  { id: 'R06', age: 52, income: 999.0, loc: 700, loc_defect: 10, label: 'approve' },
  { id: 'R07', age: 38, income: 16.0, loc: 300, loc_defect: 420, label: 'reject' },
  { id: 'R08', age: 41, income: 25.0, loc: 800, loc_defect: 12, label: 'approve' },
  { id: 'R09', age: 47, income: 21.0, loc: 650, loc_defect: 25, label: 'Approve ' },
  { id: 'R10', age: 26, income: 9.5, loc: 1100, loc_defect: 60, label: 'reject' },
];

interface Constraint {
  id: string;
  group: 'Single-value' | 'Multi-value' | 'Comparison';
  name: string;
  rule: string;
  check: (rows: Row[]) => { ids: string[]; note: string };
}

const isNum = (v: unknown): v is number => typeof v === 'number' && !Number.isNaN(v);

const CONSTRAINTS: Constraint[] = [
  { id: 'missing', group: 'Single-value', name: 'Missing', rule: 'age, income không được null', check: (r) => ({ ids: r.filter((x) => x.age === null || x.income === null).map((x) => x.id), note: 'Thiếu giá trị' }) },
  { id: 'range', group: 'Single-value', name: 'Range', rule: '18 ≤ age ≤ 100', check: (r) => ({ ids: r.filter((x) => isNum(x.age) && (x.age < 18 || x.age > 100)).map((x) => x.id), note: 'Ngoài khoảng' }) },
  { id: 'type', group: 'Single-value', name: 'Type', rule: 'income là số thực (triệu/tháng)', check: (r) => ({ ids: r.filter((x) => x.income !== null && !isNum(x.income)).map((x) => x.id), note: 'Sai kiểu dữ liệu' }) },
  { id: 'enum', group: 'Single-value', name: 'Type (enum)', rule: "label ∈ {'approve','reject'}", check: (r) => ({ ids: r.filter((x) => !['approve', 'reject'].includes(x.label)).map((x) => x.id), note: 'Giá trị nhãn không hợp lệ' }) },
  {
    id: 'dup', group: 'Multi-value', name: 'Duplicate', rule: 'Không có bản ghi trùng (bỏ qua id)',
    check: (r) => {
      const seen = new Map<string, string>();
      const ids: string[] = [];
      r.forEach((x) => {
        const key = JSON.stringify([x.age, x.income, x.loc, x.loc_defect, x.label]);
        if (seen.has(key)) ids.push(x.id, seen.get(key)!);
        else seen.set(key, x.id);
      });
      return { ids, note: 'Bản ghi trùng (nguy cơ data leakage nếu rơi vào cả train & test)' };
    },
  },
  {
    id: 'outlier', group: 'Multi-value', name: 'Outlier', rule: 'income nằm trong Q1 − 1.5·IQR … Q3 + 1.5·IQR',
    check: (r) => {
      const v = r.map((x) => x.income).filter(isNum).sort((a, b) => a - b);
      const q = (p: number) => v[Math.floor((v.length - 1) * p)];
      const [q1, q3] = [q(0.25), q(0.75)];
      const iqr = q3 - q1;
      return { ids: r.filter((x) => isNum(x.income) && (x.income < q1 - 1.5 * iqr || x.income > q3 + 1.5 * iqr)).map((x) => x.id), note: `Ngoài [${(q1 - 1.5 * iqr).toFixed(1)}, ${(q3 + 1.5 * iqr).toFixed(1)}]` };
    },
  },
  { id: 'useful', group: 'Multi-value', name: 'Useful', rule: 'Thuộc tính phải có giá trị lặp lại (id thì không)', check: (r) => ({ ids: new Set(r.map((x) => x.id)).size === r.length ? ['cột id'] : [], note: '100% giá trị duy nhất → không có pattern để học, nên loại khỏi feature' }) },
  { id: 'gt', group: 'Comparison', name: 'Greater Than', rule: 'loc > loc_defect', check: (r) => ({ ids: r.filter((x) => !(x.loc > x.loc_defect)).map((x) => x.id), note: 'Số dòng lỗi lớn hơn tổng số dòng' }) },
];

const ANSWER_KEY = ['missing', 'range', 'type', 'enum', 'dup', 'outlier', 'useful', 'gt'];

export const DatasetConstraintLab: React.FC = () => {
  const [on, setOn] = useState<string[]>([]);
  const results = CONSTRAINTS.filter((c) => on.includes(c.id)).map((c) => ({ c, ...c.check(DATA) }));
  const flagged = new Set(results.flatMap((r) => r.ids));
  const foundAll = ANSWER_KEY.every((k) => on.includes(k));

  return (
    <LabShell icon="🧹" title="Dataset Constraint Testing Lab" subtitle="Dataset có 8 loại lỗi cài sẵn. Bật từng constraint để tìm chúng." badge="CT-AI 5.1.5">
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>{['id', 'age', 'income', 'loc', 'loc_defect', 'label'].map((h) => <th key={h} className="p-2">{h}</th>)}</tr>
          </thead>
          <tbody>
            {DATA.map((r) => (
              <tr key={r.id} className={`border-t border-slate-100 dark:border-slate-800 ${flagged.has(r.id) ? 'bg-rose-50 dark:bg-rose-500/10' : ''}`}>
                <td className="p-2">{r.id}</td>
                <td>{r.age ?? <i className="text-rose-500">null</i>}</td>
                <td>{r.income === null ? <i className="text-rose-500">null</i> : String(r.income)}</td>
                <td>{r.loc}</td>
                <td>{r.loc_defect}</td>
                <td>“{r.label}”</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {CONSTRAINTS.map((c) => (
          <label key={c.id} className={`flex cursor-pointer items-start gap-2 rounded-xl border p-2.5 ${on.includes(c.id) ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500/60 dark:bg-indigo-500/10' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'}`}>
            <input type="checkbox" className="mt-0.5 accent-indigo-600" checked={on.includes(c.id)} onChange={() => setOn((s) => (s.includes(c.id) ? s.filter((x) => x !== c.id) : [...s, c.id]))} />
            <span><span className="chip mr-1 border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">{c.group}</span><b>{c.name}</b><span className="block font-mono text-xs text-slate-500">{c.rule}</span></span>
          </label>
        ))}
      </div>

      {results.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {results.map(({ c, ids, note }) => (
            <div key={c.id} className={`rounded-lg p-2 font-mono text-xs ${ids.length ? 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'}`}>
              {ids.length ? '❌' : '✅'} [{c.name}] {ids.length ? `${[...new Set(ids)].join(', ')} — ${note}` : 'Không vi phạm'}
            </div>
          ))}
        </div>
      )}
      {foundAll && (
        <p className="mt-3 rounded-xl bg-indigo-50 p-3 dark:bg-indigo-500/10">
          🎉 Đủ 8 lỗi! Trong thực tế, các constraint này được <b>tự động hoá trong data pipeline</b> và báo cáo cho data scientist (dữ liệu train) hoặc đội vận hành (dữ liệu production).
        </p>
      )}
    </LabShell>
  );
};
