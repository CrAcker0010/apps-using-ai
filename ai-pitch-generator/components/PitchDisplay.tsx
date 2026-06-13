
import React, { useState } from 'react';
import type { Pitch } from '../types';

interface PitchDisplayProps {
  pitch: Pitch;
  onReset: () => void;
}

interface PitchSectionProps {
    title: string;
    content: string;
    icon: React.ReactNode;
}

const PitchSection: React.FC<PitchSectionProps> = ({ title, content, icon }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center mb-3">
            <div className="w-8 h-8 mr-4 text-indigo-400">{icon}</div>
            <h3 className="text-xl font-bold text-gray-100">{title}</h3>
        </div>
        <p className="text-gray-300 leading-relaxed">{content}</p>
    </div>
);

const PitchDisplay: React.FC<PitchDisplayProps> = ({ pitch, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const pitchText = Object.entries(pitch)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:\n${value}`)
      .join('\n\n');
    navigator.clipboard.writeText(pitchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const icons: { [key in keyof Pitch]: React.ReactNode } = {
      elevatorPitch: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125H20.25M12 2.25v15m0 0l-3.75-3.75M12 17.25l3.75-3.75" /></svg>,
      problem: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L6.75 11.25m3.105-3.105l-4.773 4.773m0 0a3.375 3.375 0 004.774 4.774l2.06-2.06M15 6.75l2.06-2.06a3.375 3.375 0 00-4.773-4.773l-4.774 4.774" /></svg>,
      solution: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311l-3.75 0M12 12.75l-2.625 2.625M12 12.75l2.625 2.625M12 12.75v2.25m0 0l-2.625 2.625M12 15l2.625 2.625m0-2.625l-2.625 2.625M12 3.75l-2.625 2.625M12 3.75l2.625 2.625M12 3.75v2.25m0 0l-2.625 2.625M12 6l2.625 2.625m0-2.625l-2.625 2.625" /></svg>,
      targetMarket: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
      usp: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
      monetization: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 01.75.75v.75m0 0a.75.75 0 01-.75.75h-.75m0 0a.75.75 0 01.75.75v.75m0 0a.75.75 0 01-.75.75h-.75m9-6.75v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 01-.75-.75v-.75c0-.414.336-.75.75-.75h.75a.75.75 0 01.75.75z" /></svg>,
  };

  return (
    <div className="w-full animate-[fadeIn_0.5s_ease-in-out]">
        <div className="bg-gray-800 rounded-xl p-6 mb-6 text-center">
            <h2 className="text-2xl font-bold text-indigo-400">Your AI-Generated Pitch</h2>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PitchSection title="Elevator Pitch" content={pitch.elevatorPitch} icon={icons.elevatorPitch} />
        <PitchSection title="The Problem" content={pitch.problem} icon={icons.problem} />
        <PitchSection title="The Solution" content={pitch.solution} icon={icons.solution} />
        <PitchSection title="Target Market" content={pitch.targetMarket} icon={icons.targetMarket} />
        <PitchSection title="Unique Selling Proposition" content={pitch.usp} icon={icons.usp} />
        <PitchSection title="Monetization Strategy" content={pitch.monetization} icon={icons.monetization} />
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={handleCopy}
          className="w-full sm:w-auto flex justify-center items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition-colors"
        >
          {copied ? (
            <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Copied!
            </>
          ) : (
            <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Copy to Clipboard
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex justify-center items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a9 9 0 0114.13-4.52M20 15a9 9 0 01-14.13 4.52" /></svg>
          Generate Another
        </button>
      </div>
    </div>
  );
};

export default PitchDisplay;
