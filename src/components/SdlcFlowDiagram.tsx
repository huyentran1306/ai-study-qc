import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Code, 
  CheckSquare, 
  Scale, 
  Wrench, 
  History, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface SdlcFlowDiagramProps {
  isDarkMode?: boolean;
}

export const SdlcFlowDiagram: React.FC<SdlcFlowDiagramProps> = ({ isDarkMode = false }) => {
  const [selectedAgent, setSelectedAgent] = useState<string>('checker');

  const darkAgents = [
    {
      id: 'planner',
      name: 'Planner Agent',
      role: 'Đọc Ticket & Lập Kế Hoạch',
      icon: <FileText className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300',
      description: 'Đọc ticket ADO/Jira, convention & codebase -> phân layer FE/BE, ước tính scope và tạo file plan.md. Tuyệt đối KHÔNG gõ code!',
      rule: 'Không gõ code. Chỉ quy hoạch kiến trúc và định nghĩa task.'
    },
    {
      id: 'implementer',
      name: 'Implementer Agent',
      role: 'Viết Code Theo Plan',
      icon: <Code className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300',
      description: 'Chỉ thực hiện đúng plan.md đã duyệt, tuân thủ convention của dự án. Chạy lint/build gates.',
      rule: 'Chỉ code đúng trong phạm vi plan.md.'
    },
    {
      id: 'checker',
      name: 'Checker Agent',
      role: 'Kiểm Thử Độc Lập (Strict Oracle)',
      icon: <CheckSquare className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
      description: 'Tự derive Test Case trực tiếp từ Acceptance Criteria (AC) gốc. BẮT BUỘC KHÔNG NHÌN VÀO CODE vừa viết để tránh việc "code tự chấm code".',
      rule: '🔴 Độc lập tuyệt đối với Code. Derive test từ Requirement/AC gốc.'
    },
    {
      id: 'judge',
      name: 'Feature Judge Agent',
      role: 'Nghiệm Thu E2E Trên Local Stack',
      icon: <Scale className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
      description: 'Chạy từng AC end-to-end trên môi trường local thật, chụp screenshot, kiểm tra UI -> API -> DB. Chỉ khi đạt 100% mới đóng dấu READY_FOR_PR.',
      rule: 'Cần bằng chứng E2E thực tế (Log/DB/Screenshot).'
    },
    {
      id: 'fixer',
      name: 'Bug Fixer Agent',
      role: 'Sửa Lỗi Đúng Root Cause',
      icon: <Wrench className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
      description: 'Khi Checker hoặc Judge phát hiện bug, Bug Fixer sửa đúng nguyên nhân gốc trong scope, sau đó trả về cho Checker re-verify.',
      rule: 'Sửa đúng scope bug, không lan man.'
    },
    {
      id: 'retro',
      name: 'Retro Agent',
      role: 'Lưu Học Hỏi (Lesson Learned)',
      icon: <History className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/50 bg-purple-500/10 text-purple-300',
      description: 'Ghi lại bài học kinh nghiệm lặp đi lặp lại vào file quy chuẩn convention của dự án để các lần sau AI không tái phạm.',
      rule: 'Chỉ lưu bài học có tính quy luật lặp lại.'
    }
  ];

  const lightAgents = [
    {
      id: 'planner',
      name: 'Planner Agent',
      role: 'Đọc Ticket & Lập Kế Hoạch',
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      color: 'border-indigo-200 bg-indigo-50 text-indigo-800',
      description: 'Đọc ticket ADO/Jira, convention & codebase -> phân layer FE/BE, ước tính scope và tạo file plan.md. Tuyệt đối KHÔNG gõ code!',
      rule: 'Không gõ code. Chỉ quy hoạch kiến trúc và định nghĩa task.'
    },
    {
      id: 'implementer',
      name: 'Implementer Agent',
      role: 'Viết Code Theo Plan',
      icon: <Code className="w-5 h-5 text-cyan-600" />,
      color: 'border-cyan-200 bg-cyan-50 text-cyan-800',
      description: 'Chỉ thực hiện đúng plan.md đã duyệt, tuân thủ convention của dự án. Chạy lint/build gates.',
      rule: 'Chỉ code đúng trong phạm vi plan.md.'
    },
    {
      id: 'checker',
      name: 'Checker Agent',
      role: 'Kiểm Thử Độc Lập (Strict Oracle)',
      icon: <CheckSquare className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      description: 'Tự derive Test Case trực tiếp từ Acceptance Criteria (AC) gốc. BẮT BUỘC KHÔNG NHÌN VÀO CODE vừa viết để tránh việc "code tự chấm code".',
      rule: '🔴 Độc lập tuyệt đối với Code. Derive test từ Requirement/AC gốc.'
    },
    {
      id: 'judge',
      name: 'Feature Judge Agent',
      role: 'Nghiệm Thu E2E Trên Local Stack',
      icon: <Scale className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-200 bg-amber-50 text-amber-800',
      description: 'Chạy từng AC end-to-end trên môi trường local thật, chụp screenshot, kiểm tra UI -> API -> DB. Chỉ khi đạt 100% mới đóng dấu READY_FOR_PR.',
      rule: 'Cần bằng chứng E2E thực tế (Log/DB/Screenshot).'
    },
    {
      id: 'fixer',
      name: 'Bug Fixer Agent',
      role: 'Sửa Lỗi Đúng Root Cause',
      icon: <Wrench className="w-5 h-5 text-rose-600" />,
      color: 'border-rose-200 bg-rose-50 text-rose-800',
      description: 'Khi Checker hoặc Judge phát hiện bug, Bug Fixer sửa đúng nguyên nhân gốc trong scope, sau đó trả về cho Checker re-verify.',
      rule: 'Sửa đúng scope bug, không lan man.'
    },
    {
      id: 'retro',
      name: 'Retro Agent',
      role: 'Lưu Học Hỏi (Lesson Learned)',
      icon: <History className="w-5 h-5 text-purple-600" />,
      color: 'border-purple-200 bg-purple-50 text-purple-800',
      description: 'Ghi lại bài học kinh nghiệm lặp đi lặp lại vào file quy chuẩn convention của dự án để các lần sau AI không tái phạm.',
      rule: 'Chỉ lưu bài học có tính quy luật lặp lại.'
    }
  ];

  const agents = isDarkMode ? darkAgents : lightAgents;
  const currentInfo = agents.find(a => a.id === selectedAgent);

  return (
    <div className={`border rounded-2xl p-4 lg:p-6 my-6 shadow-sm space-y-6 transition-colors ${
      isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200 shadow-xl' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className={`flex items-center justify-between border-b pb-3 ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-2 border rounded-lg ${
            isDarkMode ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-violet-50 border-violet-200 text-violet-600'
          }`}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Multi-Agent SDLC Architecture & Testing Workflow</h4>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Mô hình phân vai Agent chuyên biệt – Giải quyết triệt để rủi ro "Code tự chấm code"</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 text-xs font-mono rounded-full border ${
          isDarkMode ? 'bg-violet-500/10 text-violet-300 border-violet-500/30' : 'bg-violet-50 text-violet-700 border-violet-200'
        }`}>
          SDLC Kit v2
        </span>
      </div>

      {/* Visual Flow Diagram */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 relative">
        {agents.map((agent, index) => {
          const isSelected = agent.id === selectedAgent;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between gap-2 relative ${
                isSelected
                  ? isDarkMode 
                    ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/30 scale-105 shadow-xl' 
                    : 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/30 scale-105 shadow-md'
                  : isDarkMode
                    ? 'bg-slate-900/50 hover:bg-slate-900 border-slate-800'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-1.5 rounded-lg border ${agent.color}`}>
                  {agent.icon}
                </div>
                <span className={`text-[10px] font-mono font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>0{index + 1}</span>
              </div>

              <div>
                <h5 className={`text-xs font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{agent.name}</h5>
                <p className={`text-[10px] line-clamp-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{agent.role}</p>
              </div>

              {index < agents.length - 1 && (
                <ArrowRight className={`w-3.5 h-3.5 absolute -right-2 top-1/2 -translate-y-1/2 hidden lg:block z-10 ${
                  isDarkMode ? 'text-slate-600' : 'text-slate-300'
                }`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Detailed Info Panel */}
      {currentInfo && (
        <div className={`border rounded-xl p-4 space-y-3 animate-fadeIn ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`flex items-center justify-between border-b pb-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <span className={`p-2 rounded-lg border ${currentInfo.color}`}>
                {currentInfo.icon}
              </span>
              <div>
                <h5 className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{currentInfo.name}</h5>
                <span className={`text-xs font-medium ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{currentInfo.role}</span>
              </div>
            </div>
            <span className={`text-xs font-mono px-2.5 py-1 border rounded-full ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}>
              Quy tắc cốt lõi: {currentInfo.rule}
            </span>
          </div>

          <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {currentInfo.description}
          </p>

          {currentInfo.id === 'checker' && (
            <div className={`p-3 border rounded-lg text-xs flex items-start gap-2 ${
              isDarkMode 
                ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong>Bí quyết phỏng vấn Senior QA:</strong>
                <p className="mt-0.5 leading-relaxed">
                  "Nếu để 1 Agent vừa viết code vừa viết test script, nó sẽ vô thức viết test case khớp với những gì nó code (kể cả khi code sai so với AC). Nguyên tắc thành công trong SDLC AI là <strong>Checker Agent phải độc lập tuyệt đối với Codebase</strong> và chỉ derive test case từ Spec/AC gốc."
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
