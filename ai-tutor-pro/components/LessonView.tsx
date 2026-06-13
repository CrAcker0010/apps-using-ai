import React, { useState, useEffect, useCallback } from 'react';
import type { Subject, Topic, Question, Resources } from '../types';
import { generateLessonContent, generateQuiz, reexplainConcept } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import Quiz from './Quiz';
import { parseMarkdown } from '../utils/markdownParser';
import { BookOpenIcon, VideoCameraIcon } from './icons/Icons';


interface LessonViewProps {
  subject: Subject;
  topic: Topic;
  onComplete: () => void;
  updateProgress: (subjectId: string, topicId: string, score: number) => void;
}

const LessonView: React.FC<LessonViewProps> = ({ subject, topic, onComplete, updateProgress }) => {
  const [lessonData, setLessonData] = useState<{ content: string; resources: Resources } | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReexplaining, setIsReexplaining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'lesson' | 'quiz' | 'results'>('lesson');
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const fetchLesson = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [data, questions] = await Promise.all([
        generateLessonContent(subject.name, topic.name),
        generateQuiz(subject.name, topic.name),
      ]);
      setLessonData(data);
      setQuizQuestions(questions);
    } catch (e) {
      setError('Failed to load lesson content. Please go back and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [subject.name, topic.name]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  const handleReexplain = async () => {
    if (!lessonData) return;
    setIsReexplaining(true);
    try {
        const newContent = await reexplainConcept(lessonData.content);
        setLessonData(prevData => prevData ? { ...prevData, content: newContent } : null);
    } catch (e) {
        // Maybe show a small toast error here in a real app
        console.error("Failed to re-explain", e);
    } finally {
        setIsReexplaining(false);
    }
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    updateProgress(subject.id, topic.id, score);
    setView('results');
  };
  
  const formattedContent = lessonData ? parseMarkdown(lessonData.content) : '';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <LoadingSpinner />
        <p className="mt-4 text-slate-500 dark:text-slate-400">Preparing your lesson on {topic.name}...</p>
      </div>
    );
  }

  if (error || !lessonData) {
    return <div className="text-center text-red-500 p-10">{error || 'Lesson data could not be loaded.'}</div>;
  }
  
  if (view === 'quiz') {
    return <Quiz questions={quizQuestions} onQuizComplete={handleQuizComplete} />;
  }

  if (view === 'results') {
    const passed = quizScore !== null && quizScore >= 70;
    return (
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Quiz Results</h2>
            <p className={`text-5xl font-bold mb-4 ${passed ? 'text-green-500' : 'text-red-500'}`}>
                {quizScore}%
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                {passed ? "Great job! You've mastered this topic." : "Good effort! You might want to review the lesson again."}
            </p>
            <button
                onClick={onComplete}
                className="w-full sm:w-auto bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
            >
                Back to Learning Path
            </button>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <article className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: formattedContent }} />

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Further Learning Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="flex items-center text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">
                        <BookOpenIcon className="w-6 h-6 mr-3 text-indigo-500"/>
                        Recommended Books
                    </h4>
                    <ul className="space-y-3">
                        {lessonData.resources.books.map((book, index) => (
                            <li key={index} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{book.title}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">by {book.author}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="flex items-center text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">
                        <VideoCameraIcon className="w-6 h-6 mr-3 text-indigo-500"/>
                        Recommended Videos
                    </h4>
                    <ul className="space-y-3">
                        {lessonData.resources.videos.map((video, index) => (
                           <li key={index} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <a href={video.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                    {video.title}
                                </a>
                           </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
            <button
                onClick={handleReexplain}
                disabled={isReexplaining}
                className="flex-1 w-full sm:w-auto justify-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900"
            >
                {isReexplaining ? <LoadingSpinner /> : 'Explain It Differently'}
            </button>
            <button
                onClick={() => setView('quiz')}
                className="flex-1 w-full sm:w-auto justify-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
                Start Quiz
            </button>
        </div>
    </div>
  );
};

export default LessonView;