# ChatView Web Platform - Subscription & Payment System

## Overview

The subscription payment system allows users to:
1. **Create subscriptions** - Choose from available plans (Free, Standard, Team)
2. **Make payments** - Checkout via Dodo Payments integration
3. **Cancel subscriptions** - With 30-day grace period + cancellation reason feedback
4. **Access management** - Database tracks subscription status and access expiry

## Key Features

### 1. Subscription Lifecycle

```
Free Plan (Default)
    ↓
User clicks "Choose Standard" → Initiates Subscription (pending)
    ↓
User completes Dodo payment → Subscription activated (active)
    ↓
User has access until next_payment_date
    ↓
User clicks "Cancel" → Subscription marked as cancelled
    ↓
User KEEPS access for 30 days from cancellation (access_expires_at)
    ↓
After 30 days → Access revoked
```

### 2. Database Schema

#### Subscription Model Fields
- `id` - UUID identifier
- `user` - Foreign key to auth user
- `plan` - Foreign key to SubscriptionPlan
- `status` - One of: pending, active, cancelled, paused, failed
- `start_date` - When subscription became active
- `next_payment_date` - When next payment is due
- `cancelled_at` - When user cancelled
- `access_expires_at` - **NEW** - When user loses access (30 days after cancel)
- `payment_provider` - 'dodo' or 'paypal'
- Dodo fields: `dodo_subscription_id`, `dodo_customer_id`, `dodo_session_id`
- Grace period fields: `grace_period_start`, `grace_period_days`

#### SubscriptionCancellationReason Model (NEW)
- `id` - UUID identifier
- `subscription` - OneToOne relationship to Subscription
- `reason` - Why user is cancelling (enum with 7 options)
- `additional_feedback` - Free text feedback
- `would_return` - Boolean: Would user consider returning?
- `return_reason` - What would make them return?
- `created_at` - Timestamp
- `updated_at` - Timestamp

**Reason Options:**
- `too_expensive` - Too Expensive
- `insufficient_features` - Insufficient Features
- `not_using` - Not Using It
- `switching_providers` - Switching to Another Provider
- `technical_issues` - Technical Issues
- `poor_support` - Poor Customer Support
- `other` - Other

### 3. API Endpoints

#### Get Current Subscription
```
GET /api/chatview/subscription/current
Response: { subscription: { ... } }
```

**Subscription Object Fields (including new ones):**
```json
{
  "id": "uuid",
  "status": "active|cancelled|pending|paused|failed",
  "is_active": true,
  "is_cancelled": false,
  "has_access": true,  // NEW - True if active or within 30-day grace
  "days_until_access_expires": 15,  // NEW - Days remaining
  "plan": {
    "name": "standard",
    "display_name": "Standard",
    "price": "19.00"
  },
  "start_date": "2026-04-02T00:00:00Z",
  "next_payment_date": "2026-05-02",
  "cancelled_at": null,
  "access_expires_at": null,  // NEW - 30 days after cancel
  "created_at": "2026-04-02T00:00:00Z",
  "updated_at": "2026-04-02T00:00:00Z"
}
```

#### Get Available Plans
```
GET /api/chatview/subscription/plans
Response: { plans: [{ name, display_name, price, description, features }] }
```

#### Initiate Subscription
```
POST /api/chatview/subscription/initiate/
Body: { plan: "standard", payment_provider: "dodo" }
Response: { 
  subscription_id: "uuid",
  status: "pending",
  checkout_url: "https://..." // Dodo checkout URL
}
```

#### Cancel Subscription (NEW - WITH REASON)
```
POST /api/chatview/subscription/cancel/
Body: {
  reason: "too_expensive",           // Required
  additional_feedback: "...",        // Optional
  would_return: true,                // Optional
  return_reason: "..."               // Optional
}
Response: {
  message: "Subscription cancelled successfully",
  cancellation_reason: {
    id: "uuid",
    reason: "too_expensive",
    additional_feedback: "...",
    would_return: true,
    return_reason: "...",
    created_at: "..."
  },
  access_expires_at: "2026-05-02T00:00:00Z"  // 30 days from now
}
```

**Database updates on cancel:**
1. `subscription.status` → 'cancelled'
2. `subscription.cancelled_at` → NOW
3. `subscription.access_expires_at` → NOW + 30 days
4. `subscription_cancellation_reason` → NEW record created with feedback

## Frontend Components

### SubscriptionManager (Main container)
- Location: `src/components/subscription/SubscriptionManager.tsx`
- Manages state and API calls
- Routes between different views based on subscription status

### SubscriptionStatus (Active subscription view)
- Location: `src/components/subscription/SubscriptionStatus.tsx`
- Shows current plan, next payment date
- For cancelled subscriptions: shows access expiry, days remaining
- Cancel button for active subscriptions

### CancellationForm (Cancel flow)
- Location: `src/components/subscription/CancellationForm.tsx`
- Radio buttons for predefined reasons
- Optional text area for additional feedback
- Checkbox: "Would the user consider returning?"
- If yes: Optional "What would bring you back?" text field
- Important notice about 30-day grace period

### PlanSelector (No subscription view)
- Location: `src/components/subscription/PlanSelector.tsx`
- Shows available plans (Standard highlighted)
- Team plan shows "Coming Soon"
- "Choose Standard" button initiates checkout

## Pages Updated

### Pricing Page
- **File**: `src/app/pricing/page.tsx`
- Now uses `<SubscriptionManager />` component
- Replaces static plan list with dynamic, interactive manager

### Account Page
- **File**: `src/app/account/page.tsx`
- Displays user profile info
- Includes `<SubscriptionManager />` for subscription management
- Shows current subscription status alongside user info

## API Routes (Web Platform)

### New/Updated Routes
```
GET  /api/chatview/subscription/current
GET  /api/chatview/subscription/plans
POST /api/chatview/subscription/initiate
POST /api/chatview/subscription/cancel (New)
```

**Cancel route:**
- File: `src/app/api/chatview/subscription/cancel/route.ts`
- Proxies to backend at `/app/subscription/cancel/`
- Accepts POST with cancellation reason data
- Returns cancellation confirmation

## Backend Updates

### Models
- **Subscription** - Added `access_expires_at` field
- **SubscriptionCancellationReason** - NEW model

### Serializers
- **SubscriptionSerializer** - Added `has_access`, `days_until_access_expires`, `access_expires_at`
- **SubscriptionCancellationReasonSerializer** - NEW
- **SubscriptionCancelSerializer** - NEW (validates cancel request)

### Views
- **CancelSubscriptionView** - Updated to:
  - Accept and validate cancellation reason data
  - Create SubscriptionCancellationReason record
  - Set `access_expires_at` to 30 days from now
  - Return cancellation details

### Models & Properties
- **Subscription.has_access** - Property: True if active OR (cancelled AND within access_expires_at)
- **Subscription.cancel_local()** - Method: Sets status='cancelled', cancelled_at=NOW, access_expires_at=NOW+30d

## Testing the Payment System

### 1. View Available Plans
```bash
# Visit the pricing page (no auth required to view)
curl http://localhost/pricing

# Or call the API
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost/api/chatview/subscription/plans
```

### 2. Create a Subscription
```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan": "standard", "payment_provider": "dodo"}' \
  http://localhost/api/chatview/subscription/initiate
```

### 3. Check Current Subscription
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost/api/chatview/subscription/current
```

**Response example (active subscription):**
```json
{
  "subscription": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "active",
    "is_active": true,
    "is_cancelled": false,
    "has_access": true,
    "days_until_access_expires": null,
    "plan": {
      "name": "standard",
      "display_name": "Standard",
      "price": "19.00"
    },
    "start_date": "2026-04-02T12:00:00Z",
    "next_payment_date": "2026-05-02",
    "access_expires_at": null
  }
}
```

### 4. Cancel Subscription
```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "too_expensive",
    "additional_feedback": "I found a cheaper alternative",
    "would_return": true,
    "return_reason": "If you reduce the price to $9/month"
  }' \
  http://localhost/api/chatview/subscription/cancel
```

**Response example:**
```json
{
  "message": "Subscription cancelled successfully",
  "cancellation_reason": {
    "reason": "too_expensive",
    "additional_feedback": "I found a cheaper alternative",
    "would_return": true,
    "return_reason": "If you reduce the price to $9/month"
  },
  "access_expires_at": "2026-05-02T12:00:00Z"
}
```

### 5. Check Cancelled Subscription
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost/api/chatview/subscription/current
```

**Response example (cancelled, still has access):**
```json
{
  "subscription": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "cancelled",
    "is_active": false,
    "is_cancelled": true,
    "has_access": true,
    "days_until_access_expires": 30,
    "plan": {
      "name": "standard",
      "display_name": "Standard",
      "price": "19.00"
    },
    "cancelled_at": "2026-04-02T14:00:00Z",
    "access_expires_at": "2026-05-02T14:00:00Z"
  }
}
```

## User Journey

### Journey 1: Free → Paid Subscription
1. User visits `/pricing` page
2. Sees "Choose Standard" button
3. Clicks button → `SubscriptionManager` calls `POST /api/chatview/subscription/initiate`
4. Receives `checkout_url` from Dodo
5. Redirected to Dodo payment page
6. Completes payment
7. Dodo webhook triggers → `subscription.status = 'active'`
8. Returns to ChatView with active subscription
9. User sees "Cancel Subscription" button

### Journey 2: Cancel with Grace Period
1. User clicks "Cancel Subscription"
2. `CancellationForm` opens with reasons and feedback fields
3. User selects reason + optional feedback
4. Submits form → `POST /api/chatview/subscription/cancel`
5. Backend:
   - Sets `subscription.status = 'cancelled'`
   - Sets `subscription.access_expires_at = NOW + 30 days`
   - Creates `SubscriptionCancellationReason` record
6. User sees "You have 30 days of access remaining"
7. UI shows countdown: "Access expires on May 02, 2026"

### Journey 3: Grace Period Expires
1. After 30 days, `access_expires_at` < NOW
2. System and UI check `has_access` property
3. `has_access` returns False → Access revoked
4. User sees "Your access has ended" message
5. "Renew Subscription" button appears

## Database Migration

No SQL migrations needed! MongoDB auto-creates collections. When the code runs:
1. `SubscriptionCancellationReason` collection auto-created on first write
2. `Subscription` collection gets new `access_expires_at` field automatically
3. Existing documents can have null values for new fields

## Integration with Dodo Payments

The system integrates with Dodo Payments through:

1. **Initiate checkout**:
   - Backend calls `DodoConfig.get_product_id()` 
   - Gets test/prod Product ID based on environment
   - Creates Dodo session with product
   - Returns checkout URL

2. **Webhook handling**:
   - Dodo sends `subscription.active` event
   - Backend updates `Subscription.status = 'active'`
   - Sets `start_date` and `next_payment_date`

3. **Environment switching**:
   - Set `DODO_ENVIRONMENT=test` for testing
   - Set `DODO_ENVIRONMENT=production` for live

## Security Considerations

1. **Authentication required** on all subscription endpoints
2. **Only user's own subscriptions** can be cancelled/modified
3. **Cancellation reasons stored** with timestamps for audit trail
4. **No payment refunds** handled in this system (external process)
5. **30-day access window** enforced server-side via `has_access` property

## Future Enhancements

1. **Pause/Resume** - Users can pause subscriptions
2. **Plan upgrades** - Switch between plans without full cancellation
3. **Proration** - Handle partial month payment/refund
4. **Analytics** - Export cancellation reasons CSV for business insights
5. **Win-back emails** - Automatic emails to users with "would_return" feedback
6. **Payment retry** - Automatic retry on failed payments (with webhook tracking)
7. **Annual billing** - Offer discounted yearly plans
8. **Multiple billing methods** - Support multiple payment providers
