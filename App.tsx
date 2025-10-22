
import React, { useState, useCallback } from 'react';
import type { StatementData } from './types';
import { parseStatement } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Spinner } from './components/Spinner';
import { AlertTriangleIcon } from './components/Icons';

// pdf.js is loaded from a CDN, so we need to declare it for TypeScript
declare const pdfjsLib: any;

const App: React.FC = () => {
  const [statementData, setStatementData] = useState<StatementData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = useCallback(async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setStatementData(null);
    setFileName(file.name);
    setProgressMessage('Reading PDF pages...');

    try {
      const fileBuffer = await file.arrayBuffer();
      
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs`;

      const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
      const numPages = pdf.numPages;
      const imageParts: { mimeType: string; data: string }[] = [];

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      for (let i = 1; i <= numPages; i++) {
        setProgressMessage(`Rendering page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // Use a higher scale for better image quality
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64Data = dataUrl.split(',')[1];

        imageParts.push({
          mimeType: 'image/jpeg',
          data: base64Data,
        });
      }
      
      // Clean up the canvas element
      canvas.remove();

      setProgressMessage('Analyzing statement with AI...');
      const extractedData = await parseStatement(imageParts);

      setStatementData(extractedData);
    } catch (err)
    {
      console.error(err);
      setError('Failed to process the statement. Please ensure it is a valid PDF and try again.');
    } finally {
      setIsLoading(false);
      setProgressMessage('');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Credit Card Statement Parser
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Upload your PDF statement and let AI instantly extract key details for you. Now with image support!
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <FileUpload onFileSelect={handleFileChange} disabled={isLoading} fileName={fileName} />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center min-h-[300px]">
            {isLoading ? (
              <div className="text-center">
                <Spinner />
                <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
                  {progressMessage}
                </p>
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                <AlertTriangleIcon className="w-12 h-12 mx-auto mb-4" />
                <p className="font-bold text-lg">An Error Occurred</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : statementData ? (
              <ResultsDisplay data={statementData} />
            ) : (
              <div className="text-center text-slate-500 dark:text-slate-400">
                 <h2 className="text-xl font-semibold">Your extracted data will appear here.</h2>
                 <p className="mt-2">Upload a PDF file to get started.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
