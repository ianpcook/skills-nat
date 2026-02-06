'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';
import { Upload, X, FileText, Check, AlertTriangle, Loader2, ArrowRight, FolderOpen, Github } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UploadedFile {
  file: File;
  name: string;
  path: string;
  size: number;
  content: string;
}

const ALLOWED_EXTENSIONS = ['.md', '.txt', '.json', '.yaml', '.yml', '.sh', '.py', '.ts', '.js', '.zip'];

const FILE_EXTENSIONS_FOR_CONTENT = ['.md', '.txt', '.json', '.yaml', '.yml', '.sh', '.py', '.ts', '.js'];

const JUNK_PATTERNS = ['__MACOSX/', '.DS_Store', '.gitkeep'];

const isJunkPath = (path: string): boolean =>
  JUNK_PATTERNS.some((pattern) => path.includes(pattern)) ||
  path.split('/').some((segment) => segment.startsWith('.'));

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isValidGitHubUrl = (url: string): boolean =>
  /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/.test(url);

const extractRepoInfo = (url: string): { owner: string; repo: string } | null => {
  const match = url.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
  return match ? { owner: match[1], repo: match[2] } : null;
};

const isAllowedFile = (filename: string): boolean => {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return ALLOWED_EXTENSIONS.includes(ext);
};

const isAllowedContentFile = (filename: string): boolean => {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return FILE_EXTENSIONS_FOR_CONTENT.includes(ext);
};

const stripCommonPrefix = (paths: string[]): ((p: string) => string) => {
  if (paths.length === 0) return (p) => p;
  const parts = paths[0].split('/');
  if (parts.length < 2) return (p) => p;
  const prefix = parts[0] + '/';
  const allSharePrefix = paths.every((p) => p.startsWith(prefix));
  return allSharePrefix ? (p) => p.slice(prefix.length) : (p) => p;
};

const processZipFile = async (file: File): Promise<{ extracted: UploadedFile[]; skippedCount: number }> => {
  const buffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);

  const entries = Object.entries(zip.files).filter(
    ([path, entry]) => !entry.dir && !isJunkPath(path)
  );

  const rawPaths = entries.map(([path]) => path);
  const strip = stripCommonPrefix(rawPaths);

  const extracted: UploadedFile[] = [];
  let skippedCount = 0;

  for (const [path, entry] of entries) {
    const strippedPath = strip(path);
    const fileName = strippedPath.split('/').pop() ?? strippedPath;

    if (!isAllowedContentFile(fileName)) {
      skippedCount++;
      continue;
    }

    const content = await entry.async('string');
    const syntheticFile = new File([content], fileName, { type: 'text/plain' });

    extracted.push({
      file: syntheticFile,
      name: fileName,
      path: strippedPath,
      size: syntheticFile.size,
      content,
    });
  }

  return { extracted, skippedCount };
};

export default function SubmitPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [repoUrl, setRepoUrl] = useState('');
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
    let totalSkippedFromZips = 0;

    for (const file of validFiles) {
      // Handle .zip files by extracting contents
      if (file.name.toLowerCase().endsWith('.zip')) {
        try {
          console.log(`[SUBMIT] Extracting zip: ${file.name}`);
          const { extracted, skippedCount } = await processZipFile(file);
          totalSkippedFromZips += skippedCount;

          const deduped = extracted.filter(
            (ef) => !files.some((f) => f.path === ef.path)
          );
          uploadedFiles.push(...deduped);
          console.log(`[SUBMIT] Extracted ${deduped.length} files from ${file.name} (${skippedCount} skipped)`);
        } catch (err) {
          console.error(`[SUBMIT] Failed to extract zip: ${file.name}`, err);
          setError(`Failed to extract ${file.name}. Is it a valid zip file?`);
        }
        continue;
      }

      const relativePath = (file as any).webkitRelativePath || file.name;
      const pathParts = relativePath.split('/');
      const displayPath = pathParts.length > 1 ? pathParts.slice(1).join('/') : relativePath;

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

    if (totalSkippedFromZips > 0) {
      setError(`${totalSkippedFromZips} file(s) from zip were skipped. Allowed types: ${FILE_EXTENSIONS_FOR_CONTENT.join(', ')}`);
    }

    setFiles((prev) => [...prev, ...uploadedFiles]);
  }, [files]);

  const processEntry = async (entry: FileSystemEntry, path = ''): Promise<File[]> => {
    if (entry.isFile) {
      return new Promise((resolve) => {
        (entry as FileSystemFileEntry).file((file) => {
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
          const files = await processEntry(entry);
          allFiles.push(...files);
        } else if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) allFiles.push(file);
        }
      }

      if (allFiles.length > 0) {
        addFiles(allFiles);
      }
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleFolderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
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
      if (repoUrl.trim()) {
        formData.append('repoUrl', repoUrl.trim());
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
        <main className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="py-16 text-center">
              {/* Success Icon - Pop Art Style */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border-4 border-foreground bg-pop-lime shadow-[4px_4px_0_0_theme(colors.foreground)]">
                <Check className="h-10 w-10 text-foreground" />
              </div>

              <h1 className="text-3xl md:text-4xl font-black uppercase text-foreground mb-4">Skill Submitted!</h1>
              <p className="text-lg text-muted-foreground mx-auto mb-8 max-w-md">
                Your skill has been submitted and is pending review. We&apos;ll review it and add it to
                the directory once approved.
              </p>

              {/* Submission Details - Pop Art Style */}
              <div className="mb-8 border-4 border-foreground bg-card p-6 text-left shadow-[4px_4px_0_0_theme(colors.foreground)]">
                <h3 className="mb-4 font-black uppercase text-foreground">
                  Submission Details
                </h3>
                <dl className="space-y-3 text-sm">
                  {submissionId && (
                    <div className="flex justify-between border-b-2 border-foreground/20 pb-2">
                      <dt className="font-bold uppercase text-muted-foreground">Submission ID</dt>
                      <dd className="font-mono text-xs font-bold text-foreground">{submissionId}</dd>
                    </div>
                  )}
                  <div className="flex justify-between border-b-2 border-foreground/20 pb-2">
                    <dt className="font-bold uppercase text-muted-foreground">Status</dt>
                    <dd>
                      <Badge className="bg-pop-orange text-foreground border-2 border-foreground font-bold">
                        Pending Review
                      </Badge>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-bold uppercase text-muted-foreground">Files</dt>
                    <dd className="font-bold text-foreground">
                      {files.length} file{files.length !== 1 ? 's' : ''}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Actions - Pop Art Style */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/skills">
                  <Button className="bg-pop-pink text-foreground font-black uppercase border-3 border-foreground shadow-[4px_4px_0_0_theme(colors.foreground)] hover:shadow-[2px_2px_0_0_theme(colors.foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all gap-2">
                    Browse Skills
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="bg-card text-foreground font-black uppercase border-3 border-foreground shadow-[4px_4px_0_0_theme(colors.pop-cyan)] hover:shadow-[2px_2px_0_0_theme(colors.pop-cyan)] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-pop-cyan transition-all"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFiles([]);
                    setRepoUrl('');
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

      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header - Pop Art Style */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-2 flex-1 bg-foreground" />
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                <span className="text-pop-orange">Submit</span> a Skill
              </h1>
              <div className="h-2 flex-1 bg-foreground" />
            </div>
            <p className="text-center text-lg text-muted-foreground">
              Link your GitHub repo or upload files. Your submission must include a SKILL.md file.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* GitHub Repo URL */}
            <div className="border-4 border-foreground bg-card p-6 shadow-[4px_4px_0_0_theme(colors.foreground)]">
              <label htmlFor="repo-url" className="mb-2 block text-lg font-black uppercase text-foreground">
                <Github className="inline h-5 w-5 mr-2 -mt-1" />
                GitHub Repository
              </label>
              <p className="mb-4 text-sm text-muted-foreground">
                Link your skill&apos;s GitHub repo so users can install directly from it
              </p>
              <input
                type="url"
                id="repo-url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/my-skill"
                className="w-full px-4 py-3 bg-background border-4 border-foreground text-foreground placeholder-muted-foreground font-mono text-sm focus:outline-none focus:border-pop-pink transition-colors"
              />
              {repoUrl && !isValidGitHubUrl(repoUrl) && (
                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-pop-orange">
                  <AlertTriangle className="h-4 w-4" />
                  Enter a valid GitHub repository URL
                </p>
              )}
              {repoUrl && isValidGitHubUrl(repoUrl) && (
                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-pop-lime">
                  <Check className="h-4 w-4" />
                  {extractRepoInfo(repoUrl)?.owner}/{extractRepoInfo(repoUrl)?.repo}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-1 flex-1 bg-foreground/20" />
              <span className="font-black text-muted-foreground uppercase text-sm">Or upload your files</span>
              <div className="h-1 flex-1 bg-foreground/20" />
            </div>

            {/* File Upload - Pop Art Style */}
            <div className="border-4 border-foreground bg-card p-6 shadow-[4px_4px_0_0_theme(colors.foreground)]">
              <label className="mb-2 block text-lg font-black uppercase text-foreground">
                Skill Files
              </label>
              <p className="mb-4 text-sm text-muted-foreground">
                Drag and drop files or click to browse. Required: SKILL.md
              </p>

              {/* Drop Zone - Pop Art Style */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-4 border-dashed p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-pop-pink bg-pop-pink/10'
                    : 'border-foreground'
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
                    isDragOver ? 'text-pop-pink' : 'text-foreground'
                  }`}
                />
                <p className="mb-4 font-bold text-foreground">
                  Drag and drop files or a folder here
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 border-2 border-foreground bg-pop-cyan font-bold uppercase text-foreground hover:bg-pop-cyan/80"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Files
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 border-2 border-foreground bg-pop-lime font-bold uppercase text-foreground hover:bg-pop-lime/80"
                    onClick={() => folderInputRef.current?.click()}
                  >
                    <FolderOpen className="h-4 w-4" />
                    Upload Folder
                  </Button>
                </div>
                <p className="mt-4 text-xs font-bold text-muted-foreground">
                  Allowed: {ALLOWED_EXTENSIONS.join(', ')} (zip files are extracted automatically)
                </p>
              </div>

              {/* File List - Pop Art Style */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.path}
                      className="flex items-center justify-between border-2 border-foreground bg-background px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-foreground" />
                        <div>
                          <p className="flex items-center gap-2 font-mono text-sm font-bold text-foreground">
                            {file.path}
                            {file.name.toLowerCase() === 'skill.md' && (
                              <Badge className="bg-pop-pink text-foreground border-2 border-foreground font-bold">
                                Required
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs font-bold text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.path)}
                        className="p-1 text-foreground transition-colors hover:text-pop-pink hover:scale-110"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Validation Messages - Pop Art Style */}
              {files.length > 0 && !hasSkillMd && (
                <p className="mt-3 flex items-center gap-2 text-sm font-bold text-pop-orange">
                  <AlertTriangle className="h-4 w-4" />
                  SKILL.md file is required
                </p>
              )}

              {files.length > 0 && hasSkillMd && (
                <p className="mt-3 flex items-center gap-2 text-sm font-bold text-pop-lime">
                  <Check className="h-4 w-4" />
                  SKILL.md found - ready to submit
                </p>
              )}
            </div>

            {/* Error Message - Pop Art Style */}
            {error && (
              <div className="border-4 border-foreground bg-pop-pink p-4 text-sm font-bold text-foreground">
                {error}
              </div>
            )}

            {/* Guidelines - Pop Art Style */}
            <div className="border-4 border-foreground bg-card p-6 shadow-[4px_4px_0_0_theme(colors.foreground)]">
              <h3 className="mb-4 text-lg font-black uppercase text-foreground">
                Submission Guidelines
              </h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-pop-lime" />
                  <span>
                    Include a <code className="border border-foreground bg-pop-yellow px-1.5 py-0.5 text-xs font-bold">SKILL.md</code> file
                    with YAML frontmatter containing: name, description, version
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-pop-lime" />
                  <span>Include installation instructions and usage examples in your SKILL.md</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-pop-lime" />
                  <span>All code should be original work or properly licensed</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-pop-lime" />
                  <span>No malicious code or security vulnerabilities</span>
                </li>
              </ul>

              {/* Example SKILL.md - Pop Art Terminal */}
              <div className="mt-6 border-4 border-foreground shadow-[4px_4px_0_0_theme(colors.foreground)]">
                <div className="bg-foreground px-3 py-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-pop-pink" />
                  <span className="w-3 h-3 bg-pop-yellow" />
                  <span className="w-3 h-3 bg-pop-lime" />
                  <span className="ml-3 text-xs text-card/50 font-bold">SKILL.md</span>
                </div>
                <pre className="bg-foreground text-card p-4 overflow-x-auto text-xs font-mono">
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

            {/* Submit Button - Pop Art Style */}
            <Button
              type="submit"
              disabled={isSubmitting || files.length === 0 || !hasSkillMd || (repoUrl.trim() !== '' && !isValidGitHubUrl(repoUrl))}
              className="w-full py-6 text-lg bg-pop-yellow text-foreground font-black uppercase border-4 border-foreground shadow-[6px_6px_0_0_theme(colors.foreground)] hover:shadow-[3px_3px_0_0_theme(colors.foreground)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[6px_6px_0_0_theme(colors.foreground)] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
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
