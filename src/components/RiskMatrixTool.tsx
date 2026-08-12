import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Filter, Lock, FileX, Zap } from 'lucide-react';

interface RiskMatrixToolProps {
  isDarkMode?: boolean;
}

export const RiskMatrixTool: React.FC<RiskMatrixToolProps> = ({ isDarkMode = false }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const risks = [
    {
      id: 'r1',
      title: 'Hallucination (Ảo giác AI)',
      category: 'Data & Oracle',
      severity: 'Critical',
      impact: 'AI tự bịa ra kịch bản test hoặc quy tắc kinh doanh không có trong spec',
      control: 'Bắt buộc Grounding từ Requirement/AC thật; nếu chưa rõ bắt buộc ghi Open Question',
      metric: 'Tỷ lệ AC Traceability = 100%'
    },
    {
      id: 'r2',
      title: 'Lộ Secret / PII Khách Hàng',
      category: 'Security',
      severity: 'Critical',
      impact: 'Gửi API key, token thật hoặc dữ liệu người dùng thật vào prompt làm rò rỉ an ninh',
      control: 'Truy cập secret qua env (process.env); dùng Masking / Anonymize dữ liệu test',
      metric: 'Số vụ việc lộ secret = 0'
    },
    {
      id: 'r3',
      title: 'Prompt Injection Từ Tài Liệu Ngoài',
      category: 'Security',
      severity: 'High',
      impact: 'Dữ liệu độc hại trong tài liệu/web thao túng AI bỏ qua kiểm tra an toàn',
      control: 'Xem nội dung bên ngoài là DATA thụ động, không phải Instruction điều khiển',
      metric: 'Kiểm duyệt Prompt trước khi chạy'
    },
    {
      id: 'r4',
      title: 'Phá Hoại Data / Môi Trường Test',
      category: 'Execution',
      severity: 'High',
      impact: 'AI tự động thực thi kịch bản DELETE hoặc DROP table ngoài ý muốn',
      control: 'Áp dụng Least Privilege, chạy trên Sandbox/Staging, định nghĩa Scope Cleanup rõ ràng',
      metric: '100% data được cô lập & cleanup'
    },
    {
      id: 'r5',
      title: 'False PASS (Kết quả PASS giả tạo)',
      category: 'Data & Oracle',
      severity: 'Critical',
      impact: 'Bỏ sót lỗi nghiêm trọng vì tin vào câu trả lời "PASS" suông của AI',
      control: 'Bắt buộc thu thập Evidence (Request/Response, Screenshot, DB State) trước khi duyệt',
      metric: '100% PASS case có bằng chứng kèm theo'
    },
    {
      id: 'r6',
      title: 'Flaky Automation Script',
      category: 'Execution',
      severity: 'Medium',
      impact: 'Test script chập chờn gây mất niềm tin vào bộ automation',
      control: 'Chuẩn hóa Selector (role, test-id); Retry tối đa 1 lần; không tự ý sửa Assertion',
      metric: 'Tỷ lệ Flaky Test < 2%'
    },
    {
      id: 'r7',
      title: 'Code Tự Chấm Code (Bias)',
      category: 'Process',
      severity: 'High',
      impact: 'Test case viết bám theo code sai nên không phát hiện ra bug logic',
      control: 'Checker Agent derive test case trực tiếp từ AC gốc, độc lập hoàn toàn với code',
      metric: 'Tỷ lệ Escaped Defect < 1%'
    },
    {
      id: 'r8',
      title: 'Lãng Phí Ngân Sách Token',
      category: 'Cost',
      severity: 'Low',
      impact: 'Gửi toàn bộ codebase vào prompt gây vượt ngưỡng token và chi phí cao',
      control: 'Chắt lọc đúng Context liên quan; chia làm từng phase nhỏ; dùng model phù hợp',
      metric: 'Tối ưu lượng token per ticket'
    }
  ];

  const filtered = selectedCategory === 'all' 
    ? risks 
    : risks.filter(r => r.category === selectedCategory);

  return (
    <div className={`border rounded-2xl p-4 lg:p-6 my-6 shadow-sm space-y-4 transition-colors ${
      isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200 shadow-xl' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className={`flex items-center justify-between border-b pb-3 flex-wrap gap-2 ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-2 border rounded-lg ${
            isDarkMode ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>AI Testing Risk Control Matrix</h4>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>8 Rủi ro phổ biến & Phương pháp kiểm soát cho Senior QA Manager</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {['all', 'Data & Oracle', 'Security', 'Execution', 'Process', 'Cost'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-600 text-white font-medium'
                  : isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((r) => (
          <div 
            key={r.id}
            className={`border rounded-xl p-3.5 space-y-2 transition-all ${
              isDarkMode 
                ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' 
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold flex items-center gap-1.5 ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                <AlertTriangle className={`w-4 h-4 ${
                  r.severity === 'Critical' ? 'text-rose-500' : r.severity === 'High' ? 'text-amber-500' : 'text-cyan-600'
                }`} />
                {r.title}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                r.severity === 'Critical' ? isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-100 text-rose-800 border-rose-200' :
                r.severity === 'High' ? isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-100 text-amber-800 border-amber-200' :
                isDarkMode ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-100 text-cyan-800 border-cyan-200'
              }`}>
                {r.severity}
              </span>
            </div>

            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <strong>Tác động:</strong> {r.impact}
            </p>

            <div className={`p-2.5 border rounded-lg text-xs space-y-1 ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-800/80 text-slate-200' 
                : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-start gap-1.5 text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Kiểm soát: {r.control}</span>
              </div>
              <div className={`text-[11px] pl-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Metric theo dõi: <span className="text-indigo-600 font-mono font-semibold">{r.metric}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
