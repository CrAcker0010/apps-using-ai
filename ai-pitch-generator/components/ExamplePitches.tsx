
import React from 'react';

interface ExamplePitchesProps {
  examples: string[];
  onExampleClick: (example: string) => void;
}

const ExamplePitches: React.FC<ExamplePitchesProps> = ({ examples, onExampleClick }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h3 className="text-center text-gray-400 font-semibold mb-4">Or try one of these examples:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onExampleClick(example)}
            className="text-left p-3 bg-gray-800/80 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-indigo-500 transition-all duration-200 text-gray-300 text-sm"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePitches;
