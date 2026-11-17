import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { buildEssayPrompt, DEFAULT_GEMINI_MODEL } from "./src/lib/aiPrompts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const MODEL = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI Client lazily or safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Endpoint: Evaluate Essay / Self-Answer / CARE Prompt
  app.post("/api/evaluate-essay", async (req, res) => {
    try {
      const { questionTitle, questionContext, userAnswer, expectedKeyPoints } = req.body;

      if (!userAnswer || userAnswer.trim().length === 0) {
        return res.status(400).json({ error: "Câu trả lời không được để trống." });
      }

      const ai = getAiClient();

      const prompt = buildEssayPrompt({ questionTitle, questionContext, userAnswer, expectedKeyPoints });

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const evaluation = JSON.parse(responseText);
      return res.json(evaluation);
    } catch (error: any) {
      console.error("Error evaluating essay:", error);
      return res.status(500).json({
        error: error.message || "Lỗi khi xử lý đánh giá từ Gemini AI.",
      });
    }
  });

  // API Endpoint: Mock Interview Simulator
  app.post("/api/mock-interview", async (req, res) => {
    try {
      const { conversationHistory, currentAnswer, questionContext } = req.body;
      const ai = getAiClient();

      const prompt = `
Bạn là một Senior QA Director đang phỏng vấn tuyển dụng vị trí Senior QA Engineer / QA Automation Lead am hiểu về AI.
Mục tiêu: Đánh giá tư duy Risk-Based Testing, hiểu biết về LLM/Agent, CARE Prompt framework, Test Oracle, và khả năng kiểm soát AI của ứng viên.

Bối cảnh phỏng vấn hiện tại: ${questionContext || "Phỏng vấn Senior QA về ứng dụng AI trong testing"}
Lịch sử trao đổi trước đó: ${JSON.stringify(conversationHistory || [])}

Ứng viên vừa trả lời:
"""
${currentAnswer}
"""

Hãy đóng vai người phỏng vấn, đưa ra phản hồi ngắn gọn chuyên nghiệp, chỉ ra điểm ấn tượng hoặc nghi vấn, và hỏi tiếp 1 câu đào sâu (follow-up question) mang tính thực chiến cao.

Trả về dạng JSON:
{
  "feedback": string (Đánh giá nhận xét câu trả lời vừa rồi, 2-3 câu),
  "scoreRating": number (Thang 1-10 cho câu trả lời này),
  "followUpQuestion": string (Câu hỏi tiếp theo dành cho ứng viên),
  "tips": string (Gợi ý cách trả lời ghi điểm tuyệt đối)
}
`;

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText);
      return res.json(result);
    } catch (error: any) {
      console.error("Error in mock interview:", error);
      return res.status(500).json({
        error: error.message || "Lỗi mô phỏng phỏng vấn.",
      });
    }
  });

  // API Endpoint: Generate / Refine CARE Prompt
  app.post("/api/generate-prompt", async (req, res) => {
    try {
      const { taskDescription, targetSystem, constraints } = req.body;
      const ai = getAiClient();

      const prompt = `
Hãy đóng vai một AI Prompt Architect dành cho Tester.
Dựa vào yêu cầu công việc test: "${taskDescription}", Hệ thống: "${targetSystem}", Giới hạn: "${constraints}",
hãy thiết kế một Prompt chuẩn mực theo khung CARE + Test Oracle.

Trả về JSON có cấu trúc:
{
  "carePrompt": string (Toàn bộ prompt hoàn chỉnh được định dạng Markdown có [CONTEXT], [ACTION], [RULES], [EXAMPLE]),
  "breakdown": {
    "context": string,
    "action": string,
    "rules": string,
    "example": string
  },
  "qaAddons": {
    "sourceOfTruth": string,
    "coverageScope": string,
    "evidenceRequired": string,
    "stopCondition": string
  },
  "explanation": string (Giải thích ngắn lý do tại sao prompt này giúp AI tránh hallucination)
}
`;

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const result = JSON.parse(response.text || "{}");
      return res.json(result);
    } catch (error: any) {
      console.error("Error generating CARE prompt:", error);
      return res.status(500).json({
        error: error.message || "Lỗi tạo CARE prompt.",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Tester Learning Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
