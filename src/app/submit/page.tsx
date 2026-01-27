'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Upload, X, FileText, Check, AlertTriangle, Loader2, ArrowRight, FolderOpen } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UploadedFile {
  file: File;
  name: string;
  path: string;  // relative path within folder
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
  const folderInputRef = useRef<HTMLInputElement>(null);

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

  const addFiles = useCallback(async (newFiles: FileList | File[], basePath = '') => {
    console.log(`[SUBMIT] Adding ${newFiles.length} files (basePath: ${basePath || 'none'})`);
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
      // Get the relative path (from webkitRelativePath or constructed)
      const relativePath = (file as any).webkitRelativePath || file.name;
      // Strip the top-level folder name for display
      const pathParts = relativePath.split('/');
      const displayPath = pathParts.length > 1 ? pathParts.slice(1).join('/') : relativePath;
      
      // Check if file already exists
      if (files.some((f) => f.path === displayPath)) {
        console.log(`[SUBMIT] Skipping duplicate: ${displayPath}`);
        continue;
      }

      try {
        const content = await readFileContent(file);
        uploadedFiles.push({
          file,
          name: file.name,
          path: displayPath,
          size: file.size,
          content,
        });
        console.log(`[SUBMIT] Added file: ${displayPath} (${file.size} bytes)`);
      } catch (err) {
        console.error(`[SUBMIT] Failed to read file: ${file.name}`, err);
      }
    }

    setFiles((prev) => [...prev, ...uploadedFiles]);
  }, [files]);

  // Handle folder drop via DataTransfer API
  const processEntry = async (entry: FileSystemEntry, path = ''): Promise<File[]> => {
    if (entry.isFile) {
      return new Promise((resolve) => {
        (entry as FileSystemFileEntry).file((file) => {
          // Attach the path to the file object
          Object.defineProperty(file, 'webkitRelativePath', {
            value: path + file.name,
            writable: false,
          });
          resolve([file]);
        }, () => resolve([]));
      });
    } else if (entry.isDirectory) {
      const dirReader = (entry as FileSystemDirectoryEntry).createReader();
      return new Promise((resolve) => {
        dirReader.readEntries(async (entries) => {
          const files: File[] = [];
          for (const childEntry of entries) {
            const childFiles = await processEntry(childEntry, path + entry.name + '/');
            files.push(...childFiles);
          }
          resolve(files);
        }, () => resolve([]));
      });
    }
    return [];
  };

  const removeFile = (filePath: string) => {
    console.log(`[SUBMIT] Removing file: ${filePath}`);
    setFiles((prev) => prev.filter((f) => f.path !== filePath));
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

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const items = e.dataTransfer.items;
    if (items && items.length > 0) {
      const allFiles: File[] = [];
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const entry = item.webkitGetAsEntry?.();
        
        if (entry) {
          // Use the FileSystem API for folders
          const files = await processEntry(entry);
          allFiles.push(...files);
        } else if (item.kind === 'file') {
          // Fallback for regular files
          const file = item.getAsFile();
          if (file) allFiles.push(file);
        }
      }
      
      if (allFiles.length > 0) {
        addFiles(allFiles);
      }
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Fallback for browsers that don't support items
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

  const handleFolderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    // Reset input to allow selecting the same folder again
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
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="section">
          <div className="mx-auto max-w-2xl">
            <div className="py-16 text-center">
              {/* Success Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-green-600 bg-green-500/10">
                <Check className="h-10 w-10 text-green-600" />
              </div>

              <h1 className="section-title mb-4">Skill Submitted!</h1>
              <p className="body-text mx-auto mb-8 max-w-md">
                Your skill has been submitted and is pending review. We&apos;ll review it and add it to
                the directory once approved.
              </p>

              {/* Submission Details */}
              <div className="mb-8 border border-foreground/20 bg-card p-6 text-left">
                <h3 className="mb-4 font-serif font-medium text-card-foreground">
                  Submission Details
                </h3>
                <dl className="space-y-3 text-sm">
                  {submissionId && (
                    <div className="flex justify-between">
                      <dt className="text-foreground/60">Submission ID</dt>
                      <dd className="font-mono text-xs text-card-foreground">{submissionId}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-foreground/60">Status</dt>
                    <dd>
                      <Badge className="border-yellow-600 bg-yellow-500/10 text-yellow-700">
                        Pending Review
                      </Badge>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-foreground/60">Files</dt>
                    <dd className="text-card-foreground">
                      {files.length} file{files.length !== 1 ? 's' : ''}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/skills">
                  <Button className="btn-primary gap-2">
                    Browse Skills
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="btn-outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFiles([]);
                    setSubmissionId(null);
                    setError(null);
                  }}
                >
                  Submit Another
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="section">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="section-title-lg mb-4">Submit a Skill</h1>
            <p className="body-text">
              Upload your skill files for review. Your submission must include a SKILL.md file.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload */}
            <div className="border border-foreground/20 bg-card p-6">
              <label className="mb-2 block font-serif text-lg font-medium text-card-foreground">
                Skill Files
              </label>
              <p className="mb-4 text-sm text-foreground/60">
                Drag and drop files or click to browse. Required: SKILL.md
              </p>

              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-foreground bg-foreground/5'
                    : 'border-foreground/30'
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
                <input
                  ref={folderInputRef}
                  type="file"
                  // @ts-expect-error webkitdirectory is not in types but widely supported
                  webkitdirectory=""
                  directory=""
                  multiple
                  onChange={handleFolderInput}
                  className="hidden"
                />
                <Upload
                  className={`mx-auto mb-4 h-12 w-12 ${
                    isDragOver ? 'text-foreground' : 'text-foreground/40'
                  }`}
                />
                <p className="mb-4 text-foreground/70">
                  Drag and drop files or a folder here
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Files
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => folderInputRef.current?.click()}
                  >
                    <FolderOpen className="h-4 w-4" />
                    Upload Folder
                  </Button>
                </div>
                <p className="mt-4 text-xs text-foreground/50">
                  Allowed: {ALLOWED_EXTENSIONS.join(', ')}
                </p>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.path}
                      className="flex items-center justify-between border border-foreground/10 bg-background px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-foreground/50" />
                        <div>
                          <p className="flex items-center gap-2 font-mono text-sm text-card-foreground">
                            {file.path}
                            {file.name.toLowerCase() === 'skill.md' && (
                              <Badge className="border-foreground bg-foreground text-background">
                                Required
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-foreground/50">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.path)}
                        className="p-1 text-foreground/50 transition-colors hover:text-destructive"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Validation Messages */}
              {files.length > 0 && !hasSkillMd && (
                <p className="mt-3 flex items-center gap-2 text-sm text-yellow-700">
                  <AlertTriangle className="h-4 w-4" />
                  SKILL.md file is required
                </p>
              )}

              {files.length > 0 && hasSkillMd && (
                <p className="mt-3 flex items-center gap-2 text-sm text-green-700">
                  <Check className="h-4 w-4" />
                  SKILL.md found - ready to submit
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Guidelines */}
            <div className="border border-foreground/20 bg-card p-6">
              <h3 className="mb-4 font-serif text-lg font-medium text-card-foreground">
                Submission Guidelines
              </h3>
              <ul className="space-y-3 text-sm text-foreground/70">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-foreground" />
                  <span>
                    Include a <code className="border border-foreground/20 bg-background px-1.5 py-0.5 text-xs">SKILL.md</code> file
                    with YAML frontmatter containing: name, description, version
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-foreground" />
                  <span>Include installation instructions and usage examples in your SKILL.md</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-foreground" />
                  <span>All code should be original work or properly licensed</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-foreground" />
                  <span>No malicious code or security vulnerabilities</span>
                </li>
              </ul>

              {/* Example SKILL.md */}
              <div className="mt-6 border border-foreground/10 bg-background p-4">
                <p className="mb-2 text-xs text-foreground/50">Example SKILL.md frontmatter:</p>
                <pre className="overflow-x-auto font-mono text-xs text-foreground/80">
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
            <Button
              type="submit"
              disabled={isSubmitting || files.length === 0 || !hasSkillMd}
              className="btn-primary w-full py-4 text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Submit Skill for Review
                </>
              )}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
