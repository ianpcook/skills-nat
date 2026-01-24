'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Submission, SubmissionStatus, SubmissionFile } from '@/db/schema';

const statusColors: Record<SubmissionStatus, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  approved: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  rejected: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
};

const getLanguageFromFilename = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    md: 'markdown',
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    py: 'python',
    sh: 'bash',
    txt: 'text',
  };
  return langMap[ext || ''] || 'text';
};

export default function AdminSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  const fetchSubmission = async () => {
    console.log(`[SUBMISSION DETAIL] Fetching submission: ${id}`);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/submissions/${id}`);

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin');
          return;
        }
        if (response.status === 404) {
          throw new Error('Submission not found');
        }
        throw new Error('Failed to fetch submission');
      }

      const data = await response.json();
      console.log(`[SUBMISSION DETAIL] Fetched submission: ${data.submission.name}`);
      setSubmission(data.submission);
      setReviewerNotes(data.submission.reviewerNotes || '');

      // Expand SKILL.md by default
      const skillMdFile = data.submission.files?.find(
        (f: SubmissionFile) => f.name.toLowerCase() === 'skill.md'
      );
      if (skillMdFile) {
        setExpandedFiles(new Set([skillMdFile.name]));
      }
    } catch (err) {
      console.error('[SUBMISSION DETAIL] Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected') => {
    if (!submission) return;

    console.log(`[SUBMISSION DETAIL] Updating status to: ${newStatus}`);
    setUpdating(true);

    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          reviewerNotes: reviewerNotes.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update submission');
      }

      const data = await response.json();
      console.log(`[SUBMISSION DETAIL] Status updated successfully`);
      setSubmission(data.submission);
    } catch (err) {
      console.error('[SUBMISSION DETAIL] Error updating:', err);
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const toggleFile = (filename: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(filename)) {
        next.delete(filename);
      } else {
        next.add(filename);
      }
      return next;
    });
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 inline-block">
          {error}
        </div>
        <div className="mt-4">
          <Link
            href="/admin/submissions"
            className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
          >
            &larr; Back to submissions
          </Link>
        </div>
      </div>
    );
  }

  if (!submission) {
    return null;
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/submissions"
        className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to submissions
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {submission.name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
            <span>v{submission.version}</span>
            <span>&bull;</span>
            <span>{submission.slug}</span>
          </div>
        </div>
        <span
          className={`inline-flex px-4 py-2 rounded-lg text-sm font-medium ${
            statusColors[submission.status].bg
          } ${statusColors[submission.status].text} ${statusColors[submission.status].border} border`}
        >
          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Files */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Files ({submission.files?.length || 0})
          </h2>

          {submission.files?.map((file: SubmissionFile) => (
            <div
              key={file.name}
              className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden"
            >
              <button
                onClick={() => toggleFile(file.name)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--card-hover)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${
                      expandedFiles.has(file.name) ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span className="font-mono text-sm text-[var(--foreground)]">
                    {file.name}
                  </span>
                  {file.name.toLowerCase() === 'skill.md' && (
                    <span className="px-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded">
                      Required
                    </span>
                  )}
                </div>
                <span className="text-xs text-[var(--text-muted)]">
                  {formatFileSize(file.size)}
                </span>
              </button>

              {expandedFiles.has(file.name) && (
                <div className="border-t border-[var(--border)]">
                  <pre className="p-4 overflow-x-auto text-sm">
                    <code className={`language-${getLanguageFromFilename(file.name)} text-[var(--text-secondary)]`}>
                      {file.content}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar - Details & Actions */}
        <div className="space-y-6">
          {/* Details */}
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Details
            </h3>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-[var(--text-muted)]">Submitted</dt>
                <dd className="text-[var(--foreground)]">
                  {formatDate(submission.submittedAt)}
                </dd>
              </div>
              {submission.reviewedAt && (
                <div>
                  <dt className="text-[var(--text-muted)]">Reviewed</dt>
                  <dd className="text-[var(--foreground)]">
                    {formatDate(submission.reviewedAt)}
                  </dd>
                </div>
              )}
              {submission.description && (
                <div>
                  <dt className="text-[var(--text-muted)]">Description</dt>
                  <dd className="text-[var(--foreground)]">
                    {submission.description}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Review Actions */}
          {submission.status === 'pending' && (
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Review
              </h3>

              <div className="mb-4">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-[var(--foreground)] mb-2"
                >
                  Reviewer Notes (optional)
                </label>
                <textarea
                  id="notes"
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                  placeholder="Add notes about this submission..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={updating}
                  className="flex-1 py-2 px-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={updating}
                  className="flex-1 py-2 px-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Reject'}
                </button>
              </div>
            </div>
          )}

          {/* Reviewer Notes (if already reviewed) */}
          {submission.status !== 'pending' && submission.reviewerNotes && (
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Reviewer Notes
              </h3>
              <p className="text-[var(--text-secondary)]">
                {submission.reviewerNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
