import React, { useState, useRef } from 'react';
import { generateNotesFromDocument } from '../services/geminiService';
import { parseMarkdown } from '../utils/markdownParser';
import LoadingSpinner from './LoadingSpinner';
import { ArrowUpTrayIcon, ClipboardIcon } from './icons/Icons';
import * as pdfjsLib from 'pdfjs-dist';

// Configure the PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = (window as any).pdfjsWorker;

const DocToNotes: React.FC = () => {
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [notes, setNotes] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setNotes(null);
        setError(null);
        setFileContent(null);
        
        if (file.type === 'text/plain' || file.name.endsWith('.md')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileContent(e.target?.result as string);
            };
            reader.onerror = () => {
                setError('Failed to read the file.');
                setFileName(null);
            };
            reader.readAsText(file);
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            setIsParsing(true);
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    if (!arrayBuffer) throw new Error("Could not read PDF file.");
                    
                    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                    const pdf = await loadingTask.promise;
                    let fullText = '';

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
                        fullText += pageText + '\n';
                    }
                    setFileContent(fullText);
                } catch (err) {
                    console.error("Error parsing PDF:", err);
                    setError('Failed to parse the PDF file. It may be corrupted or protected.');
                    setFileName(null);
                } finally {
                    setIsParsing(false);
                }
            };
            reader.onerror = () => {
                setIsParsing(false);
                setError('Failed to read the PDF file.');
                setFileName(null);
            };
            reader.readAsArrayBuffer(file);
        } else {
            setError('Please upload a .txt, .md, or .pdf file.');
            setFileName(null);
        }
    };

    const handleConvert = async () => {
        if (!fileContent) return;
        setIsLoading(true);
        setError(null);
        setNotes(null);
        try {
            const generatedNotes = await generateNotesFromDocument(fileContent);
            setNotes(generatedNotes);
        } catch (e) {
            setError('Failed to generate notes. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!notes) return;
        // A simple way to copy text without formatting
        const plainText = notes.replace(/<[^>]*>?/gm, '');
        navigator.clipboard.writeText(plainText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                 <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Document to Notes Converter
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
                    Upload a text, markdown, or PDF file to instantly generate study notes.
                </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md mb-8">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".txt,.md,.pdf"
                    className="hidden"
                    disabled={isParsing || isLoading}
                />
                <button
                    onClick={triggerFileSelect}
                    disabled={isParsing || isLoading}
                    className="w-full flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-center cursor-pointer hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors disabled:cursor-wait"
                >
                    <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-slate-400" />
                    <span className="mt-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {isParsing ? `Parsing ${fileName}...` : (fileName || "Click to upload a document")}
                    </span>
                     <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                       TXT, MD, or PDF files only
                    </span>
                </button>
                
                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                
                <button
                    onClick={handleConvert}
                    disabled={!fileContent || isLoading || isParsing}
                    className="mt-6 w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? <LoadingSpinner /> : 'Generate Notes'}
                </button>
            </div>

            {notes && (
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg shadow-md relative">
                    <button onClick={handleCopy} className="absolute top-4 right-4 flex items-center text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-3 py-1.5 rounded-md transition-colors">
                        <ClipboardIcon className="w-4 h-4 mr-2" />
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                    <article 
                        className="prose prose-slate dark:prose-invert max-w-none" 
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(notes) }} 
                    />
                </div>
            )}
        </div>
    );
};

export default DocToNotes;