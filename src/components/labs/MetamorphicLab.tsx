import React, { useState } from 'react';
import { LabShell } from './LabShell';

interface House { area: number; bedrooms: number; district: 'Q1' | 'Q3' | 'Q7' | 'Thủ Đức'; floor: number; listingId: string; agent: string }

const BASE: Record<House['district'], number> = { Q1: 210, Q3: 150, Q7: 95, 'Thủ Đức': 60 };

/**
 * Simulated "black-box ML" house price model (triệu VND).
 * Hidden defects (for learners to discover via MRs):
 *  1. Above 180 m², price DROPS with area (monotonicity violation).
 *  2. Listing IDs that start with "VIP" get +8% (invariance violation – irrelevant attribute changes output).
 */
const predict = (h: House): number => {
  const perM2 = BASE[h.district];
  let areaEffect = h.area <= 180 ? h.area : 180 - (h.area - 180) * 0.6; // ← bug 1
  let price = areaEffect * perM2 * (1 + h.bedrooms * 0.03) * (1 + Math.min(h.floor, 30) * 0.004);
  if (h.listingId.startsWith('VIP')) price *= 1.08; // ← bug 2
  // small deterministic "noise" from the agent name — but symmetric, should NOT matter (within tolerance)
  price *= 1 + ((h.agent.length % 3) - 1) * 0.001;
  return Math.round(price);
};

interface MR {
  id: string;
  type: 'Monotonicity' | 'Invariance' | 'Consistency';
  label: string;
  expect: string;
  follow: (h: House) => House;
  holds: (src: number, fol: number) => boolean;
}

const MRS: MR[] = [
  { id: 'mr-area', type: 'Monotonicity', label: 'Tăng diện tích thêm 40 m²', expect: "giá' ≥ giá", follow: (h) => ({ ...h, area: h.area + 40 }), holds: (s, f) => f >= s },
  { id: 'mr-bed', type: 'Monotonicity', label: 'Thêm 1 phòng ngủ', expect: "giá' ≥ giá", follow: (h) => ({ ...h, bedrooms: h.bedrooms + 1 }), holds: (s, f) => f >= s },
  { id: 'mr-id', type: 'Invariance', label: 'Đổi mã tin đăng (listing ID)', expect: "giá' ≈ giá (±0.5%)", follow: (h) => ({ ...h, listingId: (h.listingId.startsWith('VIP') ? 'STD' : 'VIP') + h.listingId.slice(3) }), holds: (s, f) => Math.abs(f - s) / s <= 0.005 },
  { id: 'mr-agent', type: 'Invariance', label: 'Đổi tên môi giới', expect: "giá' ≈ giá (±0.5%)", follow: (h) => ({ ...h, agent: h.agent + ' Jr.' }), holds: (s, f) => Math.abs(f - s) / s <= 0.005 },
  { id: 'mr-district', type: 'Monotonicity', label: 'Chuyển từ Thủ Đức sang Q1 (khu đắt hơn)', expect: "giá' ≥ giá", follow: (h) => ({ ...h, district: h.district === 'Thủ Đức' ? 'Q1' : h.district }), holds: (s, f) => f >= s },
];

const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const districts: House['district'][] = ['Q1', 'Q3', 'Q7', 'Thủ Đức'];
const genSource = (): House => ({
  area: rnd(40, 260),
  bedrooms: rnd(1, 5),
  district: districts[rnd(0, 3)],
  floor: rnd(1, 25),
  listingId: (Math.random() < 0.3 ? 'VIP' : 'STD') + rnd(1000, 9999),
  agent: ['An', 'Bình', 'Chi', 'Dũng', 'Giang'][rnd(0, 4)],
});

export const MetamorphicLab: React.FC = () => {
  const [selected, setSelected] = useState<string[]>(['mr-area']);
  const [runs, setRuns] = useState<null | { mr: MR; total: number; violations: { src: House; s: number; f: number }[] }[]>(null);
  const [n, setN] = useState(50);

  const run = () => {
    const sources = Array.from({ length: n }, genSource);
    setRuns(
      MRS.filter((m) => selected.includes(m.id)).map((mr) => {
        const violations = [] as { src: House; s: number; f: number }[];
        for (const src of sources) {
          const s = predict(src);
          const f = predict(mr.follow(src));
          if (!mr.holds(s, f)) violations.push({ src, s, f });
        }
        return { mr, total: sources.length, violations };
      }),
    );
  };

  const found = runs?.filter((r) => r.violations.length > 0).length ?? 0;

  return (
    <LabShell icon="🔁" title="Metamorphic Testing Lab — model định giá nhà (black-box)" subtitle="Model có 2 lỗi ẩn. Bạn không có expected price cho từng căn — hãy chọn metamorphic relation, sinh source test case ngẫu nhiên và tìm vi phạm." badge="CT-AI 6.1.5">
      <div className="grid gap-2 sm:grid-cols-2">
        {MRS.map((m) => (
          <label key={m.id} className={`flex cursor-pointer items-start gap-2 rounded-xl border p-2.5 transition ${selected.includes(m.id) ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500/60 dark:bg-indigo-500/10' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'}`}>
            <input type="checkbox" className="mt-0.5 accent-indigo-600" checked={selected.includes(m.id)} onChange={() => setSelected((s) => (s.includes(m.id) ? s.filter((x) => x !== m.id) : [...s, m.id]))} />
            <span>
              <span className="chip mr-1 border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">{m.type}</span>
              <b>{m.label}</b>
              <span className="block font-mono text-[10px] text-slate-500">Kỳ vọng: {m.expect}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2">Số source TC
          <select className="input w-20" value={n} onChange={(e) => setN(+e.target.value)}>
            {[10, 50, 200].map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>
        <button className="btn-primary" disabled={!selected.length} onClick={run}>▶ Sinh follow-up TC & chạy</button>
        {runs && <span className="muted">Đã tìm ra {found} MR bị vi phạm</span>}
      </div>

      {runs && (
        <div className="mt-3 space-y-2">
          {runs.map(({ mr, total, violations }) => (
            <div key={mr.id} className={`rounded-xl border p-3 ${violations.length ? 'border-rose-300 bg-rose-50 dark:border-rose-500/40 dark:bg-rose-500/10' : 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10'}`}>
              <div className="font-bold">{violations.length ? '❌' : '✅'} {mr.label} — {violations.length}/{total} vi phạm</div>
              {violations.slice(0, 3).map((v, i) => (
                <div key={i} className="mt-1 font-mono text-[10px]">
                  src: {v.src.area}m², {v.src.bedrooms}PN, {v.src.district}, ID {v.src.listingId} → {v.s.toLocaleString()} tr | follow-up → {v.f.toLocaleString()} tr
                </div>
              ))}
            </div>
          ))}
          {found >= 2 && (
            <p className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-500/10">
              🎉 Bạn đã lộ ra cả 2 lỗi: (1) giá <b>giảm</b> khi diện tích vượt ~180m² (vi phạm monotonicity — chỉ lộ ra khi source TC có diện tích lớn), (2) mã tin “VIP” làm giá tăng 8% (vi phạm invariance — thuộc tính không liên quan). Lưu ý: MR “đổi tên môi giới” PASS vì sai số nằm trong dung sai — chọn dung sai cũng là một quyết định thiết kế test.
            </p>
          )}
        </div>
      )}
    </LabShell>
  );
};
