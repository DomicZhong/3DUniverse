import { useState } from 'react';
import { quizQuestions } from '../../data/quiz';
import { useStore } from '../../store/useStore';

export default function Quiz() {
  const { showQuiz, setShowQuiz, quizScore, setQuizScore, currentQuestionIndex, setCurrentQuestionIndex } = useStore();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!showQuiz) return null;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowExplanation(true);

    if (index === currentQuestion.correctAnswer) {
      setQuizScore(quizScore + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);

    if (isLastQuestion) {
      setShowQuiz(false);
      setCurrentQuestionIndex(0);
      setQuizScore(0);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleClose = () => {
    setShowQuiz(false);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-gray-700">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-yellow-400">🎮 太阳系知识问答</h2>
            <p className="text-sm text-gray-400 mt-1">
              第 {currentQuestionIndex + 1} 题 / 共 {quizQuestions.length} 题
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>

        {/* 问题 */}
        <div className="mb-6">
          <p className="text-xl text-white font-semibold mb-4">{currentQuestion.question}</p>
        </div>

        {/* 选项 */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            let className = 'bg-gray-800 hover:bg-gray-700';

            if (showExplanation) {
              if (index === currentQuestion.correctAnswer) {
                className = 'bg-green-600';
              } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                className = 'bg-red-600';
              }
            }

            return (
              <button
                key={index}
                onClick={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  showExplanation ? 'opacity-100' : 'opacity-100'
                } ${className}`}
              >
                <span className="text-white font-medium">{option}</span>
              </button>
            );
          })}
        </div>

        {/* 解释 */}
        {showExplanation && (
          <div className="bg-blue-900/30 rounded-xl p-4 mb-6 border border-blue-700/30">
            <p className="text-blue-300 text-sm leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* 按钮 */}
        {showExplanation && (
          <div className="flex gap-3">
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-xl font-semibold text-white transition-colors"
            >
              {isLastQuestion ? '查看结果' : '下一题'}
            </button>
            {!isLastQuestion && (
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold text-white transition-colors"
              >
                重新开始
              </button>
            )}
          </div>
        )}

        {/* 结果显示 */}
        {showExplanation && isLastQuestion && (
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-700/30">
              <p className="text-3xl font-bold text-yellow-400 mb-2">🎉 测试完成！</p>
              <p className="text-white text-xl mb-1">
                你的得分：{quizScore} / {quizQuestions.length}
              </p>
              <p className="text-gray-400">
                正确率：{Math.round((quizScore / quizQuestions.length) * 100)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
