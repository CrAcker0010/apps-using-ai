import React, { useState, useMemo } from 'react';
import { Subject, Topic, Progress, View } from './types';
import useProgress from './hooks/useProgress';
import SubjectSelector from './components/SubjectSelector';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
import Header from './components/Header';
import DocToNotes from './components/DocToNotes';
import AskAnythingView from './components/AskAnythingView';
import { SparklesIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.SubjectSelection);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [customTopics, setCustomTopics] = useState<Topic[] | null>(null);
  const { progress, updateProgress, getTopicStatus } = useProgress();

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setView(View.Dashboard);
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setView(View.Lesson);
  };
  
  const handleAskAnything = (query: string) => {
    setCustomQuery(query);
    setView(View.AskAnything);
  };

  const handleGenerateCustomPath = (goal: string, pathTopics: string[]) => {
    const customSubject: Subject = {
      id: 'custom-path',
      name: 'Your Custom Path',
      description: goal,
      icon: SparklesIcon
    };
    const topicObjects = pathTopics.map((name, index) => ({ id: `topic-${index}`, name }));
    setSelectedSubject(customSubject);
    setCustomTopics(topicObjects);
    setView(View.Dashboard);
  };

  const handleBackToDashboard = () => {
    setView(View.Dashboard);
    setSelectedTopic(null);
  };
  
  const handleBackToSubjects = () => {
    setView(View.SubjectSelection);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setCustomQuery('');
    setCustomTopics(null);
  }

  const handleNavigateToDocToNotes = () => {
    setView(View.DocToNotes);
    setSelectedSubject(null);
    setSelectedTopic(null);
  }

  const currentProgress = useMemo(() => {
    return selectedSubject ? progress[selectedSubject.id] || {} : {};
  }, [progress, selectedSubject]);

  const renderContent = () => {
    switch (view) {
      case View.SubjectSelection:
        return <SubjectSelector onSubjectSelect={handleSubjectSelect} onAskQuestion={handleAskAnything} onGeneratePath={handleGenerateCustomPath} />;
      case View.Dashboard:
        if (!selectedSubject) return <SubjectSelector onSubjectSelect={handleSubjectSelect} onAskQuestion={handleAskAnything} onGeneratePath={handleGenerateCustomPath}/>;
        return (
          <Dashboard
            subject={selectedSubject}
            progress={currentProgress}
            onTopicSelect={handleTopicSelect}
            getTopicStatus={getTopicStatus}
            initialTopics={customTopics || undefined}
          />
        );
      case View.Lesson:
        if (!selectedSubject || !selectedTopic) return <SubjectSelector onSubjectSelect={handleSubjectSelect} onAskQuestion={handleAskAnything} onGeneratePath={handleGenerateCustomPath}/>;
        return (
          <LessonView
            subject={selectedSubject}
            topic={selectedTopic}
            onComplete={handleBackToDashboard}
            updateProgress={updateProgress}
          />
        );
       case View.AskAnything:
        return <AskAnythingView topicName={customQuery} />;
      case View.DocToNotes:
        return <DocToNotes />;
      default:
        return <SubjectSelector onSubjectSelect={handleSubjectSelect} onAskQuestion={handleAskAnything} onGeneratePath={handleGenerateCustomPath}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-500">
      <Header 
        subject={selectedSubject}
        topic={selectedTopic}
        view={view}
        onBackToDashboard={handleBackToDashboard}
        onBackToSubjects={handleBackToSubjects}
        onNavigateToDocToNotes={handleNavigateToDocToNotes}
        customQuery={customQuery}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;