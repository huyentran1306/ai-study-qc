import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, Award, RotateCcw, Lightbulb } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizModalProps {
  questions: QuizQuestion[];
  lessonTitle: string;
  onCompleteQuiz: (score: number, total: number) => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  questions,
  lessonTitle,
  onCompleteQuiz,
  onClose,
  isDarkMode = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    const newAnswers = { ...userAnswers, [currentIndex]: selectedOption };
    setUserAnswers(newAnswers);

    if (selectedOption === currentQ.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onCompleteQuiz(score, questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setUserAnswers({});
    setScore(0);
    setIsFinished(false);
  };

  if (!currentQ) return null;

  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto ${
      isDarkMode ? 'bg-slate-950/80 text-slate-100' : 'bg-slate-900/50 text-slate-800'
    }`}>
      <div className={`border rounded-2xl max-w-2xl w-full p-5 lg:p-6 shadow-2xl space-y-5 my-8 transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-3 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 border rounded-lg ${
              isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'
            }`}>
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Bài Kiểm Tra Trắc Nghiệm Tương Tác</h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{lessonTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-all text-xs font-mono ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            ✕ Đóng
          </button>
        </div>

        {!isFinished ? (
          <>
            {/* Progress Bar */}
            <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <span>Câu hỏi {currentIndex + 1} / {questions.length}</span>
              <span className="font-semibold text-indigo-600">Điểm hiện tại: {score}</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Box */}
            <div className="space-y-4">
              <h4 className={`text-sm font-semibold leading-relaxed ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                {currentQ.question}
              </h4>

              {/* Options list */}
              <div className="space-y-2">
                {currentQ.options.map((option, idx) => {
                  let buttonStyle = isDarkMode
                    ? "bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800";

                  if (selectedOption === idx) {
                    buttonStyle = isDarkMode
                      ? "bg-indigo-600/20 border-indigo-500 text-white font-medium"
                      : "bg-indigo-50 border-indigo-500 text-indigo-900 font-medium";
                  }

                  if (isAnswered) {
                    if (idx === currentQ.correctAnswerIndex) {
                      buttonStyle = isDarkMode
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold"
                        : "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                    } else if (selectedOption === idx && idx !== currentQ.correctAnswerIndex) {
                      buttonStyle = isDarkMode
                        ? "bg-rose-500/20 border-rose-500 text-rose-200"
                        : "bg-rose-50 border-rose-500 text-rose-900";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${buttonStyle}`}
                    >
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 font-mono text-[10px] ${
                        isDarkMode ? 'border-slate-700' : 'border-slate-300'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{option}</span>

                      {isAnswered && idx === currentQ.correctAnswerIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && selectedOption === idx && idx !== currentQ.correctAnswerIndex && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation section after answering */}
              {isAnswered && (
                <div className={`p-3.5 border rounded-xl space-y-2 animate-fadeIn text-xs ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-indigo-600">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Giải thích chi tiết:</span>
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>

                  {currentQ.seniorTip && (
                    <div className={`p-2 border rounded-lg text-[11px] mt-2 ${
                      isDarkMode 
                        ? 'bg-indigo-950/40 border-indigo-800/50 text-indigo-300' 
                        : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                    }`}>
                      💡 <strong>Mẹo Phỏng Vấn Senior:</strong> {currentQ.seniorTip}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className={`flex items-center justify-end gap-2 pt-2 border-t ${
              isDarkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              {!isAnswered ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleConfirmAnswer}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-xs rounded-xl transition-all shadow-md"
                >
                  Xác Nhận Đáp Án
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Câu Tiếp Theo →' : 'Xem Kết Quả Tổng Kết'}</span>
                </button>
              )}
            </div>
          </>
        ) : (
          /* Finished Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center p-0.5 shadow-xl">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                isDarkMode ? 'bg-slate-950' : 'bg-white'
              }`}>
                <Award className="w-8 h-8 text-amber-500" />
              </div>
            </div>

            <div>
              <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Hoàn Thành Bài Kiểm Tra!</h4>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Kết quả đánh giá trình độ của bạn</p>
            </div>

            <div className={`p-4 border rounded-2xl inline-block px-8 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-3xl font-extrabold text-indigo-600 font-mono">
                {score} / {questions.length}
              </div>
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {score === questions.length ? '🌟 Hoàn Hảo! Bạn đạt chuẩn Senior QA!' : '👍 Khá tốt! Hãy đọc thêm các mẹo phỏng vấn.'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className={`px-4 py-2 border rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm Lại</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition-all shadow-md"
              >
                Trở Về Bài Học
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
