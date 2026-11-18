import React from 'react';
import { LabId } from '../../types';
import { ConfusionMatrixLab } from './ConfusionMatrixLab';
import { MetamorphicLab } from './MetamorphicLab';
import { DatasetConstraintLab } from './DatasetConstraintLab';
import { TemperatureLab } from './TemperatureLab';
import { PromptSixLab } from './PromptSixLab';
import { PromptMagicLab } from './PromptMagicLab';
import { RedTeamLab } from './RedTeamLab';
import { RagLab } from './RagLab';
import { BiasLab } from './BiasLab';

export interface LabMeta {
  id: LabId;
  icon: string;
  title: string;
  desc: string;
  Component: React.FC;
}

export const LABS: LabMeta[] = [
  { id: 'temperature', icon: '🌡️', title: 'Temperature', desc: 'Vì sao cùng một prompt lại ra kết quả khác nhau.', Component: TemperatureLab },
  { id: 'prompt-magic', icon: '🪄', title: 'Prompt tệ vs Prompt tốt', desc: 'Bật từng thành phần của prompt và xem câu trả lời của AI thay đổi.', Component: PromptMagicLab },
  { id: 'prompt-6', icon: '🧩', title: 'Tự viết prompt 6 thành phần', desc: 'Tự gõ prompt của bạn và xem điểm đầy đủ.', Component: PromptSixLab },
  { id: 'red-team', icon: '🎯', title: 'Tấn công chatbot', desc: 'Thử prompt injection trên chatbot giả lập và bật lớp phòng thủ.', Component: RedTeamLab },
  { id: 'confusion-matrix', icon: '🧮', title: 'Confusion Matrix', desc: 'Tính accuracy, precision, recall, F1 và luyện đề.', Component: ConfusionMatrixLab },
  { id: 'metamorphic', icon: '🔁', title: 'Metamorphic Testing', desc: 'Tìm lỗi ẩn trong model định giá nhà mà không cần expected result.', Component: MetamorphicLab },
  { id: 'bias', icon: '⚖️', title: 'Test bias', desc: 'Đổi giới tính/tuổi trong hồ sơ vay và so kết quả.', Component: BiasLab },
  { id: 'dataset-constraint', icon: '🧹', title: 'Test dữ liệu', desc: 'Tìm 8 lỗi dữ liệu cài sẵn trong dataset.', Component: DatasetConstraintLab },
  { id: 'rag', icon: '📚', title: 'RAG Pipeline', desc: 'Thấy câu hỏi không có đáp án, tài liệu mâu thuẫn, chỉ dẫn độc hại.', Component: RagLab },
];

export const LAB_BY_ID = Object.fromEntries(LABS.map((l) => [l.id, l])) as Record<string, LabMeta>;
