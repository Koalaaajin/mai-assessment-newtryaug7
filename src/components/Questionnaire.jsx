import React, { useState } from 'react';
import questions from '../data/questions';

const QUESTIONS_PER_PAGE = 10;

/**
 * Questionnaire component renders the paginated MAI survey. Users
 * progress through 10 questions per page (with the final page
 * containing the remaining questions). After the questions are
 * completed, an information form appears to collect the student's
 * identifying details. Once submitted, the `onComplete` callback is
 * invoked with the answers and user info.
 *
 * Props:
 * - onComplete: (answers: number[], info: object) => void
 */
function Questionnaire({ onComplete }) {
  const totalQuestionPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  // currentStep ranges from 0..totalQuestionPages for question pages, and equal to totalQuestionPages for the info form
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null));
  const [info, setInfo] = useState({ name: '', age: '', school: '', grade: '' });

  const handleAnswer = (questionId, value) => {
    const index = questions.findIndex(q => q.id === questionId);
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
  };

  const handleNext = () => {
    // Do not allow advancing past the info form.
    setCurrentStep(prev => Math.min(prev + 1, totalQuestionPages));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleInfoChange = (field, value) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass results to parent component
    onComplete(answers, info);
  };

  // Determine which questions appear on the current step
  const startIndex = currentStep * QUESTIONS_PER_PAGE;
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);

  // Check whether the current page is fully answered
  const isPageAnswered = currentQuestions.every((q) => answers[q.id - 1] !== null);

  return (
    <div className="max-w-3xl mx-auto p-4">
      {currentStep < totalQuestionPages ? (
        <div>
          <div className="mb-4 flex justify-between items-center text-sm">
            <span>第 {startIndex + 1}–{endIndex} 题，共 52 题</span>
            <span>页面 {currentStep + 1} / {totalQuestionPages}</span>
          </div>
          <div className="space-y-4">
            {currentQuestions.map((q) => (
              <div key={q.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <p className="font-medium mb-2">
                  {q.id}. {q.zh}
                </p>
                <p className="text-sm mb-3">{q.text}</p>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded border ${answers[q.id - 1] === 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}
                    onClick={() => handleAnswer(q.id, 1)}
                  >
                    True（是）
                  </button>
                    <button
                    type="button"
                    className={`px-4 py-2 rounded border ${answers[q.id - 1] === 0 ? 'bg-blue-600 text-white' : 'bg-white'}`}
                    onClick={() => handleAnswer(q.id, 0)}
                  >
                    False（否）
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                上一页
              </button>
            )}
            <div className="flex-1"></div>
            <button
              type="button"
              onClick={handleNext}
              disabled={!isPageAnswered}
              className={`px-4 py-2 rounded ${isPageAnswered ? 'bg-blue-600 text-white' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              {currentStep + 1 === totalQuestionPages ? '去填写信息' : '下一页'}
            </button>
          </div>
        </div>
      ) : (
        // Info form
        <form onSubmit={handleSubmit} className="bg-white shadow-sm p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">填写个人信息</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">姓名</label>
            <input
              type="text"
              value={info.name}
              onChange={(e) => handleInfoChange('name', e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">年龄</label>
            <input
              type="number"
              value={info.age}
              onChange={(e) => handleInfoChange('age', e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">学校</label>
            <input
              type="text"
              value={info.school}
              onChange={(e) => handleInfoChange('school', e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">年级</label>
            <input
              type="text"
              value={info.grade}
              onChange={(e) => handleInfoChange('grade', e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handlePrev}
              className="mr-4 px-4 py-2 bg-gray-200 rounded"
            >
              上一页
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              查看结果
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Questionnaire;