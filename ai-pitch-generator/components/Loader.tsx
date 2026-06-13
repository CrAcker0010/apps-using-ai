
import React from 'react';

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
    <h2 className="text-xl font-semibold text-white">Generating Your Pitch...</h2>
    <p className="text-gray-400">The AI is warming up its creativity circuits. This might take a moment.</p>
  </div>
);

export default Loader;
