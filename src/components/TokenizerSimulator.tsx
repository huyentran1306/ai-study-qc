import React, { useState } from 'react';
import { Cpu, Zap, Layers, AlertTriangle } from 'lucide-react';

interface TokenizerSimulatorProps {
  isDarkMode?: boolean;
}

export const TokenizerSimulator: React.FC<TokenizerSimulatorProps> = ({ isDarkMode = false }) => {
  const [inputText, setInputText] = useState(
    "Mục tiêu của Senior QA: Hiểu bản chất LLM dự đoán token tiếp theo, kiểm soát rủi ro hallucination bằng Test Oracle và bằng chứng evidence."
  );
  const [temperature, setTemperature] = useState(0.2);

  // Simple token estimator algorithm
  const words = inputText.trim().split(/\s+/).filter(Boolean);
  // Estimate tokens (~1.3 tokens per Vietnamese word/symbol)
  const estimatedTokens = Math.ceil(inputText.length / 3.5);
  const maxContext = 128000; // 128k context window
  const contextPercentage = ((estimatedTokens / maxContext) * 100).toFixed(4);

  // Generate simulated colorized token chunks
  const tokens = inputText.split(/(\s+|[.,!?;:()"])/).filter(Boolean);

  const darkColors = [
    'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'bg-rose-500/20 text-rose-300 border-rose-500/30',
  ];

  const lightColors = [
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-cyan-100 text-cyan-800 border-cyan-200',
    'bg-emerald-100 text-emerald-800 border-emerald-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-amber-100 text-amber-800 border-amber-200',
    'bg-rose-100 text-rose-800 border-rose-200',
  ];

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <div className={`border rounded-2xl p-4 lg:p-6 my-6 shadow-sm space-y-4 transition-colors ${
      isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200 shadow-xl' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className={`flex items-center justify-between border-b pb-3 ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-2 border rounded-lg ${
            isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
          }`}>
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Interactive Tokenizer & Context Window Simulator</h4>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Thử nghiệm cách LLM phân rã câu từ thành hạt Token và tính toán Context</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 text-xs font-mono rounded-full border ${
          isDarkMode ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
        }`}>
          Live Simulator
        </span>
      </div>

      {/* Input Text Area */}
      <div>
        <label className={`block text-xs font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Nhập văn bản Prompt hoặc Requirement để phân tích:
        </label>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition-colors ${
            isDarkMode 
              ? 'bg-slate-900 border-slate-700/80 text-slate-200' 
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        />
      </div>

      {/* Token Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`border rounded-xl p-3 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <span className={`text-[11px] block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Số Ký Tự</span>
          <span className={`text-lg font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{inputText.length}</span>
        </div>

        <div className={`border rounded-xl p-3 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <span className={`text-[11px] block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Số Từ (Words)</span>
          <span className="text-lg font-bold text-cyan-600 font-mono">{words.length}</span>
        </div>

        <div className={`border rounded-xl p-3 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <span className={`text-[11px] block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Ước Tính Tokens</span>
          <span className="text-lg font-bold text-indigo-600 font-mono">~{estimatedTokens}</span>
        </div>

        <div className={`border rounded-xl p-3 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <span className={`text-[11px] block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>% Context Window (128k)</span>
          <span className="text-lg font-bold text-emerald-600 font-mono">{contextPercentage}%</span>
        </div>
      </div>

      {/* Temperature Slider */}
      <div className={`border rounded-xl p-3 space-y-2 ${
        isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between text-xs">
          <span className={`font-medium flex items-center gap-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            <Zap className="w-4 h-4 text-amber-500" />
            Nhiệt độ Model (Temperature): <span className="font-mono font-bold text-amber-600">{temperature}</span>
          </span>
          <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {temperature < 0.3 ? '🎯 Rất chính xác, thích hợp cho QA/Automation' : temperature < 0.7 ? '⚖️ Cân bằng' : '🎨 Sáng tạo cao (Dễ Hallucination!)'}
          </span>
        </div>
        <input
          type="range"
          min="0.0"
          max="1.0"
          step="0.05"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
      </div>

      {/* Visual Token Breakdown */}
      <div>
        <span className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Minh họa các Token được phân tách (Mỗi màu đại diện cho 1 Token độc lập):
        </span>
        <div className={`flex flex-wrap gap-1.5 border rounded-xl p-3 max-h-36 overflow-y-auto ${
          isDarkMode ? 'bg-slate-900 border-slate-800/90' : 'bg-slate-50 border-slate-200'
        }`}>
          {tokens.map((token, idx) => {
            const colorClass = colors[idx % colors.length];
            return (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded text-xs font-mono border ${colorClass} transition-all hover:scale-105`}
              >
                {token === ' ' ? '␣' : token}
              </span>
            );
          })}
        </div>
      </div>

      <div className={`p-3 border rounded-xl flex items-start gap-2 text-xs ${
        isDarkMode 
          ? 'bg-indigo-950/30 border-indigo-800/40 text-indigo-300' 
          : 'bg-indigo-50 border-indigo-100 text-indigo-900'
      }`}>
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <strong>Lời khuyên phỏng vấn Senior QA:</strong> Khi chạy API/UI Testing automation, luôn đặt <strong>Temperature = 0.0 - 0.2</strong> để mô hình phản hồi chính xác, ổn định và không ngẫu nhiên biến đổi kết quả kịch bản test.
        </p>
      </div>
    </div>
  );
};
