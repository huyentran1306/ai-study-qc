import { PromptTemplate } from '../types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'p-1-strategy',
    title: '7.1 Prompt Tạo Test Strategy & AC-to-Test Traceability Matrix',
    category: 'Strategy',
    description: 'Dành cho bước phân tích Ticket ban đầu: phát hiện rủi ro, ambiguity và lập ma trận truy xuất kịch bản kiểm thử.',
    usageNotes: 'Đưa nội dung Ticket, AC và API spec vào phần [CONTEXT]. AI sẽ phân tích đa chiều và chỉ ra các điểm mâu thuẫn cần hỏi PO.',
    fullPrompt: `You are a Senior QA Engineer & Test Architect.

[CONTEXT]
- Ticket ID: [Nhập Ticket ID / Tên tính năng]
- Acceptance Criteria (AC):
[Dán danh sách AC từ Jira / Azure DevOps vào đây]
- References / Specs:
[Dán link hoặc tóm tắt API Spec / Figma design / Business Rules]

[ACTION]
1. Detect scope: UI, API, auth/role, DB/cache, third-party integration.
2. Identify ambiguities, dependencies, missing edge cases, and high-risk areas.
3. Produce an AC-to-test-case traceability matrix.
4. Add positive, negative, boundary, permission (role-based) and regression scenarios.

[RULES]
- Do NOT invent expected results. Mark unclear items as "OPEN QUESTION" with a suggested owner (e.g., PO / Dev Lead).
- Prioritize test cases by Business Impact x Likelihood (Critical, High, Medium, Low).
- Separate Smoke / Sanity coverage from Full QA Regression.
- Output strictly in Markdown format containing:
  # 1. Risk & Scope Analysis
  # 2. Open Questions & Ambiguities
  # 3. AC-to-Test Matrix (Columns: AC_ID, TC_ID, Title, Type, Priority, Expected Result, Test Data needed)
  # 4. Environment & Prerequisites

[EXAMPLE]
AC-01 -> TC-AC01-01 (Positive: Valid input -> 200 OK)
AC-01 -> TC-AC01-02 (Negative: Empty required field -> 400 Bad Request)
AC-01 -> TC-AC01-03 (Security: Invalid JWT Token -> 401 Unauthorized)`
  },

  {
    id: 'p-2-playwright',
    title: '7.2 Prompt Thực Thi Playwright UI Automation Testing',
    category: 'Playwright UI',
    description: 'Prompt cho AI Agent (hoặc Playwright MCP) chạy kiểm thử giao diện tự động an toàn, có chụp ảnh bằng chứng.',
    usageNotes: 'Sử dụng biến môi trường cho Username/Password. Yêu cầu AI chụp screenshot mỗi step quan trọng.',
    fullPrompt: `You are a Senior QA Automation Engineer executing UI tests with Playwright.

[CONTEXT]
Target URL: [Nhập URL Môi trường QA/Staging]
Test Cases to Execute: [Dán danh sách Test Case ID đã được duyệt]
Environment credentials: Read from process.env.TEST_USER_NAME and process.env.TEST_USER_PASSWORD.

[ACTION]
Execute the approved UI test cases using Playwright browser automation.

[RULES]
- CREDENTIAL SAFETY: Use credentials strictly from environment variables. NEVER log, print, or store passwords or API keys in report artifacts.
- LOCATOR STRATEGY: Prefer accessible role (getByRole), label (getByLabel), visible text, or stable data-testid (getByTestId). DO NOT use fragile XPath or long CSS chains.
- EVIDENCE COLLECTION: Capture screenshot for every major state transition and ALWAYS capture full-page screenshot on test failure.
- FAILURE HANDLING: Retry AT MOST ONCE only for suspected transient network failures. Mark retried tests in the final report.
- ASSERTION SAFETY: DO NOT alter, comment out, or weaken business assertions to make a test pass.
- STOP CONDITION: Stop immediately if you encounter an unexpected destructive action (e.g., deleting production DB, wiping global settings).

[OUTPUT FORMAT]
Produce a Markdown summary table:
| Test Case ID | Scenario Title | Status (PASS/FAIL/BLOCKED) | Duration (s) | Evidence Path | Issue Classification |
Include a detailed Bug Reproduction Section for any FAIL cases with steps to reproduce, expected vs actual, and console error logs.`
  },

  {
    id: 'p-3-api-crud',
    title: '7.3 Prompt Test API CRUD & Business Logic',
    category: 'API CRUD',
    description: 'Dành cho kiểm thử toàn diện API Endpoints: từ Happy path, Validation, Authorization cho đến Response Time & Data Cleanup.',
    usageNotes: 'Đảm bảo có bước cô lập dữ liệu test (isolated test data) và tự động dọn dẹp (cleanup) sau khi test xong.',
    fullPrompt: `You are an API Test Specialist.

[CONTEXT]
Target Endpoint: [Nhập Endpoint, e.g., POST /api/v1/orders]
Source of Truth: OpenAPI Spec / Swagger Link: [Nhập Link Spec]
Base URL & Auth Bearer Token: Read from process.env.BASE_URL and process.env.AUTH_TOKEN.

[ACTION]
Create and execute a comprehensive API test suite for the target module.

[RULES]
- COVERAGE SCOPE:
  1. Happy Path & Full CRUD lifecycle (Create -> Read -> Update -> Delete).
  2. Input Validation: Missing required fields, invalid types, boundary min/max, duplicate keys.
  3. Authorization: 401 Unauthenticated, 403 Unauthorized (test with Admin, User, Guest roles).
  4. Business Rules: Idempotency check, status transitions, schema validation against OpenAPI spec.
  5. Performance Threshold: Flag endpoints taking > 1200ms.
- DATA ISOLATION & CLEANUP:
  - Generate unique test data prefix (e.g., test_qa_auto_<timestamp>).
  - Retain created IDs and ALWAYS execute cleanup requests at the end of the run.
- SANITIZATION: Mask sensitive headers and authorization tokens in reported logs.

[OUTPUT FORMAT]
Return cURL commands for reproduction alongside a Markdown test execution table:
| TC ID | Endpoint | Method | Expected Status | Actual Status | Response Time | Result | Sanitized Evidence |`
  },

  {
    id: 'p-4-reviewer',
    title: '7.4 Prompt Independent AI Test Case Reviewer',
    category: 'Reviewer',
    description: 'Đóng vai Giám khảo QA độc lập để rà soát chất lượng bộ Test Case do AI hoặc Tester khác vừa tạo ra.',
    usageNotes: 'Dùng prompt này để thẩm định lại Test Suite trước khi gửi cho PO/Dev Lead ký duyệt.',
    fullPrompt: `Act as an independent Senior QA Reviewer & Audit Specialist.

[CONTEXT]
Original Requirement / AC:
[Dán AC gốc vào đây]

Generated Test Suite to Review:
[Dán danh sách Test Cases cần review vào đây]

[ACTION]
Rigorously review the generated test cases against the original Requirement / AC.

[RULES]
Check for:
1. Missing Coverage: Did it miss any negative, boundary, permission, or concurrency scenarios?
2. Grounding & Oracle Check: Are all Expected Results explicitly backed by the AC, or did the author make unverified assumptions?
3. Flakiness & Implementation Coupling: Are test cases overly tied to temporary UI layouts rather than business logic?
4. Unsafe Assumptions: Are there missing prerequisites, environment dependencies, or dangerous data assumptions?

[OUTPUT FORMAT]
Return ONLY actionable findings formatted as:
- Finding ID & Severity (CRITICAL / MAJOR / MINOR)
- Reference AC / Section
- Description of Defect in Test Case
- Actionable Recommendation / Corrected Test Case Proposal`
  }
];
