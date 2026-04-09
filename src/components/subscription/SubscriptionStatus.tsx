"use client";

type Subscription = {
  id: string;
  status: string;
  is_active: boolean;
  is_cancelled: boolean;
  plan: {
    name: string;
    display_name: string;
    price: string;
  };
  start_date: string | null;
  next_payment_date: string | null;
  access_expires_at: string | null;
  has_access: boolean;
  days_until_access_expires: number | null;
};

type SubscriptionStatusProps = {
  subscription: Subscription;
  onCancelClick: () => void;
  onActivateClick: () => void;
  onDeactivateClick: () => void;
  activating?: boolean;
  deactivating?: boolean;
};

export function SubscriptionStatus({
  subscription,
  onCancelClick,
  onActivateClick,
  onDeactivateClick,
  activating,
  deactivating,
}: SubscriptionStatusProps) {
  const nextPaymentDate = subscription.next_payment_date
    ? new Date(subscription.next_payment_date).toLocaleDateString()
    : "Unknown";

  const accessExpiresDate = subscription.access_expires_at
    ? new Date(subscription.access_expires_at).toLocaleDateString()
    : null;

  const getStatusBadgeClass = () => {
    switch (subscription.status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "cancelled":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "pending":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <section className="glass-panel float-up rounded-3xl p-6 sm:p-10">
      <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Current Plan</p>
      <h2 className="headline-glow mt-3 text-3xl font-bold">
        {subscription.plan.display_name}
      </h2>

      <div className="mt-6 space-y-4">
        <div className="feature-card flex items-center justify-between">
          <div>
            <p className="text-sm text-(--muted)">Status</p>
            <p className="font-semibold capitalize">{subscription.status}</p>
          </div>
          <div
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass()}`}
          >
            {subscription.status}
          </div>
        </div>

        {subscription.is_active && (
          <div className="feature-card">
            <p className="text-sm text-(--muted)">Next Payment</p>
            <p className="font-semibold">{nextPaymentDate}</p>
          </div>
        )}

        {subscription.is_cancelled && subscription.has_access && (
          <div className="feature-card bg-yellow-500/5 border-yellow-500/20">
            <p className="text-sm text-(--muted)">Access Until</p>
            <p className="font-semibold text-yellow-400">{accessExpiresDate}</p>
            <p className="mt-1 text-xs text-(--muted)">
              You have {subscription.days_until_access_expires} days left to use ChatView before your access ends.
            </p>
          </div>
        )}

        {subscription.is_cancelled && !subscription.has_access && (
          <div className="feature-card bg-red-500/5 border-red-500/20">
            <p className="text-sm text-(--muted)">Access Status</p>
            <p className="font-semibold text-red-400">Expired</p>
            <p className="mt-1 text-xs text-(--muted)">
              Your access has ended. Please renew your subscription to continue using ChatView.
            </p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {subscription.status === "pending" && (
            <button
              onClick={onActivateClick}
              disabled={activating}
              className="flex-1 rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-white hover:bg-(--accent)/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {activating ? "Activating..." : "Activate Subscription"}
            </button>
          )}
          {subscription.status === "active" && (
            <>
              <button
                onClick={onDeactivateClick}
                disabled={deactivating}
                className="flex-1 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-2 text-sm font-semibold text-yellow-400 hover:border-yellow-500/40 hover:bg-yellow-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deactivating ? "Deactivating..." : "Deactivate"}
              </button>
              <button
                onClick={onCancelClick}
                className="flex-1 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-semibold text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-colors"
              >
                Cancel Subscription
              </button>
            </>
          )}
          {subscription.is_cancelled && !subscription.has_access && (
            <button className="flex-1 rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-white hover:bg-(--accent)/80 transition-colors">
              Renew Subscription
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
