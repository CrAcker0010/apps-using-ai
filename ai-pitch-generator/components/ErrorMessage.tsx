
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="w-full max-w-2xl mx-auto bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
    <strong className="font-bold">Oops! </strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

export default ErrorMessage;
