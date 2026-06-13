import React from 'react';
import type { Subject, Topic } from '../types';
import { View } from '../types';
import { BookOpenIcon, DocumentTextIcon, HomeIcon } from './icons/Icons';

interface HeaderProps {
  subject: Subject | null;
  topic: Topic | null;
  view: View;
  onBackToDashboard: () => void;
  onBackToSubjects: () => void;
  onNavigateToDocToNotes: () => void;
  customQuery?: string;
}

const Header: React.FC<HeaderProps> = ({ subject, view, topic, onBackToDashboard, onBackToSubjects, onNavigateToDocToNotes, customQuery }) => {
  const renderBreadcrumbs = () => {
    if (view === View.SubjectSelection) {
      return <span className="font-semibold text-lg">Select a Subject</span>;
    }
    
    const subjectsButton = (
        <button onClick={onBackToSubjects} className="flex items-center hover:text-indigo-400 transition-colors">
            <HomeIcon className="w-5 h-5 mr-1" />
            Subjects
        </button>
    );

    if (view === View.DocToNotes) {
      return (
        <div className="flex items-center space-x-2 text-sm sm:text-base">
            {subjectsButton}
            <span className="text-slate-400 dark:text-slate-500">/</span>
            <span className="font-semibold text-indigo-500 dark:text-indigo-400">Doc to Notes</span>
        </div>
      );
    }
    
    if (view === View.AskAnything) {
        return (
            <div className="flex items-center space-x-2 text-sm sm:text-base">
                {subjectsButton}
                <span className="text-slate-400 dark:text-slate-500">/</span>
                <span className="font-semibold text-indigo-500 dark:text-indigo-400 truncate max-w-[150px] sm:max-w-xs">{customQuery}</span>
            </div>
        );
    }

    return (
      <div className="flex items-center space-x-2 text-sm sm:text-base">
        {subjectsButton}
        {subject && (
            <>
                <span className="text-slate-400 dark:text-slate-500">/</span>
                <button
                    onClick={view === View.Lesson ? onBackToDashboard : undefined}
                    className={`${view === View.Dashboard ? 'font-semibold text-indigo-500 dark:text-indigo-400' : 'hover:text-indigo-400 transition-colors'}`}
                    disabled={view === View.Dashboard}
                >
                    {subject.name}
                </button>
            </>
        )}
        {topic && view === View.Lesson && (
            <>
                <span className="text-slate-400 dark:text-slate-500">/</span>
                <span className="font-semibold text-indigo-500 dark:text-indigo-400 truncate max-w-[150px] sm:max-w-xs">{topic.name}</span>
            </>
        )}
      </div>
    );
  };
    
  return (
    <header className="bg-gray-50/80 dark:bg-black/80 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-indigo-500" />
            <h1 className="ml-3 text-xl font-bold text-slate-800 dark:text-slate-200 hidden sm:block">
              AI Tutor Pro
            </h1>
          </div>
          <div className="flex-1 flex justify-center px-4">
            {renderBreadcrumbs()}
          </div>
          <div className="flex items-center">
            <button
              onClick={onNavigateToDocToNotes}
              className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Document to Notes converter"
            >
                <DocumentTextIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Doc to Notes</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;