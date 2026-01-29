'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, FileText, Loader2, Check, X, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Submission, SubmissionStatus, SubmissionFile } from '@/db/schema';

const statusStyles: Record<SubmissionStatus, string> = {
  pending: 'border-yellow-600 bg-yellow-500/10 text-yellow-700',
  approved: 'border-green-600 bg-green-500/10 text-green-700',
  rejected: 'border-red-600 bg-red-500/10 text-red-700',
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

  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!submission) return;

    console.log(`[SUBMISSION DETAIL] Deleting submission and skill: ${submission.slug}`);
    setDeleting(true);

    try {
      // Delete the skill from the marketplace (if approved)
      if (submission.status === 'approved') {
        const skillRes = await fetch(`/api/skills/${submission.slug}/delete`, {
          method: 'DELETE',
        });
        if (!skillRes.ok) {
          console.warn('Failed to delete skill, may not exist');
        }
      }

      // Delete the submission
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }

      console.log(`[SUBMISSION DETAIL] Deleted successfully`);
      router.push('/admin/submissions');
    } catch (err) {
      console.error('[SUBMISSION DETAIL] Error deleting:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setDeleting(false);
      setShowDeleteConfirm(false);
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
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
        <div className="mt-4">
          <Link
            href="/admin/submissions"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to submissions
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
        className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to submissions
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="section-title mb-2">{submission.name}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>v{submission.version}</span>
            <span>&bull;</span>
            <span>{submission.slug}</span>
          </div>
        </div>
        <Badge className={statusStyles[submission.status]}>
          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content - Files */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
            Files ({submission.files?.length || 0})
          </h2>

          {submission.files?.map((file: SubmissionFile) => (
            <div
              key={file.name}
              className="overflow-hidden rounded-lg border border-border bg-card"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <button
                onClick={() => toggleFile(file.name)}
                className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-background/50"
              >
                <div className="flex items-center gap-3">
                  <ChevronRight
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      expandedFiles.has(file.name) ? 'rotate-90' : ''
                    }`}
                  />
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm text-card-foreground">
                    {file.name}
                  </span>
                  {file.name.toLowerCase() === 'skill.md' && (
                    <Badge className="bg-[--teal] text-white border-0">
                      Required
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
              </button>

              {expandedFiles.has(file.name) && (
                <div className="border-t border-border bg-muted/50 p-4">
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-foreground">
                    {file.content}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar - Details & Actions */}
        <div className="space-y-6">
          {/* Details */}
          <div className="rounded-lg border border-border bg-card p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="mb-4 font-serif text-lg font-semibold text-card-foreground">
              Details
            </h3>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Submitted</dt>
                <dd className="text-card-foreground">
                  {formatDate(submission.submittedAt)}
                </dd>
              </div>
              {submission.reviewedAt && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Reviewed</dt>
                  <dd className="text-card-foreground">
                    {formatDate(submission.reviewedAt)}
                  </dd>
                </div>
              )}
              {submission.description && (
                <div>
                  <dt className="mb-1 text-muted-foreground">Description</dt>
                  <dd className="text-card-foreground">
                    {submission.description}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Review Actions */}
          {submission.status === 'pending' && (
            <div className="rounded-lg border border-border bg-card p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
              <h3 className="mb-4 font-serif text-lg font-semibold text-card-foreground">
                Review
              </h3>

              <div className="mb-4">
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-medium text-card-foreground"
                >
                  Reviewer Notes (optional)
                </label>
                <textarea
                  id="notes"
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-md border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground transition-colors focus:border-[--teal] focus:outline-none focus:ring-1 focus:ring-[--teal]"
                  placeholder="Add notes about this submission..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={updating}
                  className="flex-1 border-green-600 bg-green-500/10 text-green-700 hover:bg-green-500/20"
                >
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={updating}
                  className="flex-1 border-red-600 bg-red-500/10 text-red-700 hover:bg-red-500/20"
                >
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Reviewer Notes (if already reviewed) */}
          {submission.status !== 'pending' && submission.reviewerNotes && (
            <div className="rounded-lg border border-border bg-card p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
              <h3 className="mb-4 font-serif text-lg font-semibold text-card-foreground">
                Reviewer Notes
              </h3>
              <p className="text-muted-foreground">
                {submission.reviewerNotes}
              </p>
            </div>
          )}

          {/* Delete Action */}
          <div className="rounded-lg border border-destructive/20 bg-card p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="mb-4 font-serif text-lg font-semibold text-card-foreground">
              Danger Zone
            </h3>
            {showDeleteConfirm ? (
              <div className="space-y-3">
                <p className="text-sm text-destructive">
                  Delete &quot;{submission.name}&quot;?
                  {submission.status === 'approved' && ' This will also remove it from the marketplace.'}
                  {' '}This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Yes, Delete'
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    variant="outline"
                    className="flex-1 border-border"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="outline"
                className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Submission
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
