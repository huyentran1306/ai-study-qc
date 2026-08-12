import React, { useState } from 'react';
import { Sparkles, Copy, Check, Send, AlertCircle, Wand2 } from 'lucide-react';
import { CarePromptParts } from '../types';

interface CAREBuilderProps {
  isDarkMode?: boolean;
}

export const CAREBuilder: React.FC<CAREBuilderProps> = ({ isDarkMode = false }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiGeneratedPrompt, setAiGeneratedPrompt] = useState<string | null>(null);

  const [parts, setParts] = useState<CarePromptParts>({
    context: 'Dự án E-Commerce, tính năng Đặt Hàng API POST /api/v1/orders. Môi trường Staging.',
    action: 'Phân tích Spec và thiết kế bộ Test Cases kiểm thử toàn diện cho API này.',
    rules: '- Phủ Happy path, Input validation (400), Authorization (401, 403).\n- Mọi kết quả PASS/FAIL bắt buộc phải kèm cURL evidence và log DB.\n- Nếu chưa rõ timeout -> Đặt câu hỏi Open Question, không tự bịa.',
    example: 'AC-01 -> TC-01: Valid Payload -> Status 200 OK, Response trả về OrderID hợp lệ.',
    sourceOfTruth: 'Requirement Spec v1.4 (Mục 3.2 Order Flow)',
    coverage: 'Positive, Negative, Boundary, Role Permission, Idempotency',
    evidence: 'Sanitized cURL request, HTTP Status, DB Transaction Log',
    stopCondition: 'Dừng ngay nếu phát hiện hành động có nguy cơ xóa dữ liệu sản xuất hoặc thiếu credential.'
  });

  const fullPromptText = `[CONTEXT]
${parts.context}
Nguồn sự thật (Source of Truth): ${parts.sourceOfTruth}

[ACTION]
${parts.action}

[RULES]
${parts.rules}
- Độ phủ yêu cầu (Coverage): ${parts.coverage}
- Yêu cầu bằng chứng (Evidence): ${parts.evidence}
- Điều kiện dừng (Stop Condition): ${parts.stopCondition}

[EXAMPLE]
${parts.example}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefineWithAI = () => {
    setLoading(true);
    setTimeout(() => {
      const optimized = `[CONTEXT]
Target System: ${parts.context}
Nguồn sự thật (Source of Truth): ${parts.sourceOfTruth}
Bối cảnh: Kiểm thử ứng dụng sản xuất với yêu cầu độ tin cậy và chính xác cao.

[ACTION]
Nhiệm vụ chính: ${parts.action}
Cần liệt kê đầy đủ Test Cases, cURL command mẫu, Expected vs Actual Behavior, và các kịch bản ngoại lệ (Negative/Edge Cases).

[RULES]
${parts.rules}
- Độ phủ yêu cầu (Coverage): ${parts.coverage}
- Yêu cầu bằng chứng (Evidence): ${parts.evidence}
- Điều kiện dừng (Stop Condition): ${parts.stopCondition}
- Bắt buộc kiểm tra lại thông tin với Source of Truth trước khi kết luận PASS/FAIL. Không tự đoán logic khi thiếu tài liệu.

[EXAMPLE]
${parts.example}`;

      setAiGeneratedPrompt(optimized);
      setLoading(false);
    }, 500);
  };

  const inputBgClass = isDarkMode 
    ? 'bg-slate-900 border-slate-800 text-slate-200' 
    : 'bg-slate-50 border-slate-200 text-slate-800';

  return (
    <div className={`border rounded-2xl p-4 lg:p-6 my-6 shadow-sm space-y-6 transition-colors ${
      isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200 shadow-xl' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className={`flex items-center justify-between border-b pb-3 ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-2 border rounded-lg ${
            isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Interactive CARE Prompt Builder</h4>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tự tay thiết kế Prompt chuẩn mực CARE + Test Oracle cho dự án QA</p>
          </div>
        </div>
        <button
          onClick={handleRefineWithAI}
          disabled={loading}
          className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-medium transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
        >
          <Wand2 className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          <span>{loading ? 'AI Đang Tối Ưu...' : 'Dùng AI Tối Ưu CARE'}</span>
        </button>
      </div>

      {/* Grid of Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Context */}
        <div className="space-y-1">
          <label className={`block text-xs font-semibold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
            [C] - Context (Bối cảnh & Nguồn sự thật)
          </label>
          <input
            type="text"
            value={parts.context}
            onChange={(e) => setParts({ ...parts, context: e.target.value })}
            className={`w-full border rounded-lg p-2.5 text-xs focus:border-cyan-500 focus:outline-none transition-colors ${inputBgClass}`}
          />
        </div>

        {/* Source of Truth */}
        <div className="space-y-1">
          <label className={`block text-xs font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
            Source of Truth (Nguồn sự thật / AC)
          </label>
          <input
            type="text"
            value={parts.sourceOfTruth}
            onChange={(e) => setParts({ ...parts, sourceOfTruth: e.target.value })}
            className={`w-full border rounded-lg p-2.5 text-xs focus:border-emerald-500 focus:outline-none transition-colors ${inputBgClass}`}
          />
        </div>

        {/* Action */}
        <div className="space-y-1 md:col-span-2">
          <label className={`block text-xs font-semibold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>
            [A] - Action (Nhiệm vụ cụ thể AI cần làm)
          </label>
          <input
            type="text"
            value={parts.action}
            onChange={(e) => setParts({ ...parts, action: e.target.value })}
            className={`w-full border rounded-lg p-2.5 text-xs focus:border-indigo-500 focus:outline-none transition-colors ${inputBgClass}`}
          />
        </div>

        {/* Rules */}
        <div className="space-y-1 md:col-span-2">
          <label className={`block text-xs font-semibold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
            [R] - Rules (Ràng buộc, An toàn & Giới hạn)
          </label>
          <textarea
            rows={2}
            value={parts.rules}
            onChange={(e) => setParts({ ...parts, rules: e.target.value })}
            className={`w-full border rounded-lg p-2.5 text-xs focus:border-amber-500 focus:outline-none font-mono transition-colors ${inputBgClass}`}
          />
        </div>

        {/* Coverage & Evidence */}
        <div className="space-y-1">
          <label className={`block text-xs font-semibold ${isDarkMode ? 'text-violet-400' : 'text-violet-700'}`}>
            Coverage Scope (Phạm vi bao phủ)
          </label>
          <input
            type="text"
            value={parts.coverage}
            onChange={(e) => setParts({ ...parts, coverage: e.target.value })}
            className={`w-full border rounded-lg p-2.5 text-xs focus:border-violet-500 focus:outline-none transition-colors ${inputBgClass}`}
          />
        </div>

        <div className="space-y-1">
          <label className={`block text-xs font-semibold ${isDarkMode ? 'text-rose-400' : 'text-rose-700'}`}>
            Evidence Required (Yêu cầu bằng chứng)
          </label>
          <input
            type="text"
            value={parts.evidence}
            onChange={(e) => setParts({ ...parts, evidence: e.target.value })}
            className={`w-full border rounded-lg p-2.5 text-xs focus:border-rose-500 focus:outline-none transition-colors ${inputBgClass}`}
          />
        </div>

        {/* Example */}
        <div className="space-y-1 md:col-span-2">
          <label className={`block text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            [E] - Example (Mẫu Output mong muốn)
          </label>
          <input
            type="text"
            value={parts.example}
            onChange={(e) => setParts({ ...parts, example: e.target.value })}
            className={`w-full border rounded-lg p-2.5 text-xs focus:border-slate-500 focus:outline-none font-mono transition-colors ${inputBgClass}`}
          />
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            <Check className="w-4 h-4 text-emerald-500" />
            Live Preview (Prompt Hoàn Chỉnh):
          </span>
          <button
            onClick={handleCopy}
            className={`px-3 py-1 rounded text-xs transition-all flex items-center gap-1 font-medium border ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép!' : 'Sao chép Prompt'}</span>
          </button>
        </div>

        <pre className={`border rounded-xl p-4 text-xs font-mono whitespace-pre-wrap overflow-x-auto shadow-inner ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-indigo-200' : 'bg-slate-900 border-slate-800 text-indigo-300'
        }`}>
          {aiGeneratedPrompt || fullPromptText}
        </pre>
      </div>
    </div>
  );
};
