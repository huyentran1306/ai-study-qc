import { EssayQuestion } from '../types';

export const ESSAY_QUESTIONS: EssayQuestion[] = [
  {
    id: 'e1-1',
    lessonId: 'lesson-1-llm-core',
    title: 'Câu hỏi Phỏng vấn: Làm thế nào bạn giải thích cơ chế hoạt động của LLM cho Tester mới?',
    scenario: 'Nhà tuyển dụng hỏi: "Bạn hãy giải thích ngắn gọn cách AI/LLM làm việc và tại sao Tester không thể hoàn toàn tin tưởng vào kết quả do AI sinh ra?"',
    expectedKeyPoints: [
      'LLM hoạt động dựa trên cơ chế chia văn bản thành Token và dự đoán token tiếp theo theo xác suất thống kê',
      'LLM không có tư duy sự thật nội tại mà phụ thuộc hoàn toàn vào Context và Training Data',
      'Có khả năng bị Hallucination (ảo giác) – đưa ra câu trả lời sai nhưng văn phong cực kỳ tự tin',
      'AI chỉ hỗ trợ thực thi; Test Oracle (nguồn sự thật) bắt buộc phải dựa vào Requirement/AC đã được phê duyệt'
    ],
    sampleSeniorAnswer: `Thưa anh/chị, tôi giải thích LLM cho team dựa trên 3 điểm cốt lõi:
1. Bản chất: LLM không 'suy nghĩ' hay biết đúng sai như con người, mà nó nhận input, chia thành các token và tính toán xác suất thống kê để đưa ra token tiếp theo hợp lý nhất.
2. Rủi ro Hallucination: Vì chạy theo xác suất, AI có thể sinh ra kết quả nghe rất hợp lý nhưng hoàn toàn sai sự thật (hallucination) nếu thiếu context hoặc gặp dữ liệu nhiễu.
3. Tư duy Test Oracle: AI có thể giúp sinh kịch bản hay viết automation script, nhưng Expected Result bắt buộc phải đối chiếu với Nguồn Sự Thật (Requirement/AC) chứ không bao giờ coi câu trả lời của AI làm Test Oracle. Quyết định chất lượng cuối cùng luôn thuộc về con người (Human-in-the-loop).`
  },

  {
    id: 'e2-1',
    lessonId: 'lesson-2-concepts-diff',
    title: 'Câu hỏi Phỏng vấn: Phân biệt MCP và Chatbot thông thường',
    scenario: 'Nhà tuyển dụng hỏi: "MCP (Model Context Protocol) giúp ích gì cho công việc Testing so với việc dùng ChatGPT web thông thường?"',
    expectedKeyPoints: [
      'Chatbot thông thường chỉ hoạt động thụ động dựa trên prompt văn bản nhập tay',
      'MCP đóng vai trò như chuẩn kết nối an toàn cho phép AI Agent truy vấn trực tiếp dữ liệu có cấu trúc và hạ tầng thật',
      'Ứng dụng trong QA: Cho phép Agent tự động đọc Ticket trên Azure DevOps, tự chạy Playwright browser test, tự query SQL database để verify state',
      'Yêu cầu kiểm soát rủi ro: Cần áp dụng Least Privilege và Human Approval Gate đối với các tác vụ làm thay đổi dữ liệu'
    ],
    sampleSeniorAnswer: `Khác biệt lớn nhất là khả năng Tương tác Hệ thống Thật (Tool Calling & Real Context):
- Với Chatbot web, Tester phải copy-paste tài liệu thủ công và AI không thể tự kiểm tra kết quả trên môi trường test.
- Với MCP, AI Agent được cấp cổng kết nối chuẩn hóa. Ví dụ: MCP Playwright cho phép Agent tự bật trình duyệt kiểm thử UI, MCP Azure DevOps giúp đọc ticket tự động, MCP Database giúp truy vấn DB verify data.
- Tư duy Senior: Khi AI được tích hợp MCP để tác động lên hệ thống thật, tôi thiết lập quyền Least Privilege và các điểm Human Gate để kiểm soát rủi ro an toàn.`
  },

  {
    id: 'e3-1',
    lessonId: 'lesson-3-care-framework',
    title: 'Thực hành Viết Prompt: Thiết kế CARE Prompt cho API Payment Timeout',
    scenario: 'Bạn cần viết một CARE Prompt yêu cầu AI sinh bộ kịch bản kiểm thử API POST /api/v1/checkout trường hợp cổng thanh toán bị Timeout hoặc Mất Kết Nối.',
    expectedKeyPoints: [
      'Có đầy đủ [CONTEXT]: API Checkout, môi trường Staging, mô tả lỗi Timeout',
      'Có [ACTION]: Sinh kịch bản test chi tiết bao gồm Status Code, Response Body, Retry Policy',
      'Có [RULES]: Không lộ Secret Key, bao phủ Idempotency, không tự ý bịa Status Code ngoài spec',
      'Có [EXAMPLE] hoặc format bảng mong muốn',
      'Bổ sung yếu tố QA: Nguồn sự thật Spec v2.1, Yêu cầu Evidence'
    ],
    sampleSeniorAnswer: `[CONTEXT]
Dự án E-commerce, tính năng Checkout API POST /api/v1/checkout. Môi trường Staging.
Nguồn sự thật: Document Spec v2.1 (Mục 4.2 Handling Gateway Timeout).

[ACTION]
Hãy phân tích và thiết kế bộ Test Matrix kiểm thử các kịch bản Gateway Timeout & Network Drop.

[RULES]
- Bao phủ: Timeout 30s từ PG, Retry 3 lần với Exponential Backoff, Check Idempotency Key để tránh trừ tiền 2 lần.
- Không sử dụng Secret Key thật.
- Nếu Spec chưa quy định rõ timeout threshold -> Đặt câu hỏi Open Question cho PO.
- Định dạng kết quả dạng bảng Markdown: ID, Scenario, Expected HTTP Status, Expected Response Body, Idempotency Check, Evidence Required.

[EXAMPLE]
TC-TIMEOUT-01 | Gateway Timeout 30s | Status 504 Gateway Timeout | {"error": "PG_TIMEOUT"} | Verify DB transaction state IS 'PENDING' | Save API log & DB query.`
  },

  {
    id: 'e5-1',
    lessonId: 'lesson-5-multi-agent-sdlc',
    title: 'Câu hỏi Phỏng vấn: Tại sao không để 1 Agent duy nhất vừa viết code vừa viết test?',
    scenario: 'Nhà tuyển dụng hỏi: "Tại sao trong SDLC Kit lại chia thành Planner, Implementer, Checker, Feature Judge thay vì dùng 1 AI Agent làm từ A-Z?"',
    expectedKeyPoints: [
      'Phân tách vai trò (Separation of Concerns) giúp giảm thiểu sai sót và hiện tượng mù đốm (blind spot)',
      'Tránh việc "Code tự chấm code": Nếu 1 agent vừa viết code vừa tạo test case, nó sẽ tự nhiên tạo test case xuôi theo logic sai trong code của nó',
      'Checker Agent bắt buộc derive test case độc lập từ Acceptance Criteria gốc',
      'Feature Judge đóng vai trò nghiệm thu độc lập trên môi trường thật trước khi tạo PR'
    ],
    sampleSeniorAnswer: `Việc phân chia Multi-Agent giải quyết triệt để 2 vấn đề lớn:
1. Nguyên tắc Khách quan (Code không tự chấm code): Nếu 1 Agent vừa code vừa test, nó có xu hướng viết test case khớp với những gì nó đã code (kể cả khi code sai so với AC). Khi tách Checker Agent chỉ đọc AC gốc, test case sẽ hoàn toàn khách quan.
2. Chuyên môn hóa (Separation of Concerns): Planner tập trung vào phân tích kiến trúc, Implementer tập trung vào syntax/convention, Checker tập trung vào boundary/edge cases, và Feature Judge đóng vai trò nghiệm thu E2E trên stack thật. Mô hình này giúp tăng tỷ lệ phát hiện bug trước khi vào nhánh chính.`
  },

  {
    id: 'e7-1',
    lessonId: 'lesson-7-risk-interview',
    title: 'Câu hỏi Phỏng vấn: Sửa lỗi Flaky Test do AI sinh ra như thế nào?',
    scenario: 'Nhà tuyển dụng hỏi: "Automation script do AI viết hay bị Flaky (lúc PASS lúc FAIL). Là Senior QA, bạn giải quyết vấn đề này như thế nào?"',
    expectedKeyPoints: [
      'Không giải quyết bằng cách nâng số lần Retry vô hạn hoặc tự động biến FAIL thành PASS',
      'Phân tích nguyên nhân gốc: Selector không ổn định, race condition, thiếu wait strategy, phụ thuộc test data tĩnh',
      'Cải tiến Selector: Ưu tiên dùng Role, Label, Visible text, stable Test-ID thay vì XPath/CSS đường dẫn dài do AI đoán',
      'Cơ chế Self-healing an toàn: Chỉ tự động phục hồi Selector, tuyệt đối KHÔNG tự ý sửa Business Assertion',
      'Cập nhật vào Instruction / Skill để AI không lặp lại lỗi này lần sau'
    ],
    sampleSeniorAnswer: `Khi gặp Flaky Test do AI sinh ra, quy trình xử lý của tôi bao gồm 4 bước:
1. Triage nguyên nhân: Thu thập Trace log, Screenshot, Network log để phân loại do Selector không ổn định, bất đồng bộ (timing), hay do dữ liệu test bị trùng lặp.
2. Chuẩn hóa Selector: AI hay đoán XPath dài hoặc CSS selector dễ vỡ. Tôi quy định trong Instruction ép AI dùng Locator dựa trên User Role, Accessible Label hoặc \`data-testid\` cố định.
3. Ranh giới Self-healing: Tôi chỉ cho phép AI hỗ trợ tìm lại element locator khi UI thay đổi nhẹ. Tuyệt đối KHÔNG cho AI tự sửa Assertion (Expected vs Actual) để biến FAIL thành PASS.
4. Cập nhật Lesson Learned: Đưa quy tắc wait strategy và locator pattern vào Reusable Prompt/Skill của team để ngăn chặn lỗi này ở các kịch bản sinh sau.`
  }
];
