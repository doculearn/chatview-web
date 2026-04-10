"use client";

import { useState } from "react";

type Subscription = {
  id: string;
  status: string;
};

type CancellationFormProps = {
  subscription: Subscription;
  onSubmit: (data: {
    reason: string;
    additional_feedback: string;
    would_return: boolean;
    return_reason: string;
  }) => Promise<void>;
  onCancel: () => void;
};

const CANCELLATION_REASONS = [
  { value: "too_expensive", label: "Too Expensive" },
  { value: "insufficient_features", label: "Insufficient Features" },
  { value: "not_using", label: "Not Using It" },
  { value: "switching_providers", label: "Switching to Another Provider" },
  { value: "technical_issues", label: "Technical Issues" },
  { value: "poor_support", label: "Poor Customer Support" },
  { value: "other", label: "Other" },
];

export function CancellationForm({
  onSubmit,
  onCancel,
}: CancellationFormProps) {
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [wouldReturn, setWouldReturn] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!reason) {
      setError("Please select a cancellation reason");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onSubmit({
        reason,
        additional_feedback: feedback,
        would_return: wouldReturn,
        return_reason: returnReason,
      });
    } catch {
      setError("Failed to submit cancellation. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass-panel float-up rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10 border-red-500/20">
      <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Before You Go</p>
      <h2 className="headline-glow mt-3 text-xl font-bold text-red-400 sm:text-3xl">
        Cancel Subscription
      </h2>
      <p className="mt-4 text-(--muted)">
        We'd love to know why you're leaving. Your feedback helps us improve ChatView.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Reason Selection */}
        <div>
          <label className="block text-sm font-semibold text-(--muted) mb-3">
            Why are you cancelling?
          </label>
          <div className="space-y-2">
            {CANCELLATION_REASONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-(--panel-soft) transition-colors"
              >
                <input
                  type="radio"
                  name="reason"
                  value={opt.value}
                  checked={reason === opt.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Feedback */}
        <div>
          <label htmlFor="feedback" className="block text-sm font-semibold text-(--muted) mb-2">
            Additional Comments (Optional)
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Help us improve by sharing more details..."
            className="w-full rounded-xl bg-(--panel-soft) border border-white/10 px-4 py-3 text-sm text-(--foreground) placeholder:text-(--muted) focus:border-(--accent) focus:outline-none transition-colors"
            rows={4}
          />
        </div>

        {/* Would Return */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={wouldReturn}
              onChange={(e) => setWouldReturn(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">I might return to ChatView in the future</span>
          </label>

          {wouldReturn && (
            <div>
              <label htmlFor="returnReason" className="block text-sm text-(--muted) mb-2 ml-7">
                What would bring you back?
              </label>
              <textarea
                id="returnReason"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Tell us what we could do to earn your return..."
                className="w-full ml-7 rounded-xl bg-(--panel-soft) border border-white/10 px-4 py-3 text-sm text-(--foreground) placeholder:text-(--muted) focus:border-(--accent) focus:outline-none transition-colors"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Important Notice */}
        <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-4">
          <p className="text-sm text-(--muted)">
            <strong>Important:</strong> Your subscription will be marked as cancelled immediately, but you'll retain access to ChatView for 30 days from the cancellation date. After 30 days, your access will be revoked.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-(--foreground) hover:border-(--accent) hover:bg-(--panel-soft) transition-colors disabled:opacity-50"
          >
            Keep Subscription
          </button>
          <button
            type="submit"
            disabled={loading || !reason}
            className="flex-1 rounded-xl bg-red-500/20 border border-red-500/50 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Cancelling..." : "Cancel Subscription"}
          </button>
        </div>
      </form>
    </section>
  );
}
