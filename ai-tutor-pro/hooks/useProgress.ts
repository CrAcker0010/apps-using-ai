
import { useState, useCallback, useEffect } from 'react';
import { Progress, TopicStatus } from '../types';

const PROGRESS_STORAGE_KEY = 'aiTutorProgress';

const useProgress = () => {
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage", error);
    }
  }, []);

  const updateProgress = useCallback((subjectId: string, topicId: string, score: number) => {
    setProgress(prevProgress => {
      const newProgress = {
        ...prevProgress,
        [subjectId]: {
          ...prevProgress[subjectId],
          [topicId]: {
            completed: true,
            quizScore: score,
          },
        },
      };
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(newProgress));
      } catch (error) {
        console.error("Failed to save progress to localStorage", error);
      }
      return newProgress;
    });
  }, []);
  
  const getTopicStatus = useCallback((subjectId: string, topicId: string, topicIndex: number): TopicStatus => {
    const subjectProgress = progress[subjectId];

    // Check current topic status
    const currentTopicProgress = subjectProgress?.[topicId];
    if (currentTopicProgress?.completed) {
      return { status: 'completed', score: currentTopicProgress.quizScore };
    }
    
    // All topics are now unlocked by default
    return { status: 'unlocked', score: null };

  }, [progress]);

  return { progress, updateProgress, getTopicStatus };
};

export default useProgress;