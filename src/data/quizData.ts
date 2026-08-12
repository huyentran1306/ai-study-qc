import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Level 1 Quizzes
  {
    id: 'q1-1',
    lessonId: 'lesson-1-llm-core',
    question: 'Bản chất hoạt động cốt lõi của một Large Language Model (LLM) là gì?',
    options: [
      'Truy vấn trực tiếp dữ liệu chính xác từ cơ sở dữ liệu của dự án',
      'Chia văn bản thành token và dự đoán token tiếp theo dựa trên xác suất thống kê',
      'Tự động chạy mã nguồn trên máy chủ để phát hiện lỗi logic',
      'Luôn đảm bảo câu trả lời là sự thật 100% không bao giờ sai'
    ],
    correctAnswerIndex: 1,
    explanation: 'LLM vận hành bằng cách chia input thành token và tính toán xác suất token tiếp theo dựa trên dữ liệu huấn luyện và context được cấp.',
    seniorTip: 'Hiểu bản chất xác suất của LLM giúp QA biết tại sao cùng 1 prompt lại có thể ra kết quả khác nhau và tại sao phải dùng Test Oracle để kiểm chứng.'
  },
  {
    id: 'q1-2',
    lessonId: 'lesson-1-llm-core',
    question: 'Hiện tượng "Hallucination" (Ảo giác) trong AI là gì?',
    options: [
      'AI phản hồi quá chậm do nghẽn mạng',
      'AI đưa ra câu trả lời sai lệch hoặc bịa đặt nhưng với văn phong rất tự tin',
      'AI tự động xóa dữ liệu test trên môi trường staging',
      'AI từ chối thực hiện câu lệnh do vi phạm chính sách'
    ],
    correctAnswerIndex: 1,
    explanation: 'Hallucination là khi AI tạo ra thông tin không có trong thực tế hoặc bịa đặt quy tắc nhưng lại diễn đạt vô cùng thuyết phục.',
    seniorTip: 'Trong phỏng vấn, hãy nhấn mạnh cách bạn dùng Grounding và Test Oracle để loại bỏ Hallucination.'
  },
  {
    id: 'q1-3',
    lessonId: 'lesson-1-llm-core',
    question: 'Tại sao AI KHÔNG THỂ tự đóng vai trò là "Test Oracle" trong dự án?',
    options: [
      'Vì AI không biết lập trình TypeScript hay Python',
      'Vì AI chỉ dự đoán câu từ, Expected Result chuẩn bắt buộc phải đến từ Requirement/AC hoặc nguồn sự thật đã thống nhất',
      'Vì AI chạy quá nhanh không theo kịp tốc độ của tester',
      'Vì AI không thể đọc được file dạng JSON hay Markdown'
    ],
    correctAnswerIndex: 1,
    explanation: 'Test Oracle là nguồn sự thật chuẩn mực (Requirement, Business Rules, Specs). AI không thể tự nghĩ ra quy tắc đúng sai cho doanh nghiệp của bạn.',
    seniorTip: 'Mẹo Senior: "AI đề xuất kịch bản, nhưng Specification quyết định đúng/sai."'
  },
  {
    id: 'q1-4',
    lessonId: 'lesson-1-llm-core',
    question: 'Trong một AI testing workflow chuẩn, điểm dừng "Human Gate" có vai trò gì?',
    options: [
      'Cho phép con người tự viết toàn bộ test script bằng tay',
      'Bắt buộc người có thẩm quyền (Tester/PO) xem xét, phê duyệt kế hoạch test và kết quả trước khi đưa ra quyết định release',
      'Giúp máy tính tiết kiệm pin khi chạy test',
      'Tự động chuyển bug sang Jira mà không cần xem'
    ],
    correctAnswerIndex: 1,
    explanation: 'Human Gate đảm bảo con người chịu trách nhiệm cuối cùng đối với chất lượng sản phẩm và phê duyệt phạm vi test.',
    seniorTip: 'Trả lời phỏng vấn: "Human-in-the-loop là chốt chặn quan trọng nhất để tránh rủi ro do AI đưa ra quyết định sai."'
  },

  // Level 2 Quizzes
  {
    id: 'q2-1',
    lessonId: 'lesson-2-concepts-diff',
    question: 'Sự khác biệt chính giữa "Instruction" và "Context" trong một AI Workspace là gì?',
    options: [
      'Instruction là code API, Context là giao diện người dùng',
      'Instruction là quy tắc/luật áp dụng ổn định lâu dài cho cả workspace, còn Context là thông tin tài liệu cụ thể của task hiện tại',
      'Instruction dùng cho Tester, Context dùng cho Developer',
      'Hai khái niệm này hoàn toàn giống hệt nhau không có khác biệt'
    ],
    correctAnswerIndex: 1,
    explanation: 'Instruction thiết lập các quy tắc bất biến (như không tiết lộ secret, format Tiếng Việt). Context là dữ liệu động như Ticket ID, AC, API spec của task đó.',
    seniorTip: 'Việc tách riêng Instruction giúp bạn không phải lặp lại các quy định chung trong từng prompt lẻ.'
  },
  {
    id: 'q2-2',
    lessonId: 'lesson-2-concepts-diff',
    question: 'MCP (Model Context Protocol) đóng vai trò gì trong hệ thống AI Agent?',
    options: [
      'Làm cho AI trở nên thông minh hơn và viết code nhanh hơn 10 lần',
      'Là chuẩn giao thức kết nối an toàn cho phép AI Agent tương tác với các công cụ/dữ liệu có cấu trúc bên ngoài (như Playwright, ADO, DB)',
      'Là một thuật toán mã hóa mật khẩu cho tester',
      'Là giao diện thiết kế Figma dành cho AI'
    ],
    correctAnswerIndex: 1,
    explanation: 'MCP giúp chuẩn hóa cách AI Agent gọi các công cụ thực tế (Tool Calling) để đọc thông tin hoặc thao tác trên hệ thống thật.',
    seniorTip: 'Ghi điểm phỏng vấn: "MCP giúp agent lấy đúng context thực tế và thao tác trên hệ thống thật thay vì chỉ chém gió."'
  },

  // Level 3 Quizzes
  {
    id: 'q3-1',
    lessonId: 'lesson-3-care-framework',
    question: 'Cấu trúc CARE Framework bao gồm 4 thành phần nào?',
    options: [
      'Code, Action, Review, Execution',
      'Context, Action, Rules, Example',
      'Coverage, Automation, Report, Evidence',
      'Check, Analyze, Run, Evaluate'
    ],
    correctAnswerIndex: 1,
    explanation: 'CARE = Context (Bối cảnh), Action (Hành động), Rules (Quy tắc), Example (Ví dụ).',
    seniorTip: 'Khi phỏng vấn, hãy chủ động nêu CARE Framework để chứng minh tư duy thiết kế prompt bài bản.'
  },
  {
    id: 'q3-2',
    lessonId: 'lesson-3-care-framework',
    question: 'Khi viết Prompt cho Tester, 4 thành phần QA nào bổ sung thêm vào CARE để đạt chất lượng cao nhất?',
    options: [
      'Source of Truth, Coverage, Evidence, Stop Condition',
      'Color scheme, Layout, Font size, Margin',
      'Jira ID, Sprint number, Assignee, Story point',
      'Browser, OS, Screen resolution, RAM'
    ],
    correctAnswerIndex: 0,
    explanation: '4 yếu tố QA bổ sung: Source of Truth (nguồn sự thật), Coverage (độ phủ), Evidence (bằng chứng), Stop Condition (điều kiện dừng).',
    seniorTip: 'Yếu tố Stop Condition giúp AI ngưng chạy và đặt câu hỏi khi gặp ambiguity thay vì tự bịa ra giả định sai.'
  },

  // Level 4 Quizzes
  {
    id: 'q4-1',
    lessonId: 'lesson-4-sdlc-lifecycle',
    question: 'Nhiệm vụ nào dưới đây KHÔNG NÊN giao hoàn toàn cho AI quyết định?',
    options: [
      'Tóm tắt ticket và phát hiện thiếu sót trong Acceptance Criteria',
      'Quyết định Business Expectation khi tài liệu Spec xảy ra mâu thuẫn',
      'Chuyển đổi manual test steps thành Playwright script mẫu',
      'Sinh dữ liệu test ngẫu nhiên hợp lệ'
    ],
    correctAnswerIndex: 1,
    explanation: 'Khi Spec mâu thuẫn, AI chỉ có thể liệt kê mâu thuẫn; việc quyết định quy tắc kinh doanh phải thuộc về Product Owner/Human.',
    seniorTip: 'Nêu rõ ranh giới này chứng tỏ bạn là Senior QA biết quản trị rủi ro.'
  },

  // Level 5 Quizzes
  {
    id: 'q5-1',
    lessonId: 'lesson-5-multi-agent-sdlc',
    question: 'Tại sao Checker Agent lại bắt buộc tạo Test Case từ AC mà KHÔNG ĐƯỢC nhìn vào Code của Implementer vừa viết?',
    options: [
      'Để tránh việc "Code tự chấm code" – nếu code bị sai logic mà test case viết bám theo code thì sẽ cho kết quả PASS giả tạo',
      'Vì Checker Agent không biết đọc ngôn ngữ lập trình',
      'Để tiết kiệm dung lượng bộ nhớ máy tính',
      'Vì code của Implementer đã được mã hóa không thể xem'
    ],
    correctAnswerIndex: 0,
    explanation: 'Việcderive test case từ Code khiến test bám theo thiên kiến của coder. Test case bắt buộc phải derive từ Requirement/AC gốc.',
    seniorTip: 'Đây là nguyên tắc kinh điển: "Derive test cases from specifications, never from implementation details."'
  },

  // Level 6 & 7 Quizzes
  {
    id: 'q6-1',
    lessonId: 'lesson-6-prompt-library',
    question: 'Khi một test case do AI chạy bị FAIL, quy trình xử lý vòng lặp (Failure loop) chuẩn của Senior QA là gì?',
    options: [
      'Chạy đi chạy lại 100 lần cho tới khi nào PASS thì thôi',
      'Sửa lại Assertion của test script để biến FAIL thành PASS ngay lập tức',
      'Retry có giới hạn -> Thu thập Evidence (log, screenshot, API response) -> Phân loại (Product bug/Test issue/Data issue/Env issue) -> Fix đúng owner',
      'Xóa bỏ luôn test case đó khỏi bộ regression'
    ],
    correctAnswerIndex: 2,
    explanation: 'Không được tự động sửa assertion để biến FAIL thành PASS. Phải điều tra nguyên nhân gốc và phân loại lỗi chính xác.',
    seniorTip: 'Trả lời phỏng vấn: "Self-healing selector chỉ giúp tìm lại element, tuyệt đối không được tự ý sửa Business Assertion."'
  },
  {
    id: 'q7-1',
    lessonId: 'lesson-7-risk-interview',
    question: 'Để ngăn ngừa việc lộ Secret Key hoặc thông tin cá nhân khách hàng (PII) khi tương tác với AI, giải pháp hàng đầu là gì?',
    options: [
      'Không dùng AI nữa',
      'Đưa Secret Key vào câu prompt và dặn AI "Nhớ giữ bí mật nhé"',
      'Dùng biến môi trường (Environment Variables), Masking/Anonymize dữ liệu nhạy cảm trước khi đưa vào prompt',
      'Đổi tên Secret Key thành chữ thường'
    ],
    correctAnswerIndex: 2,
    explanation: 'Chỉ truy cập secret thông qua `process.env` hoặc hệ thống quản lý bí mật, đồng thời che giấu (mask) dữ liệu khách hàng thật.',
    seniorTip: 'Rủi ro an ninh thông tin là chủ đề phỏng vấn rất phổ biến cho vị trí Senior.'
  }
];
