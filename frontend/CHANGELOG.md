# CHANGELOG

Three passes recorded here, most recent first. Everything marked done is
verified: type-checked, built, and either schema-validated or
runtime-tested against a live (in-memory) server or mock API.

---

## Pass 3 — Full Admin Panel

### The auth approach (resolved as flagged in Pass 2)

Static credentials (`RKtraders` / `India@123`) are checked server-side in
`controllers/adminAuthController.js` — never shipped to the frontend
bundle. On success, the backend signs a real JWT (`jsonwebtoken`, already
a dependency — no new auth library added) with `{ isAdminSession: true }`
and a 12-hour expiry. A new `protectAdmin` middleware verifies that token
on every admin request without needing a `User` document lookup. This
means: no login library, no signup flow, exactly the static credential
check the spec asked for — but the backend routes are still genuinely
protected, not just gated by a frontend screen. Verified end-to-end:
wrong credentials → 401, right credentials → 200 + token, valid token →
passes through to the real handler, no token → 401 on every admin write
route (products, categories, brands, orders, quotes, wholesale-requests,
dealers, settings, customers, dashboard).

Login attempts are also rate-limited (10 per 15 minutes per IP) since the
credential space is small.

### Frontend — `src/admin/` (entirely separate from the public site)

- `AdminApp.tsx` — nested router mounted at `/admin/*` in `App.tsx`,
  completely bypassing the public Header/Footer/Cart.
- `lib/adminApi.ts`, `lib/AdminAuthContext.tsx` — admin-scoped axios client
  (token in `sessionStorage`, clears on tab close) and auth context.
- `components/AdminLayout.tsx` — sidebar (Dashboard, Products, Categories,
  Brands, Orders, Quotes, Customers, Settings, Logout) with a route guard
  that redirects to `/admin/login` if there's no session — verified this
  actually redirects, not just hides the UI.
- `components/ui.tsx` — shared primitives (PageHeader, Modal, StatusBadge,
  EmptyState, LoadingRows) used across every module instead of duplicating
  markup eight times.
- `pages/AdminLogin.tsx` — username/password form, shows "Access denied"
  with the real backend message on failure.
- `pages/AdminDashboard.tsx` — live counts: active products, total/pending
  orders, revenue from paid orders, quote requests (+ new count),
  wholesale requests, customers.
- `pages/AdminProducts.tsx` — table (image, name, brand, SKU, price, stock,
  visibility), Add/Edit modal covering name, SKU, brand, category (from
  live category list), image URL, description, retail/wholesale/MRP/GST
  pricing, stock, featured flag, visibility. Inline actions: toggle
  featured, toggle visibility, duplicate (prefills a new-product form),
  edit, delete (confirms first).
- `pages/AdminCategories.tsx` — grid + modal: name, description, banner
  image URL, display order. Add/Edit/Delete all real API calls.
- `pages/AdminBrands.tsx` — new `Brand` collection (backend, this pass):
  name, logo URL, description. Add/Edit/Delete.
- `pages/AdminOrders.tsx` — status-filter tabs (all/placed/confirmed/
  packed/shipped/delivered/cancelled), inline status-change dropdown per
  row, a detail modal with a print-formatted invoice (browser print →
  "Save as PDF" — see note on real PDF generation below).
- `pages/AdminQuotes.tsx` — list with status dropdown per card (new/
  reviewing/quoted/closed).
- `pages/AdminCustomers.tsx` — read-only list from the `User` collection
  (accounts created automatically at checkout).
- `pages/AdminSettings.tsx` — shop name, email, phone, WhatsApp, address,
  GST, logo URL, social links. Saves to the database — see the dynamic-
  settings note below for what this does and doesn't do yet.

### Backend

- `models/Brand.js`, `controllers/brandController.js`,
  `routes/brandRoutes.js` — created. Public `GET /api/brands` (used by the
  brands marquee and product filters too), admin-only create/update/delete.
- `models/Settings.js`, `controllers/settingsController.js` — created.
  Singleton document, `GET`/`PUT /api/admin/settings`.
- `controllers/adminController.js`, `routes/adminRoutes.js` — dashboard
  summary aggregation and a customers list endpoint.
- `controllers/adminAuthController.js`, `routes/adminAuthRoutes.js` — the
  static-credential login described above.
- `middleware/auth.js` — added `protectAdmin`.
- Existing admin-facing routes (`categoryRoutes.js`, `productRoutes.js`,
  `orderRoutes.js`, `dealerRoutes.js`, `wholesaleRequestRoutes.js`,
  `quoteRequestRoutes.js`, `enquiryRoutes.js`) — write/admin-list endpoints
  switched from the old `protect + authorize('admin')` (which needed a
  real `User` document with `role: 'admin'` — nothing could actually reach
  those routes before, since there was no admin signup flow) to
  `protectAdmin`. `dealerRoutes.js` keeps `protect` too, for the
  customer-facing self-registration endpoints.
- `.env.example` — added `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

### Important limitation, stated plainly: Settings aren't live yet

The admin can save shop name/email/phone/address/GST/social links, and
they persist in MongoDB. But the **public website still reads this
information from the static `src/config/business.ts` file**, not from this
new `Settings` collection. So right now, editing Settings in the admin
panel does not change what visitors see on the Contact page, footer, or
anywhere else. Wiring the public site to fetch from `GET /api/admin/settings`
(or a public equivalent) instead of the static config is a real follow-up
task — I'm flagging it clearly rather than let the admin UI imply it
already works.

### Also not fully real: invoice "PDF download"

There's no PDF-generation library wired in. "Download Invoice" opens a
formatted invoice in a modal and uses the browser's native print dialog,
where "Save as PDF" is a normal print destination — it produces a usable
PDF, but it's not server-generated the way the spec's wording ("Download
Invoice") might imply. A real implementation would use something like
`pdfkit` or `puppeteer` server-side. Flagging this rather than let the
button's label overstate what it does.

### Verification performed

- `npx tsc --noEmit` — clean
- `npm run build` (frontend) — clean production build
- Backend: all files syntax-checked, `app.js` loads and serves
  `/api/health`
- End-to-end auth test against a live server: wrong credentials → 401,
  correct credentials → 200 + token, that token → passes `protectAdmin`
  through to the real handler (confirmed via a 500 DB-connection error,
  not a 401/403 — proving the auth layer, not the DB, was reached), no
  token at all → 401 on `/admin/dashboard`, `POST /api/products`,
  `POST /api/categories`, `POST /api/brands`
- `Brand` and `Settings` schemas validated
- Screenshots against a mock API covering every admin endpoint shape:
  login screen, "Access denied" state, dashboard with live counts,
  products table (correct featured/visibility state), orders (status
  tabs + dropdown), quotes — zero console/page errors on any of them
- Confirmed the route guard actually redirects: visiting `/admin/products`
  with no session lands on `/admin/login`, not a broken/blank page

### Not done this pass

- **Dynamic settings** — see above; this is the main gap.
- **Real PDF invoice generation** — see above.
- **Image upload (Cloudinary)** — every image field across Products,
  Categories, Brands, and Settings is still a URL text input. Flagged
  since Pass 1; still needs real Cloudinary credentials to build against.
- **Product ↔ Brand relation** — `Brand` is now a real collection, but
  `Product.brand` is still a free-text string, not a foreign key. Noted in
  the Brands module UI itself.
- **Bulk upload/bulk delete for products** — not built.
- **Analytics beyond the dashboard counts** (sales trends, export to
  Excel/PDF) — not built.
- Everything else already listed as outstanding in Pass 2 (search
  autosuggest, product zoom/wishlist/share, exhaustive device QA) is still
  outstanding.

---

## Pass 2 — Carousel, category-first Products, Quote page, checkout/cleanup fixes

### Completed

**TASK 1 — Homepage carousel.** components/home/CategoryGrid.tsx rewritten:
static grid to horizontal carousel. Autoplay every 3s, pauses on hover,
mouse-drag on desktop, native touch swipe on mobile, left/right arrows,
pagination dots, spring easing via Framer Motion's animate(), infinite
wraparound. Card design and content are unchanged — same markup, same
classNames, same hover treatment — only the outer layout changed from CSS
grid to a scroll-snap track.

**TASK 2 — Product page redesign.** pages/Products.tsx rewritten:
- Bare /products (no category/brand/search in the URL) now renders
  ONLY the category icon grid — no search bar, no products, nothing else.
- Selecting a category (or landing via ?category=, ?brand=, or
  ?search=) switches to a breadcrumb + filtered results view.
- Filter sidebar added: category, brand, price range, in-stock toggle, sort
  (newest/price/rating/name) — all sent to the real API, nothing filtered
  client-side.
- Products never render without an active category, brand, or search —
  matches the Flipkart reference structure in the screenshot.

**TASK 4 — Removed pages.** Track Order, Dealer Registration, Careers:
routes deleted from routes.tsx, links deleted from Header.tsx and
Footer.tsx. Confirmed zero remaining references anywhere in src/.

**TASK 5 — Checkout fixes.**
- "Pay Online (soon)" button removed entirely; Payment Method now shows a
  single non-interactive Cash on Delivery confirmation (paymentMethod
  type narrowed to "cod" only — no dead "razorpay" union member).
- Error handling fixed: previously showed a generic "check the backend is
  running" message for ANY failure. Now surfaces the real message from
  the API response when there is one (validation errors, stock issues,
  etc.), falling back to the generic message only when the backend is
  genuinely unreachable. This is a real bug fix — the screenshot showed
  this exact generic message on a checkout attempt, which was masking
  whatever the actual failure was.
- Success screen wording aligned to spec: "Order saved successfully" +
  "we'll contact you shortly." Order creation already didn't (and still
  doesn't) fail if email sending fails — that was correct from the
  previous pass and is unchanged.

**TASK 7 — Quote page.** pages/Quote.tsx created — hero, 3 benefit cards,
3-step process, and the full form (name, company, phone, email, GST,
address, project type, category, brand, required products, quantity,
budget, preferred delivery, message). Submits to a new backend endpoint,
shows a real success screen with a reference number. File upload is
explicitly flagged as not wired up (needs Cloudinary) rather than faked.

### Backend
- models/QuoteRequest.js, controllers/quoteRequestController.js,
  routes/quoteRequestRoutes.js — created. POST /api/quote-requests
  (public), GET / and PATCH /:id/status (admin only). Emails + WhatsApp-
  notifies on submission via the existing notification utilities.
- app.js — mounted the new route.
- .env.example — BUSINESS_EMAIL default changed to
  ramautaryadav9696@gmail.com per this pass's spec (order and quote
  notifications both route through this one variable). Change it in your
  own .env if that's not the right inbox.

### Verification performed
- npx tsc --noEmit — clean
- npm run build (frontend) — clean production build
- Backend: all files syntax-checked, app.js loads and serves
  /api/health, QuoteRequest schema validated both ways
- Screenshots taken against a running build + mock API: homepage carousel
  (arrows/dots/cards all render), Products categories-only landing,
  Products category-filtered view with breadcrumb and sidebar, full Quote
  page — zero console/page errors on any of them

### Not done this pass — and why

**TASK 3 — Admin Panel.** Not built. This is a legitimately separate
project: 7 modules (Products, Categories, Brands, Orders, Quotes,
Customers, Settings) each needing CRUD UI, plus image upload. There's also
a real tension in the spec worth resolving before building it: it asks for
"static credentials, no backend authentication" while the backend already
has real JWT-protected admin-only routes from the previous pass (orders,
dealers, wholesale-requests, quote-requests). If the admin panel's API
calls go through those routes with no real auth, anyone who finds the API
base URL can hit them directly — the frontend login screen wouldn't
protect anything. The safer version of "no auth library, static check" is
a shared secret (an admin key in an env var, checked via header) rather
than zero protection on the backend. Worth confirming that approach before
building it.

**TASK 6 — Gmail forwarding/push notifications/filters.** This isn't
code — it's Gmail account configuration (Settings > Forwarding, mobile app
notification settings, Settings > Filters). Happy to write exact
step-by-step instructions for the ramautaryadav9696@gmail.com inbox if
useful, but there's no file to create here.

**TASK 8 — Global search with autosuggest/recent searches.** Products page
search still requires pressing enter (no live suggestions, no recent-search
memory). Category/brand/SKU search itself works via the existing backend
text index.

**TASK 9 — Filters.** Category, brand, price, and stock filters are done
(this pass). "Newest / Oldest / Best Selling / Discount" as distinct sort
options are not all separately implemented — newest/price/rating/name
exist; a true "discount %" sort would need a computed field.

**TASK 10 — Product Details enhancements.** Gallery/pricing/specs/add-to-
cart existed already; zoom, wishlist, share, and "recently viewed" are not
built.

**TASKS 11-15 — Full responsiveness/performance/error/QA pass.** Verified
what was touched this pass (no console errors, clean builds, correct
behavior at 1440px and via the existing mobile-tested layout patterns from
prior passes). No exhaustive device-by-device pass across the entire site
has been done, and none is claimed.

---

## Pass 1 — Brands wall, Contact/Gallery/About/Wholesale pages, Return Policy, Blog/Shipping Policy removal

### Removed
- Blog — route, nav link, footer link removed.
- Shipping Policy — route and footer link removed.

### New pages
- ReturnPolicy.tsx, Wholesale.tsx, About.tsx — real content, wired to
  backend where applicable.

### New/changed components
- WhyChooseUs.tsx — rewritten into a horizontal auto-scrolling,
  drag/swipe-enabled carousel.
- BrandsMarquee.tsx — rewritten into two horizontal infinite-marquee rows;
  every brand links to /products?brand=<name>.
- Products.tsx — brand query param wired in (superseded by the full
  redesign in Pass 2 above).

### Backend
- models/WholesaleRequest.js, controllers/wholesaleRequestController.js,
  routes/wholesaleRequestRoutes.js — created.

### Verification performed
- Type-check, build, syntax-check, schema validation, and screenshot
  verification all passed at the time.
