
import React, { useState, useCallback } from 'react';
import type { Pitch } from './types';
import { generatePitch } from './services/geminiService';
import Header from './components/Header';
import PitchForm from './components/PitchForm';
import PitchDisplay from './components/PitchDisplay';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import ExamplePitches from './components/ExamplePitches';
import { EXAMPLE_IDEAS } from './constants';

const App: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePitch = useCallback(async () => {
    if (!idea.trim()) {
      setError('Please enter a business idea.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPitch(null);

    try {
      const generatedPitch = await generatePitch(idea);
      setPitch(generatedPitch);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [idea]);

  const handleReset = () => {
    setIdea('');
    setPitch(null);
    setError(null);
    setIsLoading(false);
  };
  
  const handleExampleClick = (exampleIdea: string) => {
    setIdea(exampleIdea);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          {!pitch && !isLoading && (
            <>
              <PitchForm
                idea={idea}
                setIdea={setIdea}
                onGenerate={handleGeneratePitch}
                isLoading={isLoading}
              />
              <ExamplePitches examples={EXAMPLE_IDEAS} onExampleClick={handleExampleClick} />
            </>
          )}

          {isLoading && <Loader />}

          {error && !isLoading && (
            <div className="flex flex-col items-center space-y-4">
              <ErrorMessage message={error} />
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {pitch && !isLoading && (
            <PitchDisplay pitch={pitch} onReset={handleReset} />
          )}
        </main>
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>THANKS FOR VISITING OUR WEBSITE VISIT AGAIN</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
