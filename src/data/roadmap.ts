import { Stage } from '../types';

/**
 * The single learning roadmap. Each stage = only what a tester really needs:
 * a goal, 4–6 key points, one hands-on lab and 3 self-check questions.
 * ISTQB refs point to CT-AI v2.0 / CT-GenAI v1.x chapters for those who want the certificate.
 */
export const ROADMAP: Stage[] = [
  {
    id: 'stage-1',
    emoji: '🌱',
    title: 'Hiểu AI & LLM ở mức đủ dùng',
    goal: 'Biết AI/ML/LLM là gì và vì sao AI có thể trả lời sai một cách rất tự tin.',
    duration: '1 tuần',
    points: [
      { t: 'AI ⊃ ML ⊃ Deep Learning ⊃ GenAI', d: 'Phần mềm thường chạy theo luật dev viết; ML tự học quy luật từ dữ liệu, nên kết quả mang tính xác suất và có tỉ lệ sai.' },
      { t: 'LLM = máy đoán token kế tiếp', d: 'Văn bản bị chia thành token; model chọn token có xác suất cao để nối tiếp. Nó tối ưu “nghe hợp lý”, không tối ưu “đúng sự thật”.' },
      { t: 'Context window', d: 'Model chỉ “nhìn” được một lượng token nhất định. Dán log quá dài thì phần đầu có thể bị bỏ qua.' },
      { t: 'Temperature & tính không xác định', d: 'Cùng một prompt có thể ra kết quả khác nhau. Temperature thấp → ổn định; cao → sáng tạo nhưng dễ bịa.' },
      { t: 'Hallucination', d: 'AI bịa thông tin với giọng rất tự tin. Vì vậy AI không bao giờ được làm Test Oracle — expected result phải đến từ requirement/AC.' },
    ],
    lab: 'temperature',
    istqb: 'CT-GenAI ch.1 · CT-AI ch.1',
    quiz: [
      {
        q: 'Quan hệ nào ĐÚNG?',
        options: ['ML ⊂ GenAI ⊂ AI', 'GenAI ⊂ Deep Learning ⊂ Machine Learning ⊂ AI', 'AI ⊂ ML ⊂ Deep Learning', 'Deep Learning và ML không liên quan'],
        a: 1,
        why: 'GenAI dựa trên deep learning; deep learning là tập con của ML; ML là một nhánh của AI.',
      },
      {
        q: 'Ở mức cơ bản nhất, LLM sinh câu trả lời bằng cách nào?',
        options: ['Tra đáp án đúng trong cơ sở dữ liệu', 'Lặp lại việc dự đoán token kế tiếp theo xác suất', 'Chạy code của dự án', 'Hỏi ý kiến con người'],
        a: 1,
        why: 'LLM dự đoán token kế tiếp; văn bản “hợp lý thống kê” chứ không đảm bảo đúng.',
      },
      {
        q: 'Cần LLM sinh test script ổn định, ít “sáng tạo” thì nên đặt temperature thế nào?',
        options: ['Thấp (gần 0)', 'Cao (trên 1)', 'Không liên quan', 'Ngẫu nhiên mỗi lần'],
        a: 0,
        why: 'Temperature thấp thu hẹp phân phối xác suất → output nhất quán hơn.',
      },
    ],
  },
  {
    id: 'stage-2',
    emoji: '✍️',
    title: 'Dùng AI để test: viết prompt đúng cách',
    goal: 'Viết được prompt cho ra test case, test data, script dùng được — và biết kiểm chứng chúng.',
    duration: '1–2 tuần',
    points: [
      { t: 'Prompt 6 thành phần', d: 'Role · Context · Instruction · Input data (user story, AC, spec) · Constraints · Output format. Thiếu context/input là nguyên nhân số 1 khiến AI bịa.' },
      { t: 'Thêm 4 yếu tố của QA', d: 'Nguồn sự thật (AC/spec nào), phạm vi coverage, bằng chứng cần có (log, screenshot, response), điều kiện dừng/hỏi lại khi thiếu thông tin.' },
      { t: 'Chọn kỹ thuật theo việc', d: 'Few-shot (cho ví dụ) cho việc lặp lại cần format cố định như Gherkin. Prompt chaining (chia bước, người duyệt từng bước) cho việc phức tạp. Meta prompting (nhờ AI viết prompt) khi chưa biết bắt đầu.' },
      { t: 'AI giúp được ở cả 3 giai đoạn', d: 'Trước test: soi AC mơ hồ, phân tích impact, traceability. Trong test: sinh dữ liệu, script API/UI, phân loại lỗi. Sau test: viết bug report, tóm tắt kết quả.' },
      { t: 'Luôn kiểm chứng output', d: 'Đối chiếu với AC, chạy thử script, chứng minh test có thể FAIL khi tính năng hỏng. Lưu prompt tốt vào thư viện chung của team.' },
    ],
    lab: 'prompt-6',
    istqb: 'CT-GenAI ch.2',
    quiz: [
      {
        q: 'Đưa 3 ví dụ user story kèm Gherkin mẫu vào prompt rồi yêu cầu sinh scenario cho story mới là kỹ thuật gì?',
        options: ['Zero-shot', 'Few-shot prompting', 'Meta prompting', 'Prompt chaining'],
        a: 1,
        why: 'Few-shot đưa nhiều ví dụ để AI làm theo đúng mẫu.',
      },
      {
        q: 'Đặc điểm cốt lõi của prompt chaining là gì?',
        options: ['Một prompt duy nhất thật dài', 'Chia việc thành nhiều bước, kiểm tra kết quả từng bước trước khi đi tiếp', 'Đưa nhiều ví dụ', 'Dùng nhiều AI cùng lúc'],
        a: 1,
        why: 'Chia nhỏ + kiểm tra giữa chừng giúp bắt lỗi sớm.',
      },
      {
        q: 'AI sinh 20 test case rất “đẹp”. Bước tiếp theo đúng là gì?',
        options: ['Import thẳng vào tool quản lý test', 'Đối chiếu với AC, loại case bịa, bổ sung case thiếu', 'Sửa AC cho khớp test case', 'Nhờ AI tự review và tin kết quả'],
        a: 1,
        why: 'Con người chịu trách nhiệm kiểm chứng output của AI theo nguồn sự thật.',
      },
    ],
  },
  {
    id: 'stage-3',
    emoji: '🛡️',
    title: 'Dùng AI an toàn: rủi ro & giới hạn',
    goal: 'Nhận ra lỗi của AI và không làm lộ dữ liệu hay giao nhầm việc cho AI.',
    duration: '1 tuần',
    points: [
      { t: '3 loại lỗi cần nhận ra', d: 'Hallucination: test case cho AC không tồn tại. Reasoning error: sắp thứ tự test sai phụ thuộc. Bias: dữ liệu test lệch (vd. toàn tên/địa chỉ nước ngoài).' },
      { t: 'Bảo vệ dữ liệu', d: 'Không dán mật khẩu, token, dữ liệu khách hàng thật. Che PII trước khi gửi, chỉ gửi phần cần thiết.' },
      { t: 'Không dùng “shadow AI”', d: 'Chỉ dùng công cụ AI công ty đã duyệt. Tool cá nhân có thể làm lộ dữ liệu, vi phạm hợp đồng, rắc rối bản quyền.' },
      { t: 'Prompt injection', d: 'Nội dung AI đọc (tài liệu, web, ticket) có thể chứa chỉ dẫn độc hại. Không bao giờ để secret trong prompt.' },
      { t: 'Việc KHÔNG giao hết cho AI', d: 'Chốt business rule khi spec mâu thuẫn, exploratory testing chuyên sâu, security/destructive test chưa được phép, quyết định release. Tester giữ quyền sở hữu rủi ro và Test Oracle.' },
    ],
    lab: 'red-team',
    istqb: 'CT-GenAI ch.3 · ch.5',
    quiz: [
      {
        q: 'AI sinh test case kiểm tra một acceptance criterion KHÔNG có trong user story. Đây là lỗi gì?',
        options: ['Reasoning error', 'Hallucination', 'Bias', 'Data poisoning'],
        a: 1,
        why: 'Hallucination: bịa ra yêu cầu không tồn tại.',
      },
      {
        q: 'AI xếp TC-B (cần dữ liệu do TC-A tạo) chạy TRƯỚC TC-A. Đây chủ yếu là lỗi gì?',
        options: ['Hallucination', 'Reasoning error', 'Bias', 'Non-determinism'],
        a: 1,
        why: 'Reasoning error: hiểu sai quan hệ logic/phụ thuộc.',
      },
      {
        q: 'Dùng tài khoản chatbot cá nhân chưa được công ty duyệt cho công việc gọi là gì?',
        options: ['Prompt chaining', 'Shadow AI', 'Red teaming', 'Fine-tuning'],
        a: 1,
        why: 'Shadow AI gây rủi ro bảo mật, tuân thủ và sở hữu trí tuệ.',
      },
    ],
  },
  {
    id: 'stage-4',
    emoji: '📊',
    title: 'Test hệ thống CÓ AI: tư duy thống kê',
    goal: 'Biết đặt tiêu chí chấp nhận và đo chất lượng cho tính năng AI (chatbot, OCR, gợi ý, chấm điểm…).',
    duration: '1–2 tuần',
    points: [
      { t: 'Không còn “1 input → 1 expected” chắc chắn', d: 'AI có tỉ lệ sai cho phép. Một case fail không nói lên gì; cần bộ test đủ lớn và đại diện cho dữ liệu thật.' },
      { t: 'Acceptance criteria phải đo được', d: 'Metric + ngưỡng + tập dữ liệu (+ sai số). Ví dụ: “≥ 90% câu trả lời đúng theo knowledge base trên bộ 300 câu đại diện”.' },
      { t: 'Confusion matrix & 4 metric', d: 'Accuracy = đúng/tổng. Precision = TP/(TP+FP), sợ báo nhầm. Recall = TP/(TP+FN), sợ bỏ sót. F1 cân bằng hai cái.' },
      { t: 'Bẫy accuracy', d: '1000 giao dịch có 10 gian lận: model luôn nói “không gian lận” vẫn đạt 99% accuracy nhưng bắt được 0%. Luôn hỏi tỉ lệ các lớp.' },
      { t: 'Train / validation / test', d: 'Điểm chỉ có nghĩa khi đo trên tập test độc lập. Validation cao mà test thấp hẳn → overfitting (“học tủ”).' },
    ],
    lab: 'confusion-matrix',
    istqb: 'CT-AI ch.2 · ch.3 · ch.4',
    quiz: [
      {
        q: 'TP = 40, FP = 10, FN = 20, TN = 130. Precision là bao nhiêu?',
        options: ['66.7%', '80%', '85%', '92.9%'],
        a: 1,
        why: 'Precision = TP/(TP+FP) = 40/50 = 80%. (Recall = 66.7%, Accuracy = 85%.)',
      },
      {
        q: '1.000 giao dịch có 10 gian lận. Model luôn đoán “không gian lận” có accuracy bao nhiêu?',
        options: ['10%', '50%', '90%', '99%'],
        a: 3,
        why: '990/1000 = 99% nhưng recall = 0%.',
      },
      {
        q: 'Muốn kết quả test chính xác hơn (sai số nhỏ hơn) với cùng độ tin cậy, cần làm gì?',
        options: ['Giảm số test case', 'Tăng số test case', 'Tăng temperature', 'Đổi model'],
        a: 1,
        why: 'Cỡ mẫu lớn hơn → sai số nhỏ hơn.',
      },
    ],
  },
  {
    id: 'stage-5',
    emoji: '🔬',
    title: 'Kỹ thuật test model & dữ liệu',
    goal: 'Có “bộ đồ nghề” khi không biết chính xác expected result của AI.',
    duration: '1–2 tuần',
    points: [
      { t: 'Metamorphic testing', d: 'Không biết đáp án đúng nhưng biết quan hệ: tăng diện tích nhà thì giá không được giảm; đổi mã tin đăng thì giá không đổi. Sinh test mới từ test cũ và kiểm tra quan hệ.' },
      { t: 'Test dữ liệu trước khi test model', d: 'Thiếu giá trị, sai kiểu, ngoài khoảng, trùng lặp, nhãn sai, không đại diện người dùng thật. Dữ liệu kém thì model kém.' },
      { t: 'Test bias', d: 'Giữ nguyên hồ sơ, chỉ đổi giới tính/tuổi (counterfactual) và so kết quả trên nhiều mẫu. Kết quả đổi → có bias.' },
      { t: 'So sánh để thay oracle', d: 'A/B testing: model mới có tốt hơn model cũ không (thống kê). Back-to-back: so với một phiên bản độc lập để tìm lỗi.' },
      { t: 'Drift & triển khai', d: 'Sau khi chạy thật, dữ liệu và “ý nghĩa” thay đổi theo thời gian → theo dõi liên tục. Deploy an toàn bằng canary (5% user) hoặc shadow (chạy ngầm).' },
    ],
    lab: 'metamorphic',
    extraLabs: ['bias', 'dataset-constraint'],
    istqb: 'CT-AI ch.5 · ch.6 · ch.7',
    quiz: [
      {
        q: 'Model ước tính phí bảo hiểm xe. Quan hệ nào kiểm tra tính “đơn điệu” (monotonicity)?',
        options: ['Đổi tên chủ xe → phí không đổi', 'Tăng số vụ tai nạn, giữ nguyên còn lại → phí không giảm', 'Đổi đơn vị tiền tệ → phí tương đương', 'Chạy lại cùng hồ sơ → phí không đổi'],
        a: 1,
        why: 'Monotonicity: output đổi theo chiều của input. Đổi tên là kiểm tra “bất biến” (invariance).',
      },
      {
        q: 'Quy định mới khiến loại giao dịch từng “rủi ro thấp” nay là “rủi ro cao”, model kém đi. Đây là gì?',
        options: ['Data drift', 'Concept drift', 'Overfitting', 'Adversarial attack'],
        a: 1,
        why: 'Concept drift: quan hệ giữa input và đáp án đúng thay đổi.',
      },
      {
        q: 'Cách đúng để kiểm tra model duyệt vay có thiên vị giới tính?',
        options: ['Xoá cột giới tính rồi kết luận không bias', 'Chỉ đổi giới tính trong nhiều hồ sơ, giữ nguyên còn lại, so kết quả có ý nghĩa thống kê', 'Thử 1 hồ sơ với 2 giới tính', 'Hỏi data scientist'],
        a: 1,
        why: 'Counterfactual trên nhiều mẫu mới đủ bằng chứng.',
      },
    ],
  },
  {
    id: 'stage-6',
    emoji: '🚀',
    title: 'Test ứng dụng LLM thực chiến & đưa AI vào team',
    goal: 'Test được chatbot/RAG/agent ở dự án thật và vận hành AI trong quy trình QA.',
    duration: '1–2 tuần',
    points: [
      { t: 'Eval suite = regression test của LLM', d: 'Bộ 50–500 câu hỏi đã duyệt; chấm bằng assertion (chứa/không chứa, JSON hợp lệ), rồi mới đến LLM-as-a-judge có rubric. Chạy lại mỗi khi đổi prompt, model, dữ liệu; gate theo ngưỡng % trong CI.' },
      { t: 'Test RAG', d: 'Câu có đáp án, câu cần ghép 2 tài liệu, câu KHÔNG có đáp án (phải nói “không tìm thấy”), tài liệu mâu thuẫn/cũ, tài liệu chứa chỉ dẫn độc hại.' },
      { t: 'Test AI agent', d: 'Kiểm tra agent gọi đúng tool, đúng tham số, không làm việc nguy hiểm, và quan trọng nhất là trạng thái cuối của hệ thống (ticket có thật sự được tạo đúng?). Hành động không đảo ngược phải có người duyệt.' },
      { t: 'OWASP Top 10 cho LLM', d: 'Checklist bảo mật: prompt injection, lộ dữ liệu, output không được escape (XSS), agent quá nhiều quyền, lộ system prompt, tiêu tốn tài nguyên không giới hạn…' },
      { t: 'Multi-agent & quy trình team', d: 'Tách vai Planner → Implementer → Checker (viết test từ AC, không nhìn code) → Judge (chạy E2E, giữ bằng chứng). Gặp chỗ mơ hồ: việc nhỏ thì tự quyết + ghi log; ảnh hưởng kiến trúc/business thì dừng chờ lead; thiếu quyền/credential thì hỏi người.' },
      { t: 'Vai trò mới của tester', d: 'Thành “AI-assisted tester”: định hướng và kiểm chứng output AI, duy trì thư viện prompt, sở hữu rủi ro chất lượng.' },
    ],
    lab: 'rag',
    extraLabs: ['red-team'],
    istqb: 'CT-GenAI ch.4 · CT-AI ch.4 (red teaming) · OWASP LLM Top 10',
    quiz: [
      {
        q: 'Test case quan trọng nhất để chống “bịa” trong hệ thống RAG là gì?',
        options: ['Câu hỏi có đáp án rõ ràng', 'Câu hỏi KHÔNG có đáp án trong tài liệu — hệ thống phải nói không tìm thấy', 'Câu hỏi rất ngắn', 'Câu hỏi bằng emoji'],
        a: 1,
        why: 'Câu không có đáp án lộ ra xu hướng bịa của model.',
      },
      {
        q: 'Cách kiểm chứng tốt nhất khi test một agent tạo ticket là gì?',
        options: ['Tin câu trả lời “đã tạo xong” của agent', 'Kiểm tra ticket thực sự tồn tại trong hệ thống với đúng thông tin', 'Đếm số token đã dùng', 'Đo thời gian chạy'],
        a: 1,
        why: 'Kiểm tra trạng thái cuối, không tin lời agent.',
      },
      {
        q: 'Output của LLM chứa thẻ <script> và web app hiển thị nó mà không escape. Đây là rủi ro gì?',
        options: ['Improper Output Handling (OWASP LLM05)', 'System Prompt Leakage', 'Data Poisoning', 'Misinformation'],
        a: 0,
        why: 'Output của LLM phải được xử lý như dữ liệu không tin cậy.',
      },
    ],
  },
];

export const STAGE_BY_ID = Object.fromEntries(ROADMAP.map((s) => [s.id, s])) as Record<string, Stage>;

export const SOURCES = [
  { label: 'ISTQB® CT-AI v2.0 (Testing AI-based systems)', url: 'https://istqb.org/certifications/certified-tester-ai-testing-ct-ai/' },
  { label: 'ISTQB® CT-GenAI (Testing with Generative AI)', url: 'https://istqb.org/certifications/gen-ai/' },
  { label: 'OWASP Top 10 for LLM Applications', url: 'https://genai.owasp.org' },
];
