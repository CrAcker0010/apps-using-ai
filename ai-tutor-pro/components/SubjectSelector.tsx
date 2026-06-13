import React, { useState } from 'react';
import type { Subject } from '../types';
import { CalculatorIcon, CodeBracketIcon, DataStructureIcon, BrainIcon, ThermodynamicsIcon, ChipIcon, MatrixIcon, DatabaseIcon, SparklesIcon } from './icons/Icons';
import { generateCustomLearningPath } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const subjects: Subject[] = [
  {
    id: 'calculus',
    name: 'Calculus',
    description: 'Master derivatives, integrals, and the fundamental theorems of calculus.',
    icon: CalculatorIcon,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Learn the language of the web, from variables to asynchronous programming.',
    icon: CodeBracketIcon,
  },
  {
    id: 'data-structures',
    name: 'Data Structures & Algorithms',
    description: 'Understand fundamental data structures and algorithmic complexity.',
    icon: DataStructureIcon,
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    description: 'Explore core concepts of AI, from regression to neural networks.',
    icon: BrainIcon,
  },
  {
    id: 'thermodynamics',
    name: 'Thermodynamics',
    description: 'Grasp the laws of energy, heat, work, and entropy in physical systems.',
    icon: ThermodynamicsIcon,
  },
  {
    id: 'digital-logic',
    name: 'Digital Logic Design',
    description: 'Learn the building blocks of digital computers, from logic gates to circuits.',
    icon: ChipIcon,
  },
  {
    id: 'linear-algebra',
    name: 'Linear Algebra',
    description: 'Study vectors, matrices, and linear transformations.',
    icon: MatrixIcon,
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'Learn about relational models, SQL, and database design principles.',
    icon: DatabaseIcon,
  },
];

interface SubjectSelectorProps {
  onSubjectSelect: (subject: Subject) => void;
  onAskQuestion: (query: string) => void;
  onGeneratePath: (goal: string, topics: string[]) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ onSubjectSelect, onAskQuestion, onGeneratePath }) => {
  const [askQuery, setAskQuery] = useState('');
  const [pathGoal, setPathGoal] = useState('');
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (askQuery.trim()) {
      onAskQuestion(askQuery.trim());
    }
  };

  const handlePathSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pathGoal.trim()) return;
    
    setIsGeneratingPath(true);
    setError(null);
    try {
      const topics = await generateCustomLearningPath(pathGoal.trim());
      onGeneratePath(pathGoal.trim(), topics);
    } catch (err) {
      setError('Sorry, we couldn\'t generate a path for that goal. Please try a different one.');
      console.error(err);
    } finally {
      setIsGeneratingPath(false);
    }
  };


  return (
    <div>
       <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Welcome to AI Tutor Pro
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
                Choose a pre-defined subject or create your own learning path.
            </p>
        </div>

        <div className="mb-12 p-8 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Ask a question */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Ask a Question</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Have a specific topic in mind? Get a quick lesson on anything.</p>
                    <form onSubmit={handleAskSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={askQuery}
                            onChange={(e) => setAskQuery(e.target.value)}
                            placeholder="e.g., 'What are React Hooks?'"
                            className="flex-grow bg-slate-100 dark:bg-slate-800 rounded-md border-slate-300 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-slate-400">
                            Explain
                        </button>
                    </form>
                </div>

                {/* Generate custom path */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                      <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500"/>
                      Generate a Custom Path
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Describe your learning goal, and we'll create a personalized roadmap for you.</p>
                    <form onSubmit={handlePathSubmit}>
                        <textarea
                            value={pathGoal}
                            onChange={(e) => setPathGoal(e.target.value)}
                            placeholder="e.g., 'Learn the basics of web development to build a personal blog'"
                            className="w-full bg-slate-100 dark:bg-slate-800 rounded-md border-slate-300 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                            rows={2}
                        />
                        <button type="submit" disabled={isGeneratingPath} className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-slate-400">
                           {isGeneratingPath ? <LoadingSpinner /> : 'Create My Path'}
                        </button>
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                    </form>
                </div>
            </div>
        </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => onSubjectSelect(subject)}
            className="group relative rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-left shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-500 dark:hover:border-indigo-500"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                <subject.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{subject.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subject.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;