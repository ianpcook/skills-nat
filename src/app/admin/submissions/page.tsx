'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, ArrowRight, FileText, Inbox } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Submission, SubmissionStatus } from '@/db/schema';

type StatusFilter = SubmissionStatus | 'all';

const statusStyles: Record<SubmissionStatus, string> = {
  pending: 'border-yellow-600 bg-yellow-500/10 text-yellow-700',
  approved: 'border-green-600 bg-green-500/10 text-green-700',
  rejected: 'border-red-600 bg-red-500/10 text-red-700',
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
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="section-title">Submissions</h1>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status ? 'btn-primary' : 'btn-outline'}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : error ? (
        <div className="border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-12 text-center">
          <Inbox className="mx-auto mb-4 h-12 w-12 text-foreground/30" />
          <p className="text-foreground/50">No submissions found</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-foreground/20 bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground/60">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground/60">
                  Version
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground/60">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground/60">
                  Submitted
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground/60">
                  Files
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-foreground/60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission.id}
                  className="border-b border-foreground/10 transition-colors last:border-b-0 hover:bg-background/50"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-card-foreground">
                      {submission.name}
                    </div>
                    <div className="text-sm text-foreground/50">
                      {submission.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {submission.version}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusStyles[submission.status]}>
                      {submission.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/50">
                    {formatDate(submission.submittedAt)}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {submission.files?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/submissions/${submission.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:underline"
                    >
                      View
                      <ArrowRight className="h-4 w-4" />
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
