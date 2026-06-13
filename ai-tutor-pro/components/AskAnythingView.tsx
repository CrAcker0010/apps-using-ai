import React, { useState, useEffect, useCallback } from 'react';
import type { Resources } from '../types';
import { generateExplanationForTopic, reexplainConcept } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { parseMarkdown } from '../utils/markdownParser';
import { BookOpenIcon, VideoCameraIcon } from './icons/Icons';

interface AskAnythingViewProps {
  topicName: string;
}

const AskAnythingView: React.FC<AskAnythingViewProps> = ({ topicName }) => {
  const [lessonData, setLessonData] = useState<{ content: string; resources: Resources } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReexplaining, setIsReexplaining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await generateExplanationForTopic(topicName);
      setLessonData(data);
    } catch (e) {
      setError('Failed to load the explanation. Please go back and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [topicName]);

  useEffect(() => {
    if (topicName) {
      fetchExplanation();
    }
  }, [fetchExplanation, topicName]);

  const handleReexplain = async () => {
    if (!lessonData) return;
    setIsReexplaining(true);
    try {
        const newContent = await reexplainConcept(lessonData.content);
        setLessonData(prevData => prevData ? { ...prevData, content: newContent } : null);
    } catch (e) {
        console.error("Failed to re-explain", e);
    } finally {
        setIsReexplaining(false);
    }
  };
  
  const formattedContent = lessonData ? parseMarkdown(lessonData.content) : '';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <LoadingSpinner />
        <p className="mt-4 text-slate-500 dark:text-slate-400">Generating your explanation for {topicName}...</p>
      </div>
    );
  }

  if (error || !lessonData) {
    return <div className="text-center text-red-500 p-10">{error || 'Lesson data could not be loaded.'}</div>;
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
        
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
                onClick={handleReexplain}
                disabled={isReexplaining}
                className="w-full justify-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900"
            >
                {isReexplaining ? <LoadingSpinner /> : 'Explain It Differently'}
            </button>
        </div>
    </div>
  );
};

export default AskAnythingView;