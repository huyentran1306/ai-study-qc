import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  ChevronRight, 
  ChevronDown, 
  Send, 
  RotateCcw,
  Zap,
  ShieldCheck,
  Flame,
  X
} from 'lucide-react';

interface InterviewPrepViewProps {
  onClose: () => void;
  isDarkMode?: boolean;
}

export const InterviewPrepView: React.FC<InterviewPrepViewProps> = ({ onClose, isDarkMode = false }) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'qa' | 'mock'>('checklist');
  const [expandedQaIndex, setExpandedQaIndex] = useState<number | null>(0);

  // Mock Interview State
  const [mockAnswer, setMockAnswer] = useState('');
  const [mockLoading, setMockLoading] = useState(false);
  const [mockHistory, setMockHistory] = useState<Array<{
    user: string;
    aiFeedback?: string;
    scoreRating?: number;
    followUpQuestion?: string;
    tips?: string;
  }>>([]);

  const top10Qa = [
    {
      q: '1. "Bạn đã/sẽ ứng dụng AI vào công việc Testing như thế nào?"',
      a: 'Tôi dùng AI tăng tốc requirement analysis, test design, data generation, API/UI automation và reporting. Workflow của tôi luôn ground từ ticket/spec, tạo traceability AC-test case, có human review trước execution và yêu cầu evidence sau execution. AI chịu phần lặp lại; tester vẫn chịu trách nhiệm risk, oracle, exploratory coverage và release recommendation.'
    },
    {
      q: '2. "Làm sao bạn có thể tin tưởng vào kết quả do AI sinh ra?"',
      a: 'Tôi không tin chỉ vì câu trả lời nghe hợp lý. Tôi kiểm tra nguồn (grounding), tách biệt plan và execution, chạy tool thật, so sánh expected-actual, lưu evidence và dùng independent gate. Các case quan trọng luôn verify xuyên UI-API-DB. Nếu requirement chưa rõ, kết quả là BLOCKED/Open Question chứ không để AI tự đoán.'
    },
    {
      q: '3. "Liệu AI có thay thế hoàn toàn vai trò của Tester trong tương lai không?"',
      a: 'AI không thay thế Tester mà thay đổi tỷ trọng công việc: giảm thời gian viết boilerplate và tác vụ lặp lại, nhưng tăng nhu cầu về tư duy hệ thống, risk assessment, domain knowledge, kiểm chứng và quản trị chất lượng. Senior Tester cần thiết kế guardrail và đánh giá output của AI, không chỉ biết viết prompt.'
    },
    {
      q: '4. "MCP (Model Context Protocol) khác gì so with Chatbot thông thường?"',
      a: 'Chatbot thông thường chỉ trả lời từ prompt/context. Với MCP hoặc tool calling, agent có thể lấy ticket thật trên ADO, đọc code, điều khiển browser Playwright, gọi API staging và thu thập evidence. Khả năng cao hơn đi kèm rủi ro cao hơn, nên cần least privilege, approval gate và audit trail.'
    },
    {
      q: '5. "Nếu AI sinh ra test case bị sai thì bạn xử lý như thế nào?"',
      a: 'Tôi truy nguyên lỗi về input/context, oracle hoặc rule; sửa prompt/instruction/checklist ở đúng tầng, re-run và đo lại. Nếu là bài học có tính lặp lại thì đưa vào convention/skill; không vá từng output thủ công mãi.'
    },
    {
      q: '6. "Bạn chọn kịch bản test nào để tiến hành Automation bằng AI?"',
      a: 'Ưu tiên luồng ổn định, lặp lại nhiều, business-critical, có oracle rõ và data có thể kiểm soát. Exploratory, UI thay đổi liên tục hoặc case chi phí bảo trì cao giữ manual/assisted. AI làm giảm chi phí tạo script nhưng không xóa chi phí bảo trì và false confidence.'
    },
    {
      q: '7. "Bản chất của CARE Framework trong Prompt Engineering là gì?"',
      a: 'CARE là viết tắt của Context (bối cảnh), Action (nhiệm vụ), Rules (ràng buộc/quy tắc), Example (ví dụ). Đối với QA, tôi bổ sung 4 yếu tố: Source of Truth (AC/spec), Coverage (độ phủ), Evidence (bằng chứng) và Stop Condition (điều kiện dừng).'
    },
    {
      q: '8. "Tại sao không để 1 Agent duy nhất vừa viết code vừa tạo test script?"',
      a: 'Để tránh rủi ro "Code tự chấm code". Nếu 1 Agent tự viết code và tự viết test script, nó có xu hướng tạo test script bám theo logic code sai của nó. Trong SDLC Kit, Checker Agent bắt buộc derive test case độc lập từ Acceptance Criteria gốc.'
    },
    {
      q: '9. "Bạn xử lý rủi ro lộ Secret Key và dữ liệu khách hàng (PII) ra sao?"',
      a: 'Tuyệt đối không paste token/password/customer data vào prompt. Tất cả credentials được quản lý qua biến môi trường (process.env). Dữ liệu nhạy cảm được Masking hoặc Anonymize bằng dữ liệu giả trước khi đưa vào bối cảnh.'
    },
    {
      q: '10. "Xử lý Flaky Test do AI sinh ra như thế nào?"',
      a: 'Chẩn đoán nguyên nhân gốc (selector fragile, race condition). Chuẩn hóa locator bằng Role, Label, test-id. Tuyệt đối không cho phép AI tự động sửa Assertion để chuyển FAIL thành PASS. Cập nhật bài học vào Skill/Instruction để ngăn tái diễn.'
    }
  ];

  const handleSendMockAnswer = () => {
    if (!mockAnswer.trim()) return;

    setMockLoading(true);
    const userMsg = mockAnswer;
    setMockAnswer('');

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let rating = 8;
      if (userMsg.length > 100) rating += 1;

      const keywordsFound = ['oracle', 'evidence', 'context', 'care', 'mcp', 'ac', 'spec', 'regression', 'star'].filter(kw => lower.includes(kw));
      if (keywordsFound.length >= 2) rating = Math.min(10, rating + 1);

      const followUps = [
        'Bạn sẽ đo lường hiệu quả (ROI) và tỷ lệ tiết kiệm thời gian của kịch bản này như thế nào?',
        'Nếu gặp trường hợp Flaky Test hoặc AI tự bịa selector, bạn xử lý ở tầng Prompt, Instruction hay Code?',
        'Làm sao để đảm bảo dữ liệu PII và Secret Token không bị lọt ra ngoài trong kịch bản bạn vừa nêu?',
        'Bạn có đề xuất gì cho bước Code Review hoặc Gate Approval trước khi cho phép script chạy tự động trên Staging?'
      ];
      const randomFollowUp = followUps[Math.floor(Math.random() * followUps.length)];

      const feedbackMsg = `Câu trả lời có chiều sâu và thể hiện tư duy quản trị rủi ro tốt (${userMsg.length > 80 ? 'diễn đạt mạch lạc, đầy đủ chi tiết' : 'súc tích, đúng trọng tâm'}). Bạn đã thể hiện góc nhìn góc cạnh của Senior QA về Source of Truth và bằng chứng kiểm thử.`;

      setMockHistory(prev => [
        ...prev,
        {
          user: userMsg,
          aiFeedback: feedbackMsg,
          scoreRating: rating,
          followUpQuestion: randomFollowUp,
          tips: 'Luôn đưa ví dụ dự án thực tế và chỉ số bằng chứng (cURL/DB log) để câu trả lời thuyết phục hơn.'
        }
      ]);

      setMockLoading(false);
    }, 600);
  };

  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-3 lg:p-6 overflow-y-auto ${
      isDarkMode ? 'bg-slate-950/80 text-slate-100' : 'bg-slate-900/50 text-slate-800'
    }`}>
      <div className={`border rounded-2xl max-w-4xl w-full p-5 lg:p-6 shadow-2xl space-y-5 my-6 max-h-[90vh] flex flex-col transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between border-b pb-3 shrink-0 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md">
              <Award className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className={`font-bold text-base ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Bí Kíp Phỏng Vấn Senior QA (Interview Master)</h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tài liệu ôn tập 60s, Top 10 Q&A & Mô phỏng phỏng vấn thực tế với AI</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all ${
              isDarkMode ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-500 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className={`flex items-center gap-2 border-b pb-2 shrink-0 ${
          isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? isDarkMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-100 text-amber-900 border border-amber-300'
                : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Checklist 60s</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'qa'
                ? isDarkMode ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Top 10 Q&A Phỏng Vấn</span>
          </button>

          <button
            onClick={() => setActiveTab('mock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'mock'
                ? isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Phỏng Vấn Thử Với AI (Live)</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className={`p-3 border rounded-xl text-xs ${
                isDarkMode ? 'bg-amber-950/20 border-amber-800/40 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}>
                ⚡ <strong>Đọc nhanh trước khi vào phòng phỏng vấn 60s:</strong> Tóm tắt 10 nguyên tắc đắt giá giúp bạn tự tin ghi điểm với Trưởng phòng QA / Director.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  'AI sinh kết quả theo xác suất token; tuyệt đối có thể hallucinate.',
                  'Context & Source of Truth quan trọng hơn 1 câu prompt "thần thánh".',
                  'CARE Framework: Context, Action, Rules, Example; luôn gắn Test Oracle.',
                  'Phân biệt rõ ràng: Prompt ≠ Instruction ≠ Skill ≠ Agent ≠ MCP.',
                  'Derive test từ AC/Spec, tuyệt đối KHÔNG derive từ code để code tự chấm nó.',
                  'Flow chuẩn: Ground → Clarify → Plan → Approve → Execute → Verify → Report → Learn.',
                  'Khái niệm PASS bắt buộc phải kèm Expected, Actual và Evidence (Log/DB).',
                  'AI Test cần Least Privilege, không dùng Secret/PII thật, không destructive action.',
                  'AI tăng tốc Automation; Senior QA vẫn sở hữu Risk, Strategy và Release recommendation.',
                  'Trả lời câu hỏi bằng cấu trúc STAR-C: Situation → Task → Action → Result → Control/Lesson.'
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 border rounded-xl flex items-start gap-2.5 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className={`w-5 h-5 rounded-full border font-mono font-bold text-[10px] flex items-center justify-center shrink-0 ${
                      isDarkMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-100 border-amber-300 text-amber-800'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={`leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="space-y-3">
              {top10Qa.map((item, idx) => {
                const isExpanded = expandedQaIndex === idx;
                return (
                  <div key={idx} className={`border rounded-xl overflow-hidden transition-all ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <button
                      onClick={() => setExpandedQaIndex(isExpanded ? null : idx)}
                      className={`w-full text-left p-3.5 flex items-center justify-between gap-3 ${
                        isDarkMode ? 'hover:bg-slate-900/60' : 'hover:bg-slate-100'
                      }`}
                    >
                      <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.q}</span>
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-indigo-600 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>

                    {isExpanded && (
                      <div className={`p-3.5 border-t text-xs leading-relaxed font-sans border-l-2 border-l-indigo-600 ${
                        isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                      }`}>
                        <strong className="text-indigo-600 block mb-1">Gợi ý trả lời xuất sắc:</strong>
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'mock' && (
            <div className="space-y-4">
              <div className={`p-3 border rounded-xl text-xs ${
                isDarkMode ? 'bg-indigo-950/30 border-indigo-800/40 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-950'
              }`}>
                🤖 <strong>Mô Phỏng Phỏng Vấn AI Real-Time:</strong> Hãy nhập câu trả lời của bạn. Giám khảo AI sẽ đánh giá thang điểm 10, chỉ ra điểm ấn tượng & đặt câu hỏi đào sâu tiếp theo!
              </div>

              {/* Chat History */}
              <div className={`space-y-3 min-h-[200px] max-h-[350px] overflow-y-auto p-3 border rounded-xl ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                {mockHistory.length === 0 ? (
                  <div className={`text-center py-8 text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Chưa có hội thoại nào. Hãy nhập câu trả lời phỏng vấn đầu tiên ở ô dưới đây!
                  </div>
                ) : (
                  mockHistory.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      {/* User response */}
                      <div className={`p-3 border rounded-xl ml-6 text-xs ${
                        isDarkMode 
                          ? 'bg-indigo-600/15 border-indigo-500/30 text-slate-200' 
                          : 'bg-indigo-50 border-indigo-200 text-slate-800'
                      }`}>
                        <strong className="text-indigo-600 block text-[10px] mb-1">Bạn (Ứng viên Senior QA):</strong>
                        {item.user}
                      </div>

                      {/* AI Examiner feedback */}
                      {item.aiFeedback && (
                        <div className={`p-3 border rounded-xl mr-6 text-xs space-y-2 ${
                          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                        }`}>
                          <div className={`flex items-center justify-between border-b pb-1.5 ${
                            isDarkMode ? 'border-slate-800' : 'border-slate-200'
                          }`}>
                            <span className="font-bold text-amber-600 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              Giám Khảo QA Director:
                            </span>
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] border ${
                              isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}>
                              Điểm: {item.scoreRating}/10
                            </span>
                          </div>

                          <p className="leading-relaxed">{item.aiFeedback}</p>

                          {item.followUpQuestion && (
                            <div className={`p-2.5 border rounded-lg font-medium mt-2 ${
                              isDarkMode ? 'bg-slate-950 border-indigo-800/50 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                            }`}>
                              ❓ <strong>Câu hỏi đào sâu tiếp theo:</strong> {item.followUpQuestion}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Mock Input Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập câu trả lời phỏng vấn của bạn..."
                  value={mockAnswer}
                  onChange={(e) => setMockAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMockAnswer()}
                  className={`flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-950 border-slate-800 text-slate-200' 
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />

                <button
                  onClick={handleSendMockAnswer}
                  disabled={mockLoading || !mockAnswer.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{mockLoading ? 'Đang Đánh Giá...' : 'Trả Lời'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
