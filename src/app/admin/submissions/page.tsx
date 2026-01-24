'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Submission, SubmissionStatus } from '@/db/schema';

type StatusFilter = SubmissionStatus | 'all';

const statusColors: Record<SubmissionStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  approved: { bg: 'bg-green-500/10', text: 'text-green-400' },
  rejected: { bg: 'bg-red-500/10', text: 'text-red-400' },
};

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const fetchSubmissions = async (filter: StatusFilter) => {
    console.log(`[ADMIN SUBMISSIONS PAGE] Fetching submissions with filter: ${filter}`);
    setLoading(true);
    setError(null);

    try {
      const url = filter === 'all'
        ? '/api/admin/submissions'
        : `/api/admin/submissions?status=${filter}`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch submissions');
      }

      const data = await response.json();
      console.log(`[ADMIN SUBMISSIONS PAGE] Fetched ${data.submissions.length} submissions`);
      setSubmissions(data.submissions);
    } catch (err) {
      console.error('[ADMIN SUBMISSIONS PAGE] Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(statusFilter);
  }, [statusFilter]);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Submissions</h1>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-[var(--primary)] text-[var(--background)]'
                  : 'bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--card-hover)]'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {error}
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)]">
          No submissions found
        </div>
      ) : (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-muted)]">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-muted)]">
                  Version
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-muted)]">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-muted)]">
                  Submitted
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-muted)]">
                  Files
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-[var(--text-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission.id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--card-hover)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-[var(--foreground)]">
                      {submission.name}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                      {submission.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">
                    {submission.version}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[submission.status].bg
                      } ${statusColors[submission.status].text}`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-muted)]">
                    {formatDate(submission.submittedAt)}
                  </td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">
                    {submission.files?.length || 0} file{(submission.files?.length || 0) !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/submissions/${submission.id}`}
                      className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                    >
                      View &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
