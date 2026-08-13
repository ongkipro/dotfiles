# Public Frontend UX Patterns

This reference defines the behavioral and state requirements for high-conversion public frontends across e-commerce, travel, and direct-response landing pages. Use these patterns to ensure robust interactions, state recovery, and accessible commerce journeys.

## 1. E-commerce Storefronts (Next Commerce / Shopify Dawn Patterns)

### Catalog Grid & Product Filtering Matrix
- **State Preservation:** URL-addressable state is mandatory for search queries, sort orders, and active filters. A page reload must restore the exact grid state.
- **Filter Application:** Apply filters optimistically with debouncing. If the backend is slow, show a localized loading skeleton within the grid rather than a full-page spinner.
- **Empty States:** When a filter combination yields zero results, do not show a blank page. Offer an immediate "Clear Filters" action and display related categories or popular products.
- **Pagination vs. Infinite Scroll:** Prefer explicit "Load More" buttons or cursor-based pagination over infinite scroll to allow users to reach the footer and maintain a sense of position.

### Variant Matrix Picker
- **Availability State:** Visually distinguish available, out-of-stock, and non-existent variant combinations. 
- **Selection Logic:** Do not hide out-of-stock variants; disable them or mark them clearly. If a user selects a size that is unavailable in the currently selected color, auto-select the nearest available color or visually prompt the user to resolve the conflict.
- **Price Updates:** Re-render the price immediately when a variant changes. If the price differs by variant, never hide this transition.

### Reactive Cart Drawer
- **Immediate Feedback:** Opening the cart must not require a page load. Use a slide-out drawer or a modal.
- **Editable Preview:** Allow users to update quantities and remove items directly in the drawer. Debounce quantity updates to the backend to prevent race conditions.
- **Thresholds:** Clearly display progress toward free shipping or promotional thresholds (e.g., "Add $15 more for free shipping").
- **Cart State:** Sync cart state across browser tabs. If an item becomes out-of-stock while in the cart, display a clear inline error message in the drawer.

### Micro-interactions & Checkout Handoff
- **Add-to-Cart Feedback:** Provide undeniable visual feedback when an item is added (e.g., button state changes to "Added!", cart icon bumps, drawer opens).
- **Handoff:** The transition from cart to checkout must clearly transfer the finalized totals, discounts, and inventory reservations. Do not imply the order is complete until the backend confirms payment success.

---

## 2. Travel & Booking Portals

### Multi-step Search Matrix (Dates, Guests, Locations)
- **Progressive Disclosure:** Expose the search matrix sequentially. Ask for location, then dates, then guests. Auto-advance focus to the next logical input to reduce clicks.
- **Input Forgiveness:** Handle typos in location search gracefully. Use a predictive autocomplete dropdown powered by a robust backend.

### Interactive Availability Calendars
- **Visual Cues:** Block out unavailable dates completely. Use clear indicators for high-demand or premium-priced days if dynamic pricing is active.
- **Range Selection:** Support intuitive click-and-drag or two-click (start, end) range selection. Ensure touch targets on mobile are at least 44px by 44px to prevent fat-finger errors.

### Pricing Breakdowns
- **No Surprises:** Break down costs (base rate, taxes, cleaning fees, service fees) as early as the search results page. 
- **Sticky Totals:** When scrolling through a long property description, keep the total price and "Book Now" CTA sticky on the screen (desktop sidebar or mobile bottom bar).

### Dynamic Itinerary Cards & Booking Confirmation
- **Card Anatomy:** Itinerary cards must prioritize dates, primary location, and status (Upcoming, Past, Canceled).
- **Confirmation State:** The final booking confirmation must display a clear reservation number, next steps (e.g., "Check your email"), and immediate actions (e.g., "Add to Calendar").

---

## 3. Landing Pages & Portals

### Above-the-fold Hero Hierarchy
- **Primary Action:** Only one primary CTA per hero. If a secondary action is needed (e.g., "Watch Video"), style it as a ghost button or text link.
- **State Flow:** If the hero CTA triggers a form or a modal, ensure focus shifts immediately to the first input of that form.

### Interactive Pricing Calculators
- **Instant Recalculation:** Sliders or toggles (e.g., Monthly vs. Annual) must instantly update the displayed price without a page reload.
- **Value Visualization:** As the user adjusts the calculator, dynamically update the listed benefits to reinforce the value of higher tiers.

### AEO/GEO Passage Optimization (AI Search)
- **Answer Box Targeting:** Structure high-value information (FAQs, pricing tiers, core features) in clear, chunked passages (134–167 words) with direct, factual phrasing. 
- **Semantic HTML:** Use `<dl>`, `<ul>`, and hierarchical `<h2>`/`<h3>` tags to make the structure explicitly readable to AI crawlers.

### Micro-animations & Social Proof
- **Trust Indicators:** Load social proof bands (logos, reviews) progressively. If reviews are fetched asynchronously, reserve the layout space to prevent Cumulative Layout Shift (CLS).
- **Interaction Feedback:** Use subtle micro-animations (e.g., a slight scale-up on hover, a checkmark animation on form submit) to acknowledge user input, keeping durations under 200ms.
