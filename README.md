# 🧠 Lộ trình học AI cho Tester

Web học tiếng Việt, gom lại thành **1 lộ trình 6 chặng**: từ con số 0 đến test được sản phẩm có AI. Mỗi chặng chỉ có những ý cần nắm, 1 bài thực hành chạy trên trình duyệt và 3 câu tự kiểm tra.

| # | Chặng | Thực hành |
|---|---|---|
| 1 | Hiểu AI & LLM ở mức đủ dùng | Temperature |
| 2 | Dùng AI để test: viết prompt đúng cách | Prompt 6 thành phần |
| 3 | Dùng AI an toàn: rủi ro & giới hạn | Tấn công chatbot (prompt injection) |
| 4 | Test hệ thống có AI: tư duy thống kê | Confusion matrix |
| 5 | Kỹ thuật test model & dữ liệu | Metamorphic testing · bias · test dữ liệu |
| 6 | Test ứng dụng LLM thực chiến & đưa AI vào team | RAG pipeline |

Ngoài lộ trình còn có trang **Prompt mẫu** và **Luyện phỏng vấn** (liên kết từ chặng 6). Nội dung chặng 1–3 tương ứng ISTQB CT-GenAI, chặng 4–5 tương ứng ISTQB CT-AI v2.0, cho ai muốn thi chứng chỉ.

## Chạy local

```bash
npm install
npm run dev              # http://localhost:3000
PORT=3456 npm run dev    # nếu cổng 3000 đang bị app khác dùng
npm run build            # build tĩnh vào dist/ (deploy GitHub Pages)
```

## Sửa nội dung

Toàn bộ lộ trình nằm trong **một file**: `src/data/roadmap.ts`. Mỗi chặng gồm `goal`, `points` (4–6 ý), `lab`, `quiz` (3 câu). Các bài thực hành nằm ở `src/components/labs/`.

Tiến độ học lưu trong `localStorage` của trình duyệt.
