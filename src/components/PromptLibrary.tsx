import React, { useState } from 'react';
import { Terminal, Copy, Check, FileCode, Layers, PlayCircle, ShieldCheck } from 'lucide-react';
import { PROMPT_TEMPLATES } from '../data/promptLibraryData';

interface PromptLibraryProps {
  isDarkMode?: boolean;
}

export const PromptLibrary: React.FC<PromptLibraryProps> = ({ isDarkMode = false }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Strategy', 'Playwright UI', 'API CRUD', 'Reviewer'];

  const filteredPrompts = selectedCategory === 'All'
    ? PROMPT_TEMPLATES
    : PROMPT_TEMPLATES.filter(p => p.category === selectedCategory);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Production-Grade Senior QA Prompt Library</h4>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Bộ Prompt mẫu chuẩn sản xuất – Sẵn sàng Copy & Paste vào dự án thực tế</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-600 border-rose-600 text-white font-medium'
                  : isDarkMode 
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Cards List */}
      <div className="space-y-4">
        {filteredPrompts.map((p) => (
          <div 
            key={p.id}
            className={`border rounded-xl p-4 space-y-3 transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800 shadow-md' : 'bg-slate-50 border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 border rounded-full ${
                  isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-100 text-rose-800 border-rose-200'
                }`}>
                  {p.category}
                </span>
                <h5 className={`font-bold text-sm mt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{p.title}</h5>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{p.description}</p>
              </div>

              <button
                onClick={() => handleCopy(p.id, p.fullPrompt)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm"
              >
                {copiedId === p.id ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === p.id ? 'Đã Sao Chép!' : 'Sao Chép Prompt'}</span>
              </button>
            </div>

            <div className={`p-2.5 border rounded-lg text-xs flex items-start gap-2 ${
              isDarkMode 
                ? 'bg-slate-950/60 border-slate-800/80 text-amber-300' 
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}>
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span><strong>Hướng dẫn dùng:</strong> {p.usageNotes}</span>
            </div>

            <pre className="bg-slate-950 border border-slate-800/90 rounded-lg p-3 text-xs font-mono text-slate-300 whitespace-pre-wrap overflow-x-auto max-h-64 custom-scrollbar">
              {p.fullPrompt}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
