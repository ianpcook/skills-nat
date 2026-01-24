'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  content: string;
}

const ALLOWED_EXTENSIONS = ['.md', '.txt', '.json', '.yaml', '.yml', '.sh', '.py', '.ts', '.js'];

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isAllowedFile = (filename: string): boolean => {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return ALLOWED_EXTENSIONS.includes(ext);
};

export default function SubmitPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSkillMd = files.some(
    (f) => f.name.toLowerCase() === 'skill.md'
  );

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    console.log(`[SUBMIT] Adding ${newFiles.length} files`);
    setError(null);

    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter((f) => {
      if (!isAllowedFile(f.name)) {
        console.log(`[SUBMIT] Rejected file (invalid extension): ${f.name}`);
        return false;
      }
      return true;
    });

    if (validFiles.length < fileArray.length) {
      setError(`Some files were skipped. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`);
    }

    const uploadedFiles: UploadedFile[] = [];
    for (const file of validFiles) {
      // Check if file already exists
      if (files.some((f) => f.name === file.name)) {
        console.log(`[SUBMIT] Skipping duplicate: ${file.name}`);
        continue;
      }

      try {
        const content = await readFileContent(file);
        uploadedFiles.push({
          file,
          name: file.name,
          size: file.size,
          content,
        });
        console.log(`[SUBMIT] Added file: ${file.name} (${file.size} bytes)`);
      } catch (err) {
        console.error(`[SUBMIT] Failed to read file: ${file.name}`, err);
      }
    }

    setFiles((prev) => [...prev, ...uploadedFiles]);
  }, [files]);

  const removeFile = (filename: string) => {
    console.log(`[SUBMIT] Removing file: ${filename}`);
    setFiles((prev) => prev.filter((f) => f.name !== filename));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    // Reset input to allow selecting the same file again
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    console.log(`[SUBMIT] Submitting ${files.length} files`);

    try {
      const formData = new FormData();
      for (const uploadedFile of files) {
        formData.append('files', uploadedFile.file);
      }

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      console.log(`[SUBMIT] Submission successful: ${data.id}`);
      setSubmissionId(data.id);
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('[SUBMIT] Submission error:', err);
      setError(err instanceof Error ? err.message : 'Submission failed');
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Skill Submitted!</h1>
            <p className="text-[#bfbfbf] text-lg mb-8 max-w-md mx-auto">
              Your skill has been submitted and is pending review. We&apos;ll review it and add it to
              the directory once approved.
            </p>

            <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-xl p-6 mb-8 text-left">
              <h3 className="font-medium mb-4">Submission Details</h3>
              <div className="space-y-3 text-sm">
                {submissionId && (
                  <div className="flex justify-between">
                    <span className="text-[#bfbfbf]">Submission ID</span>
                    <span className="font-mono text-xs text-[#f5f0e6]">{submissionId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#bfbfbf]">Status</span>
                  <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded text-xs">
                    Pending Review
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#bfbfbf]">Files</span>
                  <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/skills"
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#ffbc20] to-[#ffd980] hover:from-[#ffd980] hover:to-[#ffecbf] rounded-lg font-medium text-[#1a160d] transition-all"
              >
                Browse Skills
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFiles([]);
                  setSubmissionId(null);
                  setError(null);
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#1d1e1f] border border-[#2a2520] hover:border-[#ffbc20]/50 rounded-lg font-medium transition-colors"
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4">Submit a Skill</h1>
          <p className="text-[#bfbfbf] text-lg">
            Upload your skill files for review. Your submission must include a SKILL.md file.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload */}
          <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-6">
            <label className="block text-lg font-medium mb-2">Skill Files</label>
            <p className="text-sm text-[#807c73] mb-4">
              Drag and drop files or click to browse. Required: SKILL.md
            </p>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragOver
                  ? 'border-[#ffbc20] bg-[#ffbc20]/5'
                  : 'border-[#2a2520] hover:border-[#ffbc20]/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_EXTENSIONS.join(',')}
                onChange={handleFileInput}
                className="hidden"
              />
              <svg
                className={`w-12 h-12 mx-auto mb-4 ${
                  isDragOver ? 'text-[#ffbc20]' : 'text-[#807c73]'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-[#bfbfbf] mb-2">
                <span className="text-[#ffbc20]">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-[#807c73]">
                {ALLOWED_EXTENSIONS.join(', ')}
              </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between px-4 py-3 bg-[#1a160d] rounded-lg border border-[#2a2520]"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-[#807c73]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-[#f5f0e6] font-mono">
                          {file.name}
                          {file.name.toLowerCase() === 'skill.md' && (
                            <span className="ml-2 px-1.5 py-0.5 bg-[#ffbc20]/10 text-[#ffbc20] text-xs rounded">
                              Required
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[#807c73]">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.name)}
                      className="p-1 text-[#807c73] hover:text-red-400 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Validation Message */}
            {files.length > 0 && !hasSkillMd && (
              <p className="text-sm text-amber-400 mt-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                SKILL.md file is required
              </p>
            )}

            {files.length > 0 && hasSkillMd && (
              <p className="text-sm text-green-400 mt-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                SKILL.md found - ready to submit
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4">Submission Guidelines</h3>
            <ul className="space-y-3 text-sm text-[#bfbfbf]">
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#ffbc20] flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Include a <code className="px-1.5 py-0.5 bg-[#2a2520] rounded text-xs">SKILL.md</code> file
                  with YAML frontmatter containing: name, description, version
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#ffbc20] flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Include installation instructions and usage examples in your SKILL.md</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#ffbc20] flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>All code should be original work or properly licensed</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#ffbc20] flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>No malicious code or security vulnerabilities</span>
              </li>
            </ul>

            {/* Example SKILL.md */}
            <div className="mt-6 p-4 bg-[#1a160d] rounded-lg border border-[#2a2520]">
              <p className="text-xs text-[#807c73] mb-2">Example SKILL.md frontmatter:</p>
              <pre className="text-xs text-[#ffd980] font-mono overflow-x-auto">
{`---
name: My Awesome Skill
description: A brief description of what the skill does
version: 1.0.0
---

# My Awesome Skill

Instructions and documentation here...`}
              </pre>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || files.length === 0 || !hasSkillMd}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#ffbc20] to-[#ffd980] hover:from-[#ffd980] hover:to-[#ffecbf] disabled:from-[#ffbc20]/50 disabled:to-[#ffd980]/50 disabled:cursor-not-allowed rounded-xl font-medium text-[#1a160d] transition-all glow-hover flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Submit Skill for Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
