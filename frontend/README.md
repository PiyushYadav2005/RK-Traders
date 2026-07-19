# RK Traders — Website (Phase 3: Full Catalogue + Guest Checkout)

Enterprise-structured Vite + React + TypeScript frontend for RK Traders,
an electrical wholesale & retail store on Gautam Budh Marg, Lucknow
(owner: Ritesh Agarwal).

## What's built

- **Homepage**: hero, trust counters, "Why RK Traders" (8 feature cards),
  category showcase, a vertically auto-scrolling **Brands wall** (20 brands
  pulled from the shop's business card), wholesale CTA band.
- **Products page** (`/products`): full 30-category icon-grid filter (matches
  the reference layout — Switches, Sockets, Wires, LED Bulbs, Chandeliers,
  MCB, Fans, etc.), text search, sort, pagination, all backed by the real API.
- **Product detail page**: gallery, retail/wholesale price toggle, quantity
  stepper, specs, add-to-cart, WhatsApp enquiry link.
- **Cart flow, fully wired**:
  1. Add to Cart → a toast slides up with **"Go to Cart →"**
  2. Cart page → **Proceed to Checkout**
  3. Checkout form (name, phone, address, city/state/pincode, optional email
     & notes, COD/online toggle) → submits to the real `/api/orders/guest`
     endpoint
  4. Success screen: order number, "we'll contact you within 24 hours," and
     a direct **Call Us** button — matches what you asked for exactly.
- **Contact page**: real form → `/api/enquiries`, address/phone/email/hours,
  embedded Google Map, WhatsApp link. "Coming Soon" placeholder removed.
- **Gallery page**: bento-grid of labeled photo slots (Showroom Floor,
  Product Aisles, Warehouse, Our Team, Delivery Fleet, Lighting Installs) —
  deliberately left as upload slots, not stock photos, since you said you'd
  add your own showroom photography. See "Adding gallery photos" below.
- **FAQ page**: accordion, matches the reference six questions.
- Every remaining page (About, Wholesale, Blog, policies, etc.) is routed
  with a placeholder so navigation never breaks.

## Adding gallery photos

Drop your photos into `public/gallery/` (e.g. `showroom-floor.jpg`), then in
`src/pages/Gallery.tsx` set the matching slot's `src`:

```ts
{ label: "Showroom Floor", src: "/gallery/showroom-floor.jpg", className: "..." }
```

## Running against the backend

Expects the API at `http://localhost:5000/api` by default. To point
elsewhere, copy `.env.local.example` to `.env.local` and set `VITE_API_URL`.

```bash
# terminal 1 — backend
cd rk-traders-backend
npm install && cp .env.example .env
npm run seed     # 30 categories, 60 products
npm run dev

# terminal 2 — frontend
cd rk-traders
npm install
npm run dev       # http://localhost:5173
```

If the backend isn't running: Products shows a clear "couldn't reach the
API" state, and the homepage category section falls back to static data —
nothing fails silently.

## Business info (single source of truth)

Everything — footer, contact page, WhatsApp links, JSON-LD — reads from
`src/config/business.ts`. Update it once, it propagates everywhere:

- **Owner**: Ritesh Agarwal
- **Address**: Shop No. 1, Raj Rani Complex, 102/67 (UGF), Opp. Dr. Yuchin's,
  Gautam Budh Marg, Lucknow – 226018
- **Phone**: +91-93359-12637 / +91-88878-91796
- **Email**: placeholder — replace with a real inbox once you have one

## What "automatically sends WhatsApp" actually requires

Being upfront about this rather than faking it: there's no free way for a
server to send a WhatsApp message on your behalf. The backend is wired for
**Twilio's WhatsApp API** — add `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` /
`TWILIO_WHATSAPP_FROM` to the backend `.env` and it'll auto-send on every
order/enquiry. Without those, the order still succeeds — WhatsApp sending is
just skipped (logged, not faked). See `rk-traders-backend/README.md` for
setup. Email works the same way via SMTP — configure it or it no-ops safely.

## Suggested next steps

1. **Razorpay checkout** — COD works end-to-end now; online payment is the
   remaining piece
2. **Real product photography** — currently Unsplash placeholders per
   category, swap via `rk-traders-backend/src/seed/seed.js`
3. **Wholesale portal + dealer registration UI** — backend routes exist,
   frontend forms don't yet
4. **Admin dashboard** — manage products/orders/enquiries over the existing
   admin-only API routes
5. Remaining static pages (About, Wholesale detail, Blog, policies)
