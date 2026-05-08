import { useState, useCallback } from 'react';

export interface ReviewSubmission {
  reviewedUser: string;
  eventId: string;
  rating: number;
  comment?: string;
}

/**
 * Hook to submit reviews.
 * Currently simulates transaction; will be replaced with Anchor instruction.
 */
export function useReviews() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string[]>([]); // wallets already reviewed
  const [error, setError] = useState<string | null>(null);

  const submitReview = useCallback(async (review: ReviewSubmission) => {
    setError(null);
    setSubmitting(true);

    try {
      // Simulate transaction
      await new Promise((r) => setTimeout(r, 1200));
      setSubmitted((prev) => [...prev, review.reviewedUser]);
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, []);

  const isReviewed = useCallback(
    (wallet: string) => submitted.includes(wallet),
    [submitted]
  );

  return { submitReview, submitting, submitted, isReviewed, error };
}