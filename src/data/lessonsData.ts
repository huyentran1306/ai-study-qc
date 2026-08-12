import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1-llm-core',
    levelId: 'level-1',
    levelNumber: 1,
    levelName: 'Nền tảng AI & LLM',
    title: '1. AI làm việc như thế nào & Tư duy Test Oracle',
    description: 'Nắm vững bản chất LLM dự đoán Token, hiện tượng Hallucination và tại sao AI không thể tự thay thế Test Oracle.',
    estimatedMinutes: 15,
    badgeText: 'Level 1: Core Principles',
    quizIds: ['q1-1', 'q1-2', 'q1-3', 'q1-4'],
    essayIds: ['e1-1'],
    sections: [
      {
        id: 'sec-1-1',
        title: 'Bản chất hoạt động của Large Language Model (LLM)',
        contentMarkdown: `
### LLM vận hành như thế nào?
* **Tokenization**: LLM nhận input từ người dùng, chia văn bản thành các hạt nhỏ gọi là **tokens** (mỗi token khoảng 3-4 ký tự tiếng Anh hoặc vài từ/tiếng Việt).
* **Dự đoán Token tiếp theo**: LLM không "suy nghĩ" như con người. Nó tính toán xác suất thống kê dựa trên dữ liệu đã học và context hiện tại để sinh ra token tiếp theo hợp lý nhất.
* **Cần Context & Tool**: AI không tự biết "sự thật" của dự án nếu không được cung cấp tài liệu (Requirement/AC) hoặc cấp công cụ (**Tool**) để kiểm tra thực tế (API, DB, Code, Browser).
* **Tính không định hình (Non-deterministic)**: Cùng một prompt, AI có thể trả về các câu trả lời biến đổi khác nhau.
        `,
        keyTakeaway: 'LLM là mô hình dự đoán xác suất token tiếp theo, không phải là cơ sở dữ liệu lưu trữ sự thật của project.',
        interactiveComponent: 'tokenizer'
      },
      {
        id: 'sec-1-2',
        title: 'Ảo giác (Hallucination) & Nguyên tắc Test Oracle',
        contentMarkdown: `
### Hiện tượng Hallucination
Output của AI nghe rất thuyết phục, văn phong cực kỳ tự tin nhưng nội dung hoàn toàn **bịa đặt hoặc sai lệch** với yêu cầu thực tế.

### Test Oracle là gì trong AI Testing?
Trong Kiểm thử Phần mềm, **Test Oracle** là nguồn sự thật giúp Tester biết một kết quả là ĐÚNG hay SAI (ví dụ: Requirement spec, Acceptance Criteria, Business Rules).

> ⚠️ **Tuyên ngôn Senior QA**: AI có thể đề xuất và thực thi test script, nhưng **Expected Result tuyệt đối phải lấy từ Test Oracle** đã thống nhất (Requirement/AC). Không bao giờ dùng câu trả lời của AI để làm Test Oracle!
        `,
        realWorldExample: {
          scenario: 'Tester yêu cầu AI sinh test case cho tính năng Tính Phí Giao Hàng.',
          badApproach: 'Hỏi AI: "Tính phí giao hàng như thế nào là đúng?" và chép nguyên câu trả lời của AI làm Expected Result.',
          goodApproach: 'Đưa file Spec/AC quy định phí: "Nội thành 15k, ngoại thành 30k, đơn > 500k free ship". Yêu cầu AI sinh test matrix kiểm chứng theo đúng quy tắc này.',
          explanation: 'AI có thể bịa ra quy tắc "miễn phí cho thành viên Vàng" nếu spec không ghi. Tester cần ép AI tuân thủ đúng Test Oracle.'
        }
      },
      {
        id: 'sec-1-3',
        title: 'Workflow AI Thực Tế trong QA',
        contentMarkdown: `
Dưới đây là sơ đồ luồng hoạt động chuẩn khi ứng dụng AI vào dự án testing thực tế:

\`\`\`text
User Request / Ticket ID
  └──> 1. Instructions + Project Context (AC, Code, Spec)
  └──> 2. Model Lập Kế Hoạch / Chọn Tool
  └──> 3. Tool Gọi Hệ Thống Thật (Đọc ADO, API, Browser, DB)
  └──> 4. Model Phân Tích Kết Quả thu được
  └──> 5. Tạo Output (Test case / Bug Report / Evidence)
  └──> 6. Human Review & Quality Gate (Tester quyết định cuối cùng)
\`\`\`
        `,
        keyTakeaway: 'Luôn giữ điểm dừng Human Gate để phê duyệt kế hoạch và quyết định release.'
      }
    ]
  },

  {
    id: 'lesson-2-concepts-diff',
    levelId: 'level-2',
    levelNumber: 2,
    levelName: 'Phân Biệt Khái Niệm AI',
    title: '2. Bảng Phân Biệt Các Khái Niệm AI Trong QA',
    description: 'Phân biệt rành rọt giữa Prompt, Context, Instruction, Skill, Agent, Tool Calling, MCP, RAG và Human-in-the-loop.',
    estimatedMinutes: 20,
    badgeText: 'Level 2: Terminologies',
    quizIds: ['q2-1', 'q2-2', 'q3-3'],
    essayIds: ['e2-1'],
    sections: [
      {
        id: 'sec-2-1',
        title: 'Bảng So Sánh Các Khái Niệm Cốt Lõi',
        contentMarkdown: `
| Khái niệm | Hiểu đơn giản | Ví dụ cụ thể trong QA |
| :--- | :--- | :--- |
| **Prompt** | Lệnh yêu cầu cho 1 lần làm việc cụ thể | "Phân tích ticket #1024 và tạo test strategy" |
| **Context** | Thông tin AI dùng trong phiên làm việc hiện tại | AC, API spec, Code diff, Test data, Môi trường |
| **Instruction** | Quy định/Luật áp dụng cố định cho cả workspace | "Không ghi secret, format bug report theo Markdown, dùng Tiếng Việt" |
| **Reusable Prompt** | Prompt chuẩn hóa dùng lặp đi lặp lại cho 1 task | Prompt review PR, Prompt sinh API Test Bruno |
| **Skill** | Quy trình & Domain knowledge đóng gói để tái sử dụng | \`azure-suite-runner\`, \`auto-screen-tester\` |
| **Agent** | AI có vai trò, workflow và bộ tool riêng biệt | Planner Agent, Checker Agent, Bug-Fixer Agent |
| **Tool Calling** | AI gọi chương trình / API bên ngoài để lấy dữ liệu thật | Chạy terminal, đọc Azure DevOps, gọi API, query SQL |
| **MCP (Model Context Protocol)** | Chuẩn kết nối Model với Tool/Data có cấu trúc | MCP Playwright, MCP Azure DevOps, MCP Database |
| **RAG / Grounding** | Lấy thông tin đúng từ nguồn thật trước khi trả lời | Tìm spec trong Confluence rồi mới sinh test case |
| **Human-in-the-loop** | Điểm dừng bắt buộc người chịu trách nhiệm phê duyệt | Phê duyệt Test Plan, xác nhận Scope, sign-off release |
        `,
        keyTakeaway: 'MCP không làm model thông minh hơn; nó cung cấp cầu nối an toàn cho model truy vấn dữ liệu thật.'
      },
      {
        id: 'sec-2-2',
        title: 'Tại Sao Senior QA Cần Hiểu MCP & Tool Calling?',
        contentMarkdown: `
### Điểm nhấn khi trả lời phỏng vấn:
> "Chatbot thông thường chỉ trả lời dựa trên văn bản đã nhập. Nhưng với **MCP** và **Tool Calling**, Agent AI có thể tương tác trực tiếp với hạ tầng testing: tự mở browser bằng Playwright, tự query bảng database để xem state, tự gửi request tới API staging và chụp bằng chứng.
> 
> Vì AI có thể tương tác với hệ thống thật, rủi ro biến đổi dữ liệu là rất lớn. Do đó Senior QA phải thiết lập **Least Privilege** (quyền tối thiểu) và các điểm **Approval Gate**."
        `
      }
    ]
  },

  {
    id: 'lesson-3-care-framework',
    levelId: 'level-3',
    levelNumber: 3,
    levelName: 'Prompt Engineering cho QA',
    title: '3. CARE Framework + 4 Yếu Tố Test Oracle',
    description: 'Làm chủ công thức viết prompt đỉnh cao CARE (Context, Action, Rules, Example) kết hợp các ràng buộc bắt buộc của Tester.',
    estimatedMinutes: 25,
    badgeText: 'Level 3: Framework Design',
    quizIds: ['q3-1', 'q3-2', 'q3-4'],
    essayIds: ['e3-1'],
    sections: [
      {
        id: 'sec-3-1',
        title: 'Khung CARE Framework là gì?',
        contentMarkdown: `
CARE là viết tắt của 4 thành phần bắt buộc trong một Prompt chất lượng cao:

* **C — Context (Bối cảnh):** Bạn đang test ticket nào, tính năng gì, môi trường nào, ai là người sử dụng?
* **A — Action (Hành động):** AI cần làm chính xác việc gì? (Phân tích, thiết kế test case, chạy test, hay lập report?)
* **R — Rules (Quy tắc & Ràng buộc):** Phạm vi, công cụ cho phép, giới hạn bảo mật, định dạng đầu ra.
* **E — Example (Ví dụ minh họa):** Mẫu input/output tiêu chuẩn hoặc ví dụ test case mong muốn.
        `,
        interactiveComponent: 'care-builder'
      },
      {
        id: 'sec-3-2',
        title: '4 Thành Phần Bổ Sung Dành Riêng Cho QA',
        contentMarkdown: `
Ngoài CARE, Senior QA phải bổ sung 4 yếu tố kiểm soát chất lượng:

1. **Source of Truth (Nguồn sự thật):** AC / Spec / Business Rule nào quyết định đúng-sai?
2. **Coverage (Độ phủ):** Yêu cầu bao phủ Positive, Negative, Boundary, Permission (Role-based), Integration, Regression.
3. **Evidence (Bằng chứng):** Yêu cầu ghi rõ Request/Response, Screenshot, Log, DB state; không nhận câu trả lời suông "PASS".
4. **Stop Condition (Điều kiện dừng):** Thiếu requirement, nghi ngờ lỗi bảo mật hoặc gặp hành động nguy hiểm -> DỪNG LẠI HỎI NGƯỜI THẬT.
        `,
        realWorldExample: {
          scenario: 'Tạo Prompt yêu cầu AI viết Test Matrix cho API Thanh Toán.',
          badApproach: '"Viết cho tôi các test case kiểm thử API thanh toán Momo thật kỹ."',
          goodApproach: `[CONTEXT] API Payment Gateway v2, môi trường Staging. Spec tại URL/docs.
[ACTION] Tạo Test Matrix kiểm thử API POST /api/v2/payment/charge.
[RULES] 
- Grounding đúng theo Spec, không tự đoán status code.
- Bao phủ: Positive (200), Negative (400, 422), Auth (401, 403), Idempotency.
- Không in lộ Secret Key / Token.
- Nếu Spec không đề cập timeout -> Đặt câu hỏi Open Question.
[EXAMPLE] Mapping AC-01 -> TC-01: Valid Payload -> Status 200, Return Transaction ID.`,
          explanation: 'Prompt có quy tắc rõ ràng giúp loại bỏ 95% hiện tượng hallucination và đảm bảo output sử dụng được ngay.'
        }
      }
    ]
  },

  {
    id: 'lesson-4-sdlc-lifecycle',
    levelId: 'level-4',
    levelNumber: 4,
    levelName: 'Vòng Đời Testing AI',
    title: '4. Ứng Dụng AI Trước, Trong và Sau Khi Test',
    description: 'Xác định chính xác các công việc AI hỗ trợ cực tốt và những việc TỰ BẤT KHẢ THI (NÊN vs KHÔNG NÊN giao AI).',
    estimatedMinutes: 20,
    badgeText: 'Level 4: Testing Lifecycle',
    quizIds: ['q4-1', 'q4-2'],
    essayIds: ['e4-1'],
    sections: [
      {
        id: 'sec-4-1',
        title: 'AI Hỗ Trợ Gì Trong Từng Giai Đoạn Testing?',
        contentMarkdown: `
### 1. Trước khi Test (Pre-testing)
* Tóm tắt Ticket, phát hiện điểm mâu thuẫn (Ambiguity) và thiếu sót trong Acceptance Criteria.
* Phân tích Impact từ Code Diff (Git commit), API contract và Database schema change.
* Sinh Test Strategy, Risk Matrix, Traceability Matrix (AC ↔ Test Case).
* Gợi ý kịch bản Boundary, State Transition, Pairwise testing.

### 2. Trong khi Test (Test Execution)
* **API Testing**: Tạo cURL / Bruno collection, gửi request CRUD, verify status, schema, business response time.
* **UI Testing**: Điều khiển Playwright mở browser thật, thao tác giao diện theo role, chụp evidence.
* **E2E Trace**: Đối chiếu dữ liệu xuyên suốt: UI -> Network Request -> API Response -> DB / Cache state.
* **Triage Failure**: Phân loại lỗi tự động thành: *Product Bug, Test Issue, Data Issue hay Environment Issue*.

### 3. Sau khi Test (Post-testing)
* Tóm tắt Bug Report chuyên nghiệp (Repro steps, Expected vs Actual, Evidence).
* Phân tích ảnh hưởng Regression cho đợt release tiếp theo.
* Lưu lesson learned thành Convention / Checklist cho toàn team.
        `
      },
      {
        id: 'sec-4-2',
        title: 'Những Việc KHÔNG ĐƯỢC Giao Hoàn Toàn Cho AI',
        contentMarkdown: `
🚫 **1. Quyết định Business Expectation khi Spec mâu thuẫn**: AI chỉ đoán, không thể tự chốt luật kinh doanh thay cho Product Owner.
🚫 **2. Exploratory Testing đỉnh cao**: Cần trực giác con người về trải nghiệm người dùng, miền nghiệp vụ phức tạp hoặc hành vi bất thường.
🚫 **3. Destructive / Security Testing không cấp phép**: AI không được tự ý thực hiện SQL Injection hay xóa database sản xuất.
🚫 **4. Quyết định Release Sign-off**: Chỉ nhìn vào tóm tắt của AI mà không tự kiểm tra Evidence thực tế là rủi ro thảm họa!
        `,
        keyTakeaway: 'Tester giữ quyền sở hữu Risk, Test Oracle và Quyết định Release.'
      }
    ]
  },

  {
    id: 'lesson-5-multi-agent-sdlc',
    levelId: 'level-5',
    levelNumber: 5,
    levelName: 'Multi-Agent QA Architecture',
    title: '5. Mô Hình Multi-Agent SDLC & 3 Cấp Ambiguity',
    description: 'Khám phá mô hình làm việc hiện đại: Planner, Implementer, Checker, Feature Judge và nguyên tắc Code Không Tự Chấm Code.',
    estimatedMinutes: 25,
    badgeText: 'Level 5: Advanced Architecture',
    quizIds: ['q5-1', 'q5-2'],
    essayIds: ['e5-1'],
    sections: [
      {
        id: 'sec-5-1',
        title: 'Mô Hình Multi-Agent SDLC Kit',
        contentMarkdown: `
Trong một hệ thống AI SDLC nâng cao, công việc không giao cho 1 AI duy nhất mà phân chia thành các **Agent chuyên biệt**:

* 🎯 **Planner Agent**: Đọc ticket, convention & codebase -> phân layer FE/BE, ước tính size ticket, tạo \`plan.md\`. Không đụng vào code!
* 🛠️ **Implementer Agent**: Chỉ viết code bám sát \`plan.md\` đã duyệt.
* 🔍 **Checker Agent**: Tự tạo test case dựa trên **Acceptance Criteria (AC), KHÔNG ĐƯỢC nhìn vào code vừa viết** để tránh việc "code tự chấm code".
* ⚖️ **Feature Judge Agent**: Chạy E2E từng AC trên môi trường local stack thật, kiểm tra UI -> API -> DB, lưu bằng chứng trước khi chốt \`READY_FOR_PR\`.
* 🚑 **Bug Fixer Agent**: Sửa đúng nguyên nhân gốc trong scope phát hiện được.
* 📝 **Retro Agent**: Ghi lại bài học kinh nghiệm lặp đi lặp lại vào file quy chuẩn team.
        `,
        interactiveComponent: 'sdlc-flow'
      },
      {
        id: 'sec-5-2',
        title: '3 Cấp Độ Xử Lý Mâu Thuẫn (Ambiguity / Blocker)',
        contentMarkdown: `
Khi Agent gặp điểm chưa rõ trong công việc, hệ thống áp dụng 3 cấp độ:

1. **Decide and Log**: Vấn đề nhỏ, an toàn, có thể đảo ngược -> AI tự chọn hướng bảo thủ nhất và ghi log rủi ro.
2. **NEEDS_ORCHESTRATOR**: Quyết định kiến trúc / business có thể làm hỏng API contract, Auth hoặc Data -> Dừng để Lead / Orchestrator duyệt.
3. **NEEDS_HUMAN**: Thiếu PAT, Credential, DB/Port bị khóa -> Dừng lập tức và hỏi đúng 1 câu ngắn gọn tới Tester.
        `
      }
    ]
  },

  {
    id: 'lesson-6-prompt-library',
    levelId: 'level-6',
    levelNumber: 6,
    levelName: 'Library Prompt Thực Chiến',
    title: '6. Bộ Library Prompt Mẫu Sản Xuất Cho Senior QA',
    description: 'Truy cập và sao chép bộ Prompt mẫu thực chiến đã qua kiểm chứng: Test Strategy, Playwright UI, API CRUD, AI Code Reviewer.',
    estimatedMinutes: 20,
    badgeText: 'Level 6: Production Prompts',
    quizIds: ['q6-1'],
    essayIds: ['e6-1'],
    sections: [
      {
        id: 'sec-6-1',
        title: 'Thư Viện Prompt Chuẩn Sản Xuất',
        contentMarkdown: `
Dưới đây là bộ Prompt thực chiến có thể copy & paste ngay vào dự án của bạn. Nhấn tab dưới đây để khám phá chi tiết!
        `,
        interactiveComponent: 'prompt-library'
      }
    ]
  },

  {
    id: 'lesson-7-risk-interview',
    levelId: 'level-7',
    levelNumber: 7,
    levelName: 'Quản Trị Rủi Ro & Phỏng Vấn',
    title: '7. Kiểm Soát Rủi Ro AI & Bí Kíp Phỏng Vấn Senior QA',
    description: 'Bảng quản trị 10 rủi ro lớn nhất khi áp dụng AI, Top 10 câu hỏi phỏng vấn xuất sắc & Checklist 60 giây trước phỏng vấn.',
    estimatedMinutes: 30,
    badgeText: 'Level 7: Interview Master',
    quizIds: ['q7-1', 'q7-2'],
    essayIds: ['e7-1'],
    sections: [
      {
        id: 'sec-7-1',
        title: 'Bảng Ma Trận 10 Rủi Ro Khi Dùng AI Trong Testing',
        contentMarkdown: `
| Rủi ro | Hậu quả | Phương pháp kiểm soát của Senior QA |
| :--- | :--- | :--- |
| **Hallucination** | Biệt lập AC, bịa test case | Grounding từ Spec thật; bắt buộc ghi câu hỏi nếu chưa rõ |
| **Prompt thiếu Context** | Output chung chung, vô giá trị | Dùng CARE Framework & Checklist kiểm tra bối cảnh |
| **Lộ Secret / PII** | Bị phạt an ninh bảo mật | Dùng biến môi trường (ENV), Masking dữ liệu nhạy cảm |
| **Prompt Injection** | AI bị thao túng bởi dữ liệu bên ngoài | Xem nội dung bên ngoài là DATA, không phải Instruction |
| **Hành động phá hoại DB** | Mất mát dữ liệu thật | Quy tắc Least Privilege, Sandbox/QA env, Cleanup scope |
| **False PASS** | Bỏ sót lỗi nghiêm trọng | Bắt buộc Evidence (Request/Response/DB/Screenshot) |
| **Flaky Automation** | Test chạy chập chờn | Retry tối đa 1 lần, phân loại Product vs Test Issue |
| **Code tự chấm code** | Lỗi logic từ dev bị lọt lưới | Derive Test Case từ AC/Spec độc lập với Code |
| **Chi phí Token cao** | Lãng phí ngân sách | Lọc đúng Context liên quan, chia giai đoạn nhỏ |
| **Phụ thuộc AI quá mức** | Tester mất tư duy phản biện | Tester giữ quyền sở hữu Strategy, Oracle & Sign-off |
        `,
        interactiveComponent: 'risk-matrix'
      },
      {
        id: 'sec-7-2',
        title: 'Checklist 60 Giây Trước Khi Bước Vào Phòng Phỏng Vấn',
        contentMarkdown: `
⚡ **Nằm lòng 10 nguyên tắc vàng:**
1. AI sinh kết quả theo xác suất token/pattern; có thể hallucinate.
2. Context và Source of Truth quan trọng hơn một prompt "thần thánh".
3. CARE: Context, Action, Rules, Example; đối với QA luôn nhớ Test Oracle + Evidence.
4. Phân biệt rõ: Prompt ≠ Instruction ≠ Skill ≠ Agent ≠ MCP.
5. Derive test từ AC/Spec, tuyệt đối KHÔNG derive từ code để code tự chấm nó.
6. Flow chuẩn: Ground -> Clarify -> Plan -> Approve -> Execute -> Verify -> Report -> Learn.
7. Đã bảo PASS là phải có Expected, Actual và Evidence (Log/Screenshot/DB).
8. AI Test cần Least Privilege, không dùng Secret/PII thật, không làm Destructive action.
9. AI tăng tốc Automation; Senior QA vẫn sở hữu Risk, Strategy và Release recommendation.
10. Khi trả lời câu hỏi kinh nghiệm, dùng cấu trúc STAR / STAR-C: **Situation -> Task -> Action -> Result -> Control/Lesson**.
        `
      }
    ]
  }
];
