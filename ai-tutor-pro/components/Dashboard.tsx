import React, { useState, useEffect } from 'react';
import type { Subject, Topic, TopicStatus } from '../types';
import { generateLearningPath } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { LockClosedIcon, CheckIcon } from './icons/Icons';

interface DashboardProps {
  subject: Subject;
  progress: { [topicId: string]: { completed: boolean; quizScore: number | null } };
  onTopicSelect: (topic: Topic) => void;
  getTopicStatus: (subjectId: string, topicId: string, topicIndex: number) => TopicStatus;
  initialTopics?: Topic[];
}

const Dashboard: React.FC<DashboardProps> = ({ subject, onTopicSelect, getTopicStatus, initialTopics }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (initialTopics) {
          setTopics(initialTopics);
        } else {
          const topicNames = await generateLearningPath(subject.name);
          const topicObjects = topicNames.map((name, index) => ({ id: `topic-${index}`, name }));
          setTopics(topicObjects);
        }
      } catch (e) {
        setError('Failed to generate a learning path. Please try again later.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPath();
  }, [subject, initialTopics]);
  
  const activeTopicIndex = topics.findIndex((topic, index) => getTopicStatus(subject.id, topic.id, index).status === 'unlocked');


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <LoadingSpinner />
        <p className="mt-4 text-slate-500 dark:text-slate-400">Generating your personalized learning path...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2 text-center text-slate-900 dark:text-white">Your {subject.name} Roadmap</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-12">Here is your personalized path to mastering {subject.name}.</p>
      
      <div className="relative max-w-3xl mx-auto">
        {/* The main timeline bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-full bg-slate-200 dark:bg-slate-800 rounded"></div>

        {topics.map((topic, index) => {
          const { status } = getTopicStatus(subject.id, topic.id, index);
          const isCompleted = status === 'completed';
          const isNext = status === 'unlocked' && index === activeTopicIndex;
          
          const NodeIcon = () => {
              if (isCompleted) return <CheckIcon className="w-4 h-4 text-white" />;
              return <div className="w-2 h-2 rounded-full bg-indigo-500"></div>;
          };
          
          const nodeColor = isCompleted ? 'bg-green-500' : 'bg-indigo-500';

          return (
            <div key={topic.id} className="relative mb-10 flex items-center justify-center">
              {/* The node on the timeline */}
              <div className={`absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center z-10 border-4 border-gray-50 dark:border-black ${nodeColor}`}>
                <NodeIcon />
              </div>

              {/* The card */}
              <div className={`w-[calc(50%-3rem)] ${index % 2 === 0 ? 'ml-[calc(50%+3rem)] text-left' : 'mr-[calc(50%+3rem)] text-right'}`}>
                 <button
                    onClick={() => onTopicSelect(topic)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-indigo-500 dark:hover:border-indigo-500 transform hover:-translate-y-1
                      ${isNext ? 'border-indigo-500 pulse-glow' : ''}
                    `}
                  >
                    <p className={`text-xs font-semibold uppercase tracking-wider ${isCompleted ? 'text-green-500' : 'text-indigo-500'}`}>
                      {`Step ${index + 1}`}
                    </p>
                    <h3 className={`font-semibold mt-1 text-slate-900 dark:text-white`}>
                      {topic.name}
                    </h3>
                  </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;