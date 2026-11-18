import { StageVisual } from '../types';

/**
 * Visual learning per stage: one interactive diagram ("bức tranh lớn"),
 * one decision tree ("chọn đúng") and a few side-by-side comparisons ("đừng nhầm").
 * Diagram coordinates are box centres in a 1200 × 440 canvas (box 180 × 66).
 */
export const VISUALS: Record<string, StageVisual> = {
  // ───────────────────────────── Chặng 1 ─────────────────────────────
  'stage-1': {
    diagram: {
      title: 'AI trả lời một câu hỏi như thế nào',
      nodes: [
        { id: 'q', label: 'Câu hỏi', sub: 'Bạn gõ vào', emoji: '💬', x: 110, y: 220, what: 'Mọi thứ bắt đầu từ câu bạn gõ: càng rõ bối cảnh, AI càng đoán đúng.', tip: 'Câu hỏi mơ hồ → câu trả lời chung chung.' },
        { id: 'tok', label: 'Token', sub: 'Cắt thành mảnh', emoji: '🧩', x: 340, y: 220, what: 'Câu được cắt thành các mảnh nhỏ (token). AI tính giới hạn và chi phí theo số token, không theo số chữ.', tip: 'Tiếng Việt có dấu thường tốn nhiều token hơn tiếng Anh.' },
        { id: 'emb', label: 'Embedding', sub: 'Bản đồ ý nghĩa', emoji: '🗺️', x: 580, y: 220, what: 'Mỗi token thành một điểm trên “bản đồ ý nghĩa”: từ gần nghĩa nằm gần nhau. Nhờ vậy AI hiểu “bug” gần “lỗi”.', tip: 'Đây cũng là nền tảng của tìm kiếm theo nghĩa trong RAG (chặng 6).' },
        { id: 'llm', label: 'LLM đoán chữ', sub: 'Từng chữ một', emoji: '🔮', x: 820, y: 220, what: 'Model chấm điểm các chữ có thể đứng tiếp, chọn một chữ, nối vào, rồi lặp lại tới khi xong câu trả lời.', tip: 'Nó tối ưu “nghe hợp lý”, không tối ưu “đúng sự thật”.' },
        { id: 'ans', label: 'Câu trả lời', sub: 'Trôi chảy, tự tin', emoji: '📝', x: 1070, y: 220, what: 'Kết quả luôn nghe rất tự tin — kể cả khi sai.', tip: 'Tự tin không có nghĩa là đúng. Luôn kiểm chứng.' },
        { id: 'ctx', label: 'Context window', sub: 'Giới hạn trí nhớ', emoji: '📏', x: 580, y: 70, side: true, what: 'Lượng token tối đa AI nhìn thấy trong một lần (câu hỏi + lịch sử chat + câu trả lời). Vượt quá thì phần cũ bị bỏ.', tip: 'Dán log quá dài → AI chỉ “thấy” một phần mà vẫn trả lời như thấy hết.' },
        { id: 'temp', label: 'Temperature', sub: 'Độ ngẫu nhiên', emoji: '🌡️', x: 820, y: 70, side: true, what: 'Tham số quyết định AI chọn chữ “an toàn” hay “bất ngờ”. Thấp → ổn định; cao → đa dạng, dễ bịa.', tip: 'Sinh script, trích xuất dữ liệu → để thấp.' },
        { id: 'doc', label: 'Tài liệu bạn đưa', sub: 'Nguồn sự thật', emoji: '📎', x: 580, y: 370, side: true, what: 'User story, AC, spec bạn dán vào câu hỏi. Có tài liệu, chữ đúng sẽ được điểm cao hơn hẳn.', tip: 'Cách giảm bịa hiệu quả nhất: đưa tài liệu + yêu cầu trích nguồn.' },
        { id: 'risk', label: 'Hallucination', sub: 'Bịa rất tự tin', emoji: '👻', x: 1070, y: 370, side: true, what: 'Khi không biết, AI vẫn đoán chữ tiếp theo như mọi lần → ra thông tin nghe hợp lý nhưng sai.', tip: 'AI không bao giờ được làm “expected result” — đó là việc của AC.' },
      ],
      edges: [
        ['q', 'tok', 'cắt'],
        ['tok', 'emb', 'hiểu nghĩa'],
        ['emb', 'llm'],
        ['llm', 'ans', 'viết'],
        ['ctx', 'emb', '', true],
        ['temp', 'llm', '', true],
        ['doc', 'llm', 'grounding'],
        ['ans', 'risk', '', true],
      ],
    },
    decide: {
      title: 'AI vừa trả lời sai — vì sao?',
      start: 's',
      nodes: {
        s: {
          q: 'Câu trả lời sai theo kiểu nào?',
          opts: [
            ['Rất tự tin nhưng có thông tin không hề có trong tài liệu', 'hallu'],
            ['Bỏ sót phần đầu của tài liệu / log dài', 'ctx'],
            ['Mỗi lần hỏi lại ra một kiểu khác nhau', 'temp'],
            ['Tính toán, suy luận nhiều bước bị sai', 'reason'],
          ],
        },
        reason: {
          q: 'Bạn đang hỏi một lần cho cả bài toán nhiều bước?',
          opts: [
            ['Đúng, hỏi một phát', 'split'],
            ['Không, đã chia nhỏ rồi mà vẫn sai', 'model'],
          ],
        },
        hallu: { answer: 'Đưa tài liệu + yêu cầu trích nguồn', why: 'Dán đúng user story/AC/spec vào câu hỏi và yêu cầu “chỉ dựa trên tài liệu, ghi rõ dựa vào đoạn nào; không có thì nói không biết”.', remember: 'Không có nguồn → không tin.' },
        ctx: { answer: 'Cắt nhỏ, gửi đúng phần liên quan', why: 'Nội dung vượt context window nên phần đầu bị bỏ. Lọc đúng đoạn quanh thời điểm lỗi, hoặc tóm tắt từng phần rồi mới hỏi tổng.', remember: 'Ít mà đúng chỗ > nhiều mà loãng.' },
        temp: { answer: 'Hạ temperature + cố định định dạng', why: 'Temperature thấp giúp kết quả ổn định hơn. Kèm mẫu output (bảng, JSON) để mỗi lần trả về cùng một dạng.', remember: 'Việc cần lặp lại được → temperature thấp.' },
        split: { answer: 'Chia thành từng bước (prompt chaining)', why: 'Hỏi từng bước, kiểm tra kết quả mỗi bước rồi mới đi tiếp. Bắt lỗi logic sớm hơn nhiều so với hỏi một lần.', remember: 'Việc nhiều bước → nhiều prompt nhỏ.' },
        model: { answer: 'Dùng reasoning model hoặc tự kiểm tra bằng công cụ', why: 'Model suy luận nhiều bước làm tốt hơn với bài toán logic; phần tính toán quan trọng nên kiểm tra lại bằng code/bảng tính.', remember: 'Số liệu quan trọng → tự tính lại.' },
      },
    },
    compare: [
      {
        a: 'Phần mềm thường',
        b: 'Hệ thống AI',
        rows: [
          ['Logic đến từ', 'Dev viết luật (if/else)', 'Học từ dữ liệu'],
          ['Kết quả', 'Cùng input → cùng output', 'Có thể khác nhau mỗi lần, có tỉ lệ sai'],
          ['Test bằng', '1 input → 1 expected', 'Tỉ lệ đúng trên bộ test đại diện'],
        ],
        rule: 'Test AI = đo tỉ lệ, không phải soi từng case.',
      },
      {
        a: 'Hỏi không kèm tài liệu',
        b: 'Hỏi kèm tài liệu',
        rows: [
          ['AI dựa vào', 'Những gì nó “nhớ” từ internet', 'Tài liệu bạn đưa'],
          ['Rủi ro bịa', 'Cao', 'Thấp hơn nhiều'],
          ['Kiểm chứng', 'Khó — không biết lấy từ đâu', 'Dễ — đối chiếu đoạn được trích'],
        ],
        rule: 'Muốn đúng chuyện dự án → đưa tài liệu dự án.',
      },
    ],
  },

  // ───────────────────────────── Chặng 2 ─────────────────────────────
  'stage-2': {
    diagram: {
      title: 'Quy trình dùng AI để viết test',
      nodes: [
        { id: 'ac', label: 'User story · AC', sub: 'Nguồn sự thật', emoji: '📋', x: 110, y: 220, what: 'Điểm xuất phát duy nhất đáng tin: yêu cầu đã được duyệt.', tip: 'Không có AC rõ → hỏi PO trước, đừng để AI đoán luật nghiệp vụ.' },
        { id: 'prompt', label: 'Prompt', sub: '6 thành phần', emoji: '✍️', x: 350, y: 220, what: 'Vai trò · Bối cảnh · Yêu cầu · Dữ liệu đầu vào · Ràng buộc · Định dạng kết quả.', tip: 'Thiếu dữ liệu đầu vào là nguyên nhân số 1 khiến AI bịa.' },
        { id: 'ai', label: 'AI sinh nháp', sub: 'Test case · data · script', emoji: '🤖', x: 600, y: 220, what: 'AI viết bản nháp rất nhanh: test case, dữ liệu test, script API/UI, bug report.', tip: 'Coi đây là bản nháp của một đồng nghiệp mới — luôn cần review.' },
        { id: 'review', label: 'Tester review', sub: 'Đối chiếu · chạy thử', emoji: '🕵️', x: 850, y: 220, what: 'Đối chiếu với AC, loại case bịa, bổ sung case thiếu, chạy thử script và cố tình làm hỏng tính năng xem test có đỏ không.', tip: 'Test không bao giờ đỏ = test vô dụng.' },
        { id: 'out', label: 'Testware dùng thật', sub: 'Đưa vào bộ test', emoji: '✅', x: 1090, y: 220, what: 'Test case/script đã qua review mới được đưa vào bộ test chính thức.', tip: 'Ghi chú “có AI hỗ trợ” để người sau biết cần soi kỹ.' },
        { id: 'tech', label: 'Kỹ thuật prompt', sub: 'Few-shot · chaining · meta', emoji: '🎯', x: 350, y: 70, side: true, what: 'Few-shot: cho ví dụ mẫu. Chaining: chia bước, duyệt từng bước. Meta: nhờ AI viết prompt.', tip: 'Lặp lại cùng mẫu → few-shot. Phức tạp → chaining.' },
        { id: 'fix', label: 'Sửa prompt', sub: 'Hoặc hỏi lại', emoji: '🔁', x: 600, y: 370, side: true, what: 'Review thấy sai → bổ sung bối cảnh, thêm ràng buộc, thêm ví dụ, rồi chạy lại.', tip: 'Sai cùng một kiểu nhiều lần → sửa prompt, đừng sửa tay mãi.' },
        { id: 'lib', label: 'Thư viện prompt', sub: 'Dùng chung cả team', emoji: '📚', x: 1090, y: 370, side: true, what: 'Prompt nào cho kết quả tốt thì lưu lại thành mẫu cho cả team.', tip: 'Prompt cũng là testware — có version, có người phụ trách.' },
      ],
      edges: [
        ['ac', 'prompt', 'nguồn'],
        ['prompt', 'ai'],
        ['ai', 'review', 'nháp'],
        ['review', 'out', 'đạt'],
        ['review', 'fix', 'chưa đạt'],
        ['fix', 'prompt'],
        ['tech', 'prompt', '', true],
        ['out', 'lib', 'lưu prompt tốt'],
      ],
    },
    decide: {
      title: 'Chọn kỹ thuật prompt nào?',
      start: 's',
      nodes: {
        s: {
          q: 'Việc bạn muốn AI làm là gì?',
          opts: [
            ['Sinh nhiều kết quả theo cùng một mẫu (Gherkin, bảng…)', 'few'],
            ['Việc phức tạp, nhiều bước, sai một bước là hỏng', 'chain'],
            ['Việc mới, chưa biết viết prompt thế nào', 'meta'],
            ['AI cứ tự nghĩ ra luật nghiệp vụ', 'ground'],
          ],
        },
        few: { answer: 'Few-shot prompting', why: 'Đưa 2–3 ví dụ input → output mẫu vào prompt. AI làm theo đúng format, đúng độ chi tiết.', remember: 'Muốn giống mẫu → cho mẫu.' },
        chain: { answer: 'Prompt chaining', why: 'Chia thành nhiều prompt nhỏ: phân tích → liệt kê điều kiện test → viết test case → kiểm tra độ phủ. Duyệt kết quả từng bước trước khi đi tiếp.', remember: 'Phức tạp → chia bước, duyệt từng bước.' },
        meta: { answer: 'Meta prompting', why: 'Mô tả mục tiêu và nhờ AI đề xuất prompt; bạn chỉnh lại rồi dùng. Như pair với AI để viết prompt.', remember: 'Chưa biết bắt đầu → nhờ AI viết prompt.' },
        ground: { answer: 'Thêm dữ liệu đầu vào + ràng buộc', why: 'Dán nguyên văn AC vào prompt và ràng buộc “chỉ dựa trên AC; thiếu thông tin thì ghi CẦN LÀM RÕ”.', remember: 'Không cho nguồn → AI tự nghĩ nguồn.' },
      },
    },
    compare: [
      {
        a: 'Few-shot',
        b: 'Prompt chaining',
        rows: [
          ['Cách làm', 'Một prompt có kèm ví dụ mẫu', 'Nhiều prompt nối tiếp, duyệt từng bước'],
          ['Hợp với', 'Việc lặp lại, cần đúng format', 'Việc phức tạp, cần chính xác'],
          ['Ví dụ', 'Sinh 100 scenario Gherkin', 'Phân tích user story → AC → test case'],
        ],
        rule: 'Giống mẫu → few-shot. Nhiều bước → chaining.',
      },
      {
        a: 'System prompt',
        b: 'User prompt',
        rows: [
          ['Ai đặt', 'Người xây công cụ', 'Người dùng chat'],
          ['Thời gian hiệu lực', 'Cả phiên làm việc', 'Từng lượt hỏi'],
          ['Chứa gì', 'Vai trò, luật chung, giọng văn', 'Câu hỏi, dữ liệu, việc cụ thể'],
        ],
        rule: 'Luật chung → system prompt. Việc cụ thể → user prompt.',
      },
    ],
  },

  // ───────────────────────────── Chặng 3 ─────────────────────────────
  'stage-3': {
    diagram: {
      title: 'Các lớp an toàn khi đưa việc cho AI',
      nodes: [
        { id: 'data', label: 'Dữ liệu dự án', sub: 'Log, tài liệu, code', emoji: '🗂️', x: 110, y: 220, what: 'Thứ bạn định đưa cho AI. Có thể chứa dữ liệu khách hàng, token, mật khẩu.', tip: 'Hỏi trước: dữ liệu này có được phép rời khỏi hệ thống không?' },
        { id: 'mask', label: 'Che dữ liệu', sub: 'PII, token, secret', emoji: '🙈', x: 350, y: 220, what: 'Thay email, số điện thoại, token bằng ***; chỉ giữ phần thật sự cần.', tip: 'Gửi ít nhất có thể — đủ để AI làm việc là được.' },
        { id: 'tool', label: 'Công cụ đã duyệt', sub: 'Công ty cho phép', emoji: '🏢', x: 600, y: 220, what: 'Dùng công cụ AI có hợp đồng bảo mật với công ty, không dùng tài khoản cá nhân.', tip: 'Chưa có công cụ được duyệt → hỏi lead, đừng tự dùng.' },
        { id: 'out', label: 'Output của AI', sub: 'Có thể sai', emoji: '📤', x: 850, y: 220, what: 'Kết quả có thể có hallucination (bịa), reasoning error (sai logic) hoặc bias (lệch).', tip: 'Đọc output như đọc code review của người mới.' },
        { id: 'verify', label: 'Kiểm chứng', sub: 'Đối chiếu · chạy thử', emoji: '🔍', x: 1090, y: 220, what: 'Đối chiếu với tài liệu, chạy thử script, nhờ chuyên gia nghiệp vụ xem phần khó.', tip: 'Mức kiểm chứng tỉ lệ thuận với mức rủi ro.' },
        { id: 'shadow', label: 'Shadow AI', sub: 'Tool cá nhân ✕', emoji: '🚫', x: 600, y: 70, side: true, what: 'Tự dùng công cụ AI chưa được duyệt: rủi ro lộ dữ liệu, vi phạm hợp đồng, rắc rối bản quyền.', tip: '“Tiện tay” dán vào chatbot miễn phí là dạng shadow AI phổ biến nhất.' },
        { id: 'inj', label: 'Chỉ dẫn độc hại', sub: 'Giấu trong tài liệu', emoji: '🪤', x: 350, y: 370, side: true, what: 'Tài liệu, email, ticket mà AI đọc có thể chứa câu “bỏ qua mọi quy tắc…” (prompt injection).', tip: 'Nội dung AI đọc là dữ liệu, không phải mệnh lệnh.' },
        { id: 'human', label: 'Quyết định của người', sub: 'Không giao cho AI', emoji: '🧑‍⚖️', x: 1090, y: 370, side: true, what: 'Chốt luật nghiệp vụ khi spec mâu thuẫn, quyết định release, test bảo mật trên production.', tip: 'AI đề xuất, người quyết định.' },
      ],
      edges: [
        ['data', 'mask', 'trước khi gửi'],
        ['mask', 'tool'],
        ['tool', 'out'],
        ['out', 'verify'],
        ['shadow', 'tool', '', true],
        ['inj', 'tool', '', true],
        ['verify', 'human', 'việc quan trọng'],
      ],
    },
    decide: {
      title: 'Có nên đưa việc này cho AI không?',
      start: 's',
      nodes: {
        s: {
          q: 'Dữ liệu có chứa thông tin nhạy cảm (khách hàng, token, mật khẩu)?',
          opts: [
            ['Có', 'mask'],
            ['Không', 'risk'],
          ],
        },
        mask: {
          q: 'Che / thay được phần nhạy cảm mà vẫn đủ để AI làm việc?',
          opts: [
            ['Được', 'masked'],
            ['Không được', 'no'],
          ],
        },
        risk: {
          q: 'Nếu AI sai, hậu quả có lớn không (release, tiền, bảo mật)?',
          opts: [
            ['Lớn', 'draft'],
            ['Nhỏ, sai thì sửa nhanh', 'go'],
          ],
        },
        masked: { answer: 'Che dữ liệu rồi dùng công cụ đã duyệt', why: 'Chỉ gửi phần đã che và thật sự cần. Dùng công cụ công ty cho phép, sau đó kiểm chứng output như bình thường.', remember: 'Gửi ít nhất có thể.' },
        no: { answer: 'Không đưa cho AI', why: 'Làm thủ công hoặc dùng công cụ chạy nội bộ được công ty phê duyệt cho loại dữ liệu này.', remember: 'Không che được → không gửi.' },
        draft: { answer: 'AI làm nháp, người quyết định', why: 'Để AI soạn, phân tích, gợi ý; người chịu trách nhiệm kiểm chứng kỹ và ra quyết định cuối.', remember: 'Rủi ro cao → người quyết.' },
        go: { answer: 'Giao cho AI, kiểm chứng nhanh', why: 'Việc rủi ro thấp (soạn nháp, tóm tắt, gợi ý dữ liệu test) cứ để AI làm, bạn rà nhanh trước khi dùng.', remember: 'Rủi ro thấp → tận dụng tốc độ.' },
      },
    },
    compare: [
      {
        a: 'Hallucination',
        b: 'Reasoning error',
        rows: [
          ['Là gì', 'Bịa thông tin không có thật', 'Sai logic, sai quan hệ, sai thứ tự'],
          ['Ví dụ', 'Test case cho AC không tồn tại', 'Xếp test B trước test A dù B cần dữ liệu của A'],
          ['Cách bắt', 'Đối chiếu tài liệu, yêu cầu trích nguồn', 'Kiểm tra logic từng bước, chạy thử'],
        ],
        rule: 'Bịa → đối chiếu nguồn. Sai logic → kiểm tra từng bước.',
      },
      {
        a: 'Giao cho AI',
        b: 'Giữ cho người',
        rows: [
          ['Loại việc', 'Soạn nháp, tóm tắt, sinh dữ liệu, viết script', 'Chốt luật nghiệp vụ, quyết định release'],
          ['Nếu sai', 'Sửa nhanh, ít hậu quả', 'Ảnh hưởng người dùng, tiền, bảo mật'],
          ['Vai trò tester', 'Kiểm chứng', 'Quyết định và chịu trách nhiệm'],
        ],
        rule: 'AI làm nhanh, người chịu trách nhiệm.',
      },
    ],
  },

  // ───────────────────────────── Chặng 4 ─────────────────────────────
  'stage-4': {
    diagram: {
      title: 'Quy trình test một tính năng có AI',
      nodes: [
        { id: 'ac', label: 'Tiêu chí đo được', sub: 'Metric + ngưỡng', emoji: '🎯', x: 110, y: 220, what: 'Ví dụ: “≥ 90% câu trả lời đúng theo tài liệu trên 300 câu hỏi thật”.', tip: '“Chatbot phải trả lời tốt” không phải tiêu chí.' },
        { id: 'data', label: 'Bộ test đại diện', sub: 'Giống dữ liệu thật', emoji: '🧪', x: 350, y: 220, what: 'Đủ lớn và có tỉ lệ các loại giống người dùng thật — kể cả ca hiếm, ca biên.', tip: 'Test toàn ca dễ → điểm đẹp nhưng vô nghĩa.' },
        { id: 'run', label: 'Chạy model', sub: 'Thu kết quả', emoji: '▶️', x: 600, y: 220, what: 'Chạy toàn bộ bộ test, lưu lại output từng case để phân tích.', tip: 'Model không xác định → có thể chạy vài lần.' },
        { id: 'metric', label: 'Metrics', sub: 'Accuracy · Precision · Recall', emoji: '📊', x: 850, y: 220, what: 'Lập confusion matrix (TP, FP, FN, TN) rồi tính các chỉ số.', tip: 'Precision sợ báo nhầm, Recall sợ bỏ sót.' },
        { id: 'decide', label: 'Đạt / chưa đạt', sub: 'So với ngưỡng', emoji: '⚖️', x: 1090, y: 220, what: 'So kết quả với tiêu chí đã thống nhất từ đầu.', tip: 'Đặt ngưỡng trước khi chạy, đừng chỉnh ngưỡng theo kết quả.' },
        { id: 'split', label: 'Tách train / test', sub: 'Không dùng lẫn', emoji: '✂️', x: 350, y: 70, side: true, what: 'Bộ test phải là dữ liệu model chưa từng thấy khi học.', tip: 'Điểm cao trên dữ liệu đã học = học tủ (overfitting).' },
        { id: 'imb', label: 'Lệch lớp', sub: 'Class imbalance', emoji: '⚠️', x: 850, y: 70, side: true, what: 'Khi một loại chiếm áp đảo (99% giao dịch bình thường), accuracy cao chẳng nói lên gì.', tip: 'Luôn hỏi: mỗi loại chiếm bao nhiêu %?' },
        { id: 'err', label: 'Phân tích ca sai', sub: 'Sai ở đâu, vì sao', emoji: '🔬', x: 850, y: 370, side: true, what: 'Gom nhóm các ca sai: loại dữ liệu nào, nhóm người dùng nào, điều kiện nào.', tip: 'Ca sai là nơi tìm ra bug thật của tính năng AI.' },
      ],
      edges: [
        ['ac', 'data'],
        ['data', 'run'],
        ['run', 'metric', 'TP·FP·FN·TN'],
        ['metric', 'decide', 'so ngưỡng'],
        ['split', 'data', '', true],
        ['imb', 'metric', '', true],
        ['metric', 'err', 'xem ca sai'],
      ],
    },
    decide: {
      title: 'Nên ưu tiên metric nào?',
      start: 's',
      nodes: {
        s: {
          q: 'Với tính năng này, kiểu sai nào đắt hơn?',
          opts: [
            ['Bỏ sót (không phát hiện ca cần phát hiện)', 'recall'],
            ['Báo nhầm (cảnh báo sai, chặn nhầm)', 'precision'],
            ['Cả hai đều quan trọng như nhau', 'f1'],
            ['Dữ liệu cân bằng, chỉ cần con số dễ hiểu', 'acc'],
          ],
        },
        recall: { answer: 'Recall', why: 'Recall = TP / (TP + FN): trong các ca thật, bắt được bao nhiêu. Ví dụ phát hiện gian lận, phát hiện lỗ hổng, sàng lọc bệnh.', remember: 'Sợ bỏ sót → Recall.' },
        precision: { answer: 'Precision', why: 'Precision = TP / (TP + FP): trong các ca model báo, đúng bao nhiêu. Ví dụ lọc spam, tự động đóng ticket.', remember: 'Sợ báo nhầm → Precision.' },
        f1: { answer: 'F1-score', why: 'Trung bình điều hoà của precision và recall — chỉ cao khi cả hai cùng cao.', remember: 'Cân bằng cả hai → F1.' },
        acc: { answer: 'Accuracy (kèm tỉ lệ lớp)', why: 'Accuracy = đúng / tổng. Chỉ dùng được khi các loại có tỉ lệ gần nhau; luôn báo kèm tỉ lệ từng loại.', remember: 'Lệch lớp → đừng tin accuracy.' },
      },
    },
    compare: [
      {
        a: 'Precision',
        b: 'Recall',
        rows: [
          ['Công thức', 'TP / (TP + FP)', 'TP / (TP + FN)'],
          ['Trả lời câu hỏi', 'Model báo “có”, tin được bao nhiêu?', 'Ca “có” thật, bắt được bao nhiêu?'],
          ['Quan trọng khi', 'Báo nhầm rất phiền (lọc spam)', 'Bỏ sót rất nguy hiểm (gian lận)'],
        ],
        rule: 'Sợ báo nhầm → Precision. Sợ bỏ sót → Recall.',
      },
      {
        a: 'Validation set',
        b: 'Test set',
        rows: [
          ['Dùng để', 'Chỉnh, chọn model', 'Đánh giá cuối cùng'],
          ['Dùng bao nhiêu lần', 'Nhiều lần', 'Một lần, ở cuối'],
          ['Dấu hiệu overfitting', 'Điểm validation cao…', '…nhưng điểm test thấp hẳn'],
        ],
        rule: 'Không bao giờ chỉnh model dựa trên test set.',
      },
    ],
  },

  // ───────────────────────────── Chặng 5 ─────────────────────────────
  'stage-5': {
    diagram: {
      title: 'Bộ đồ nghề test model — gắn vào đâu?',
      nodes: [
        { id: 'data', label: 'Dữ liệu', sub: 'Train & đầu vào', emoji: '🗃️', x: 130, y: 220, what: 'Dữ liệu dạy model và dữ liệu đưa vào lúc chạy thật.', tip: 'Dữ liệu kém → model kém, test model sau cũng vô ích.' },
        { id: 'model', label: 'Model', sub: 'Hộp đen', emoji: '🧠', x: 430, y: 220, what: 'Thường không biết bên trong làm gì, cũng không có đáp án đúng cho từng input.', tip: 'Không có expected result vẫn test được — xem các khối xung quanh.' },
        { id: 'out', label: 'Output', sub: 'Dự đoán', emoji: '📤', x: 730, y: 220, what: 'Kết quả model trả ra cho từng input.', tip: 'Kiểm tra quan hệ giữa các output, không chỉ từng giá trị.' },
        { id: 'prod', label: 'Production', sub: 'Chạy thật', emoji: '🌍', x: 1050, y: 220, what: 'Model phục vụ người dùng thật; dữ liệu và thế giới thay đổi theo thời gian.', tip: 'Test xong không phải là hết — phải theo dõi tiếp.' },
        { id: 'dq', label: 'Test dữ liệu', sub: 'Thiếu, sai, trùng, lệch', emoji: '🧹', x: 130, y: 70, side: true, what: 'Kiểm tra giá trị thiếu, sai kiểu, ngoài khoảng, trùng lặp, nhãn sai, không đại diện.', tip: 'Chạy tự động trong pipeline trước mỗi lần train.' },
        { id: 'bias', label: 'Test bias', sub: 'Counterfactual', emoji: '⚖️', x: 430, y: 70, side: true, what: 'Giữ nguyên hồ sơ, chỉ đổi giới tính/tuổi, so kết quả trên nhiều mẫu.', tip: 'Chỉ đổi đúng một thuộc tính nhạy cảm mỗi lần.' },
        { id: 'mt', label: 'Metamorphic', sub: 'Kiểm quan hệ', emoji: '🔁', x: 730, y: 70, side: true, what: 'Biết quan hệ: tăng diện tích thì giá không giảm; đổi mã tin thì giá giữ nguyên.', tip: 'Không cần biết đáp án đúng, chỉ cần biết quy luật.' },
        { id: 'ab', label: 'A/B · Back-to-back', sub: 'So sánh phiên bản', emoji: '🆚', x: 730, y: 370, side: true, what: 'A/B: model nào tốt hơn (thống kê). Back-to-back: so với bản độc lập để tìm chỗ khác nhau.', tip: 'Tốt hơn → A/B. Tìm lỗi → back-to-back.' },
        { id: 'drift', label: 'Theo dõi drift', sub: 'Dữ liệu đổi theo thời gian', emoji: '📉', x: 1050, y: 70, side: true, what: 'Data drift: dữ liệu vào khác trước. Concept drift: “đúng” đã thay đổi (luật mới).', tip: 'Đặt ngưỡng cảnh báo khi phân phối thay đổi.' },
        { id: 'deploy', label: 'Canary · Shadow', sub: 'Deploy an toàn', emoji: '🐤', x: 1050, y: 370, side: true, what: 'Canary: 5% user dùng thật model mới. Shadow: model mới chạy ngầm, user không thấy.', tip: 'Muốn thử trên dữ liệu thật mà không ảnh hưởng user → shadow.' },
      ],
      edges: [
        ['data', 'model'],
        ['model', 'out'],
        ['out', 'prod'],
        ['dq', 'data', '', true],
        ['bias', 'model', '', true],
        ['mt', 'out', '', true],
        ['ab', 'out', '', true],
        ['drift', 'prod', '', true],
        ['deploy', 'prod', '', true],
      ],
    },
    decide: {
      title: 'Không có expected result thì test bằng gì?',
      start: 's',
      nodes: {
        s: {
          q: 'Bạn đang có gì trong tay?',
          opts: [
            ['Biết quy luật input → output (tăng X thì Y phải tăng)', 'mt'],
            ['Có phiên bản cũ hoặc một bản tham chiếu', 'ref'],
            ['Lo model đối xử khác nhau giữa nhóm người dùng', 'bias'],
            ['Model đang chạy thật, sợ xuống cấp theo thời gian', 'drift'],
          ],
        },
        ref: {
          q: 'Bạn muốn biết điều gì?',
          opts: [
            ['Bản nào tốt hơn', 'ab'],
            ['Hai bản khác nhau ở đâu (để tìm lỗi)', 'b2b'],
          ],
        },
        mt: { answer: 'Metamorphic testing', why: 'Từ một test case gốc, đổi input theo quy luật để sinh test case mới, rồi kiểm tra output có giữ đúng quan hệ không.', remember: 'Không biết đáp án, nhưng biết quy luật.' },
        ab: { answer: 'A/B testing', why: 'Cho hai phiên bản chạy trên cùng loại input/người dùng, so metric bằng thống kê để chọn bản tốt hơn.', remember: 'Chọn bản tốt hơn → A/B.' },
        b2b: { answer: 'Back-to-back testing', why: 'Cùng input, so output với một bản độc lập (team khác làm, khác thư viện). Chỗ nào khác nhau thì soi lỗi ở đó.', remember: 'Tìm lỗi → back-to-back, bản tham chiếu phải độc lập.' },
        bias: { answer: 'Counterfactual bias testing', why: 'Giữ nguyên hồ sơ, chỉ đổi thuộc tính nhạy cảm (giới tính, tuổi), chạy trên nhiều mẫu và so tỉ lệ kết quả giữa các nhóm.', remember: 'Đổi đúng một thuộc tính, nhiều mẫu.' },
        drift: { answer: 'Theo dõi drift', why: 'So phân phối dữ liệu vào/ra hiện tại với lúc train; nếu có phản hồi người dùng thì so với “đáp án đúng” hiện tại. Vượt ngưỡng → cảnh báo, cân nhắc train lại.', remember: 'Test xong vẫn phải theo dõi.' },
      },
    },
    compare: [
      {
        a: 'A/B testing',
        b: 'Back-to-back',
        rows: [
          ['Mục đích', 'Chọn phiên bản tốt hơn', 'Tìm chỗ khác nhau để phát hiện lỗi'],
          ['So với', 'Phiên bản kia của cùng hệ thống', 'Một bản tham chiếu độc lập'],
          ['Cách kết luận', 'Thống kê trên metric', 'So từng output'],
        ],
        rule: 'Tốt hơn → A/B. Tìm lỗi → back-to-back.',
      },
      {
        a: 'Data drift',
        b: 'Concept drift',
        rows: [
          ['Cái gì thay đổi', 'Dữ liệu đầu vào', 'Thế nào là “đúng”'],
          ['Ví dụ', 'Xuất hiện kiểu lừa đảo mới', 'Luật mới: giao dịch cũ nay thành rủi ro cao'],
          ['Phát hiện', 'So phân phối dữ liệu vào', 'So với phản hồi / đáp án đúng hiện tại'],
        ],
        rule: 'Input đổi → data drift. Ý nghĩa đổi → concept drift.',
      },
      {
        a: 'Canary',
        b: 'Shadow',
        rows: [
          ['User có thấy model mới?', 'Có — một phần nhỏ (vd. 5%)', 'Không — chạy ngầm'],
          ['Rủi ro', 'Một nhóm nhỏ bị ảnh hưởng nếu lỗi', 'Gần như không ảnh hưởng user'],
          ['Hợp khi', 'Sẵn sàng thử thật, mở rộng dần', 'Muốn so trên dữ liệu thật trước'],
        ],
        rule: 'User thấy → canary. User không thấy → shadow.',
      },
    ],
  },

  // ───────────────────────────── Chặng 6 ─────────────────────────────
  'stage-6': {
    diagram: {
      title: 'Test một ứng dụng LLM từ đầu đến cuối',
      nodes: [
        { id: 'user', label: 'Người dùng', sub: 'Đặt câu hỏi', emoji: '🙋', x: 110, y: 220, what: 'Người dùng hỏi chatbot hoặc giao việc cho agent.', tip: 'Bộ test nên có cả câu hỏi “lạ”, ngoài phạm vi và câu cố tình gài.' },
        { id: 'app', label: 'Chatbot / Agent', sub: 'Ứng dụng của team', emoji: '🤖', x: 350, y: 220, what: 'Ứng dụng nhận câu hỏi, ghép prompt, gọi LLM, gọi tool và trả lời.', tip: 'Đây là đối tượng test chính — không chỉ test riêng model.' },
        { id: 'llm', label: 'LLM', sub: 'Suy luận', emoji: '🔮', x: 600, y: 220, what: 'Model quyết định trả lời luôn, truy xuất tài liệu hay gọi tool.', tip: 'Đổi model hoặc đổi prompt = phải chạy lại bộ eval.' },
        { id: 'rag', label: 'Truy xuất', sub: 'RAG', emoji: '🔎', x: 850, y: 90, what: 'Tìm đoạn tài liệu liên quan nhất để đưa vào câu trả lời.', tip: 'Test riêng: lấy đúng đoạn chưa? Câu không có đáp án thì sao?' },
        { id: 'kb', label: 'Knowledge base', sub: 'Tài liệu nội bộ', emoji: '📚', x: 1090, y: 90, what: 'Kho tài liệu chatbot được phép dùng.', tip: 'Tài liệu cũ chưa gỡ → câu trả lời mâu thuẫn.' },
        { id: 'tool', label: 'Tools / MCP', sub: 'Hành động', emoji: '🛠️', x: 850, y: 350, what: 'Agent gọi API, tạo ticket, query DB… qua tool hoặc MCP server.', tip: 'Chỉ cấp quyền tối thiểu cần thiết.' },
        { id: 'sys', label: 'Hệ thống thật', sub: 'Trạng thái cuối', emoji: '🗄️', x: 1090, y: 350, what: 'Nơi kết quả hành động thực sự xảy ra.', tip: 'Test agent = kiểm tra trạng thái cuối ở đây, không tin lời agent.' },
        { id: 'eval', label: 'Eval suite', sub: 'Chạy trong CI', emoji: '📏', x: 350, y: 70, side: true, what: 'Bộ 50–500 câu hỏi đã duyệt, chấm tự động, chạy lại mỗi khi đổi prompt/model/tài liệu.', tip: 'Gate theo ngưỡng %, không đòi 100%.' },
        { id: 'sec', label: 'Kiểm thử bảo mật', sub: 'OWASP LLM · red team', emoji: '🛡️', x: 600, y: 370, side: true, what: 'Prompt injection, lộ dữ liệu, output không escape, agent quá nhiều quyền, tiêu tốn tài nguyên.', tip: 'Đừng để secret trong prompt.' },
        { id: 'approve', label: 'Người duyệt', sub: 'Hành động quan trọng', emoji: '✋', x: 350, y: 370, side: true, what: 'Hành động không đảo ngược (xoá, gửi email khách, deploy) phải có người bấm duyệt.', tip: 'Agent đề xuất, người bấm nút.' },
      ],
      edges: [
        ['user', 'app'],
        ['app', 'llm'],
        ['llm', 'rag', 'cần tài liệu'],
        ['rag', 'kb'],
        ['llm', 'tool', 'cần hành động'],
        ['tool', 'sys'],
        ['eval', 'app', '', true],
        ['sec', 'llm', '', true],
        ['approve', 'app', '', true],
      ],
    },
    decide: {
      title: 'Test ứng dụng LLM này thế nào?',
      start: 's',
      nodes: {
        s: {
          q: 'Bạn đang test loại nào / tình huống nào?',
          opts: [
            ['Chatbot trả lời dựa trên tài liệu (RAG)', 'rag'],
            ['Agent thao tác trên hệ thống khác', 'agent'],
            ['Team vừa đổi prompt hoặc đổi model', 'eval'],
            ['Lo chatbot bị tấn công, lộ dữ liệu', 'sec'],
          ],
        },
        eval: {
          q: 'Đã có bộ câu hỏi eval chưa?',
          opts: [
            ['Chưa có', 'build'],
            ['Có rồi', 'rerun'],
          ],
        },
        rag: { answer: 'Bộ câu hỏi 5 nhóm + kiểm tra trích nguồn', why: 'Có đáp án · cần ghép 2 tài liệu · KHÔNG có đáp án · ngoài phạm vi · tài liệu chứa chỉ dẫn độc hại. Mọi khẳng định phải có trong đoạn được trích.', remember: 'Câu không có đáp án là test quan trọng nhất.' },
        agent: { answer: 'Kiểm tra trạng thái cuối + quyền tối thiểu', why: 'Kiểm tra agent gọi đúng tool, đúng tham số, không làm việc nguy hiểm, và quan trọng nhất là kết quả thật trong hệ thống. Hành động không đảo ngược phải có người duyệt.', remember: 'Không tin lời agent — kiểm tra hệ thống.' },
        build: { answer: 'Dựng eval suite trước khi merge', why: 'Gom 50–200 câu hỏi thật đã duyệt kèm kỳ vọng; chấm bằng assertion (chứa/không chứa, JSON hợp lệ) trước, LLM-as-a-judge có rubric sau.', remember: 'Không có eval = không biết tốt lên hay tệ đi.' },
        rerun: { answer: 'Chạy lại eval, gate theo ngưỡng', why: 'Chạy mỗi câu vài lần, so tỉ lệ đạt với bản cũ; chỉ merge khi không giảm (đặc biệt ở nhóm câu quan trọng).', remember: 'Đổi gì cũng chạy lại eval.' },
        sec: { answer: 'OWASP LLM checklist + red teaming', why: 'Thử prompt injection trực tiếp và qua tài liệu, dụ lộ system prompt, output chứa script, gọi tool vượt quyền, spam yêu cầu dài. Ghi lại prompt tấn công thành bộ regression.', remember: 'Phòng thủ nhiều lớp, không chỉ dựa vào prompt.' },
      },
    },
    compare: [
      {
        a: 'Assertion cố định',
        b: 'LLM-as-a-judge',
        rows: [
          ['Kiểm tra', 'Chứa/không chứa từ khoá, JSON hợp lệ, không lộ PII', 'Tiêu chí định tính: đúng ý, lịch sự, đủ ý'],
          ['Độ tin cậy', 'Tuyệt đối, rẻ, nhanh', 'Cần rubric rõ và kiểm tra lại giám khảo'],
          ['Dùng khi', 'Luôn dùng trước', 'Khi không viết được assertion cố định'],
        ],
        rule: 'Assertion trước, judge sau.',
      },
      {
        a: 'RAG',
        b: 'Fine-tuning',
        rows: [
          ['Giải quyết', 'Model thiếu kiến thức dự án', 'Sai phong cách, sai định dạng'],
          ['Cập nhật', 'Thêm tài liệu là xong', 'Phải huấn luyện lại'],
          ['Test thêm', 'Retrieval có lấy đúng đoạn không', 'Model có quên kỹ năng cũ không'],
        ],
        rule: 'Thiếu kiến thức → RAG. Sai phong cách → fine-tune.',
      },
    ],
  },
};
