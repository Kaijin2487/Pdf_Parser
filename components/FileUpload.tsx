
import React, { useState, useCallback } from 'react';
import { UploadIcon, PdfFileIcon, CheckCircleIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
  fileName: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled, fileName }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if(files[0].type === 'application/pdf') {
        onFileSelect(files[0]);
      } else {
        alert('Please upload a PDF file.');
      }
    }
  }, [disabled, onFileSelect]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        onFileSelect(files[0]);
    }
  };

  const baseClasses = "relative block w-full h-full p-6 text-center border-2 border-dashed rounded-lg transition-colors duration-300 cursor-pointer";
  const idleClasses = "border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400";
  const draggingClasses = "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20";
  const disabledClasses = "bg-slate-100 dark:bg-slate-700/50 cursor-not-allowed";

  return (
    <div>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Upload Statement</h2>
        <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={disabled}
        />
        <label
            htmlFor="file-upload"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`${baseClasses} ${disabled ? disabledClasses : (isDragging ? draggingClasses : idleClasses)}`}
        >
            <div className="flex flex-col items-center justify-center space-y-4">
                {fileName && !disabled ? (
                    <>
                        <CheckCircleIcon className="w-16 h-16 text-green-500"/>
                        <p className="text-slate-700 dark:text-slate-300 font-semibold">File Ready!</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 break-all">{fileName}</p>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Choose a different file</span>
                    </>
                ) : (
                     <>
                        <UploadIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                        <p className="text-slate-700 dark:text-slate-300">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">PDF only</p>
                     </>
                )}
            </div>
        </label>
    </div>
  );
};
