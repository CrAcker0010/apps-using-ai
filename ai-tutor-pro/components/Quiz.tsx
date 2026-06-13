import React, { useState } from 'react';
import type { Question } from '../types';

interface QuizProps {
  questions: Question[];
  onQuizComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  
  const handleAnswerSelect = (option: string) => {
    if (showFeedback) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(newAnswers);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer) {
      setShowFeedback(true);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished
      const score = selectedAnswers.reduce((acc, answer, index) => {
        return answer === questions[index].correctAnswer ? acc + 1 : acc;
      }, 0);
      onQuizComplete(Math.round((score / questions.length) * 100));
    }
  };

  const getButtonClass = (option: string) => {
    if (!showFeedback) {
      return selectedAnswer === option 
        ? 'bg-indigo-200 dark:bg-indigo-900/80 border-indigo-500'
        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700';
    }
    // With feedback
    if (option === currentQuestion.correctAnswer) {
      return 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-300';
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
        return 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-300';
    }
    return 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-70';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-lg shadow-xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          {currentQuestion.question}
        </h2>
      </div>
      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={showFeedback}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${getButtonClass(option)}`}
          >
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>
      <div className="mt-8">
        {!showFeedback ? (
          <button
            onClick={handleCheckAnswer}
            disabled={!selectedAnswer}
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;