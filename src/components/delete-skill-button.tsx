'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteSkillButtonProps {
  slug: string;
  skillName: string;
}

export function DeleteSkillButton({ slug, skillName }: DeleteSkillButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/skills/${slug}/delete`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete skill');
      }

      // Redirect to skills list
      router.push('/skills');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete skill');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">
          Delete &quot;{skillName}&quot;? This cannot be undone.
        </p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Yes, Delete'
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="flex-1 border-border"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={() => setShowConfirm(true)}
    >
      <Trash2 className="h-4 w-4" />
      Remove from Marketplace
    </Button>
  );
}
