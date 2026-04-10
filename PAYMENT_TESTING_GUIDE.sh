#!/bin/bash
# Quick Testing Guide for ChatView Payment System
# This script outlines the manual testing flow for the subscription system

echo "========================================="
echo "ChatView Payment System - Testing Guide"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="${API_URL:-http://localhost:8000/app}"
WEB_URL="${WEB_URL:-http://localhost:3000}"
TOKEN="${TOKEN:-}"

echo -e "${BLUE}Step 1: Get Authentication Token${NC}"
echo "You need a valid auth token to test the API."
echo "1. Visit: $WEB_URL/login"
echo "2. Sign in with your account"
echo "3. Copy the token from localStorage (dev tools → Application → localStorage)"
echo ""
echo "Then run:"
echo "  export TOKEN=<your-token>"
echo ""

echo -e "${BLUE}Step 2: Check Available Plans${NC}"
if [ -n "$TOKEN" ]; then
  echo "Fetching plans..."
  curl -s -H "Authorization: Bearer $TOKEN" \
    "$API_URL/subscription/plans/" | jq .
else
  echo -e "${RED}Skip (no token set)${NC}"
fi
echo ""

echo -e "${BLUE}Step 3: Check Current Subscription (should be none)${NC}"
if [ -n "$TOKEN" ]; then
  echo "Fetching current subscription..."
  curl -s -H "Authorization: Bearer $TOKEN" \
    "$API_URL/subscription/" | jq .
else
  echo -e "${RED}Skip (no token set)${NC}"
fi
echo ""

echo -e "${BLUE}Step 4: Initiate Free Plan Subscription${NC}"
echo "This should immediately activate without checkout..."
if [ -n "$TOKEN" ]; then
  curl -s -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"plan": "free", "payment_provider": "dodo"}' \
    "$API_URL/subscription/initiate/" | jq .
else
  echo -e "${RED}Skip (no token set)${NC}"
fi
echo ""

echo -e "${BLUE}Step 5: View Pricing Page (Web)${NC}"
echo "Visit: $WEB_URL/pricing"
echo "You should see:"
echo "  - Standard plan with 'Choose Standard' button"
echo "  - Team plan with 'Coming Soon'"
echo "  - After activating free plan: Your current subscription shown"
echo ""

echo -e "${BLUE}Step 6: Test Standard Plan Checkout${NC}"
echo "1. Visit: $WEB_URL/pricing"
echo "2. Click 'Choose Standard'"
echo "3. You should be redirected to Dodo test checkout"
echo "4. Use test card: 4242 4242 4242 4242"
echo "5. Expiry: Any future date (e.g., 12/25)"
echo "6. CVC: Any 3 digits (e.g., 123)"
echo ""
echo "After payment:"
echo "  Status should change to 'active'"
echo "  Next payment date should be 30 days from now"
echo ""

echo -e "${BLUE}Step 7: Check Subscription After Payment${NC}"
if [ -n "$TOKEN" ]; then
  echo "Fetching subscription after payment..."
  curl -s -H "Authorization: Bearer $TOKEN" \
    "$API_URL/subscription/" | jq '.subscription | {status, is_active, has_access, next_payment_date}'
else
  echo -e "${RED}Skip (no token set)${NC}"
fi
echo ""

echo -e "${BLUE}Step 8: View Account Page${NC}"
echo "Visit: $WEB_URL/account"
echo "You should see:"
echo "  - Your email and name"
echo "  - Current subscription (Standard, active)"
echo "  - 'Cancel Subscription' button"
echo ""

echo -e "${BLUE}Step 9: Test Cancellation with Feedback${NC}"
if [ -n "$TOKEN" ]; then
  echo "Cancelling subscription..."
  curl -s -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "reason": "too_expensive",
      "additional_feedback": "Looking for a cheaper alternative",
      "would_return": true,
      "return_reason": "If price drops to $9/month"
    }' \
    "$API_URL/subscription/cancel/" | jq .
else
  echo -e "${RED}Skip (no token set)${NC}"
fi
echo ""

echo -e "${BLUE}Step 10: Verify 30-Day Grace Period${NC}"
if [ -n "$TOKEN" ]; then
  echo "Fetching subscription after cancellation..."
  curl -s -H "Authorization: Bearer $TOKEN" \
    "$API_URL/subscription/" | jq '.subscription | {status, is_cancelled, has_access, access_expires_at, days_until_access_expires}'
  echo ""
  echo -e "${GREEN}Expected results:${NC}"
  echo "  status: 'cancelled'"
  echo "  is_cancelled: true"
  echo "  has_access: true (should still be true!)"
  echo "  access_expires_at: 30 days from now"
  echo "  days_until_access_expires: 30"
else
  echo -e "${RED}Skip (no token set)${NC}"
fi
echo ""

echo -e "${BLUE}Step 11: View Cancellation Feedback in Admin${NC}"
echo "In Django admin (if access granted):"
echo "  1. Go to: $API_URL/../admin/chatviews/subscriptioncancellationreason/"
echo "  2. You should see the cancellation reason record"
echo "  3. Shows: reason, feedback, would_return, return_reason"
echo ""

echo -e "${BLUE}Step 12: Test UI - Cancellation Form${NC}"
echo "1. Visit: $WEB_URL/account"
echo "2. Click 'Cancel Subscription'"
echo "3. Form should appear with:"
echo "   - 7 predefined reasons (radio buttons)"
echo "   - Optional text area for feedback"
echo "   - Checkbox 'Would return?' with conditional text area"
echo "   - Important notice about 30-day grace period"
echo "   - Buttons: 'Keep Subscription' and 'Cancel Subscription'"
echo ""

echo -e "${BLUE}Step 13: Test UI - After Cancellation${NC}"
echo "1. After successful cancellation:"
echo "   - Form should close"
echo "   - Status changes to 'cancelled'"
echo "   - Yellow warning: 'Access Until: May XX, 2026'"
echo "   - Text: 'You have 30 days left to use ChatView'"
echo ""

echo -e "${BLUE}Step 14: Test Free Tier Access${NC}"
echo "After 30 days (or manually test):"
echo "1. Check subscription status"
echo "2. has_access should be FALSE"
echo "3. UI should show 'Your access has ended'"
echo "4. 'Renew Subscription' button should appear"
echo ""

echo -e "${BLUE}Step 15: Test Renewal from Cancelled${NC}"
echo "1. If subscription is expired (access_expires_at < now)"
echo "2. UI shows 'Renew Subscription' button"
echo "3. Clicking it should restart the flow from Step 4"
echo ""

echo ""
echo -e "${GREEN}Testing Complete!${NC}"
echo ""
echo "Key things to verify:"
echo "  ✓ Free plan activates immediately without checkout"
echo "  ✓ Standard plan redirects to Dodo checkout"
echo "  ✓ After payment, subscription status updates to 'active'"
echo "  ✓ Cancellation form appears with all fields"
echo "  ✓ Cancellation saves reason and sets 30-day access expiry"
echo "  ✓ UI shows 'Access expires' countdown for cancelled subscriptions"
echo "  ✓ Cancellation reason is recorded in database"
echo ""

echo "Additional testing (requires database manipulation):"
echo "  - Manually set access_expires_at to yesterday to test expired access"
echo "  - Test multiple subscriptions per user"
echo "  - Test payment failure webhook (starts grace period)"
echo ""

echo -e "${YELLOW}MongoDB Collections to Check:${NC}"
echo "  db.chatviews_subscription.findOne()"
echo "  db.chatviews_subscriptioncancellationreason.findOne()"
echo ""
