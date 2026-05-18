# Task U4+U5+U8 - Frontend Component Updates

## Task ID: U4+U5+U8
## Agent: frontend-updater

## Summary
Updated three Dragon Street Food frontend components (MenuPage, CheckoutPage, OrderTracking) and the Zustand store to support new features: sticky categories, badges, weight display, sold out, modifier grouping, delivery zones, alcohol warnings, kitchen/courier notes, and new order tracking steps.

## Files Modified
1. **src/lib/store.ts** - Added `isAlcohol` to CartItem, `selectedDeliveryZone`/`setSelectedDeliveryZone` to cart state
2. **src/components/dragon/MenuPage.tsx** - Complete rewrite with sticky categories, 8 badge types, weight display, sold out state, modifier grouping (radio/checkbox), no Asian text
3. **src/components/dragon/CheckoutPage.tsx** - Added delivery zone dropdown, alcohol 18+ warning, kitchen notes, courier notes, free delivery threshold, zone-based fee calculation
4. **src/components/dragon/OrderTracking.tsx** - New 9-step tracking flow with courier stages, PROBLEM status handling, no Asian text

## Key Decisions
- Modifier groups use RadioGroup (pick 1) while extras use Checkbox (pick multiple)
- Delivery fee calculated locally in CheckoutPage using useMemo based on selected zone
- Store's getDeliveryFee returns 0 as fallback since CheckoutPage handles the real calculation
- PROBLEM status in OrderTracking shows a special warning banner instead of progress tracker
- ItemBadges extracted as reusable component for both card and dialog views

## Lint Status: PASSING
## Dev Server: COMPILING SUCCESSFULLY
