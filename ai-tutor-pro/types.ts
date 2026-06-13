// Fix: Import `ComponentType` to resolve the "Cannot find namespace 'React'" error.
import type { ComponentType } from 'react';

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

export interface Topic {
  id: string;
  name: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  questions: Question[];
}

export interface Lesson {
  content: string;
  quiz: Quiz;
  resources: Resources;
}

export interface Progress {
  [subjectId: string]: {
    [topicId: string]: {
      completed: boolean;
      quizScore: number | null;
    };
  };
}

export interface TopicStatus {
  status: 'locked' | 'unlocked' | 'completed';
  score: number | null;
}

export enum View {
  SubjectSelection,
  Dashboard,
  Lesson,
  DocToNotes,
  AskAnything,
}

export interface BookResource {
  title: string;
  author: string;
}

export interface VideoResource {
  title: string;
  url: string;
}

export interface Resources {
  books: BookResource[];
  videos: VideoResource[];
}