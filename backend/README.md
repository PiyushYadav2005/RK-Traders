# RK Traders — Backend API

Express + MongoDB REST API for the RK Traders website.

## Setup

```bash
npm install
cp .env.example .env      # then edit .env — see below
npm run seed               # populates categories + ~24 sample products
npm run dev                 # http://localhost:5000
```

### Getting a MongoDB connection string

You need a running MongoDB instance. Two easy options:

1. **Local**: install MongoDB Community Server, then use the default
   `MONGO_URI=mongodb://127.0.0.1:27017/rk-traders` in `.env`.
2. **Free cloud (no local install)**: create a free cluster at
   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register), get the
   connection string from "Connect → Drivers", and paste it into
   `MONGO_URI` in `.env`.

## API Reference

Base URL: `http://localhost:5000/api`

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | – | `{ name, email, password, phone }` → `{ token, user }` |
| POST | `/auth/login` | – | `{ email, password }` → `{ token, user }` |
| GET | `/auth/me` | Bearer | Current user |

### Categories
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/categories` | – | List active categories |
| GET | `/categories/:slug` | – | Single category |
| POST | `/categories` | admin | Create |
| PUT | `/categories/:id` | admin | Update |
| DELETE | `/categories/:id` | admin | Delete |

### Products
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/products` | – | List with filters — see query params below |
| GET | `/products/featured` | – | Up to 8 featured products |
| GET | `/products/:slug` | – | Single product |
| POST | `/products` | admin | Create |
| PUT | `/products/:id` | admin | Update |
| DELETE | `/products/:id` | admin | Delete |

`GET /products` query params: `category` (slug), `search`, `brand`,
`minPrice`, `maxPrice`, `inStock` (`true`/`false`), `sort`
(`newest`\|`price_asc`\|`price_desc`\|`rating`\|`name_asc`), `page`, `limit`.

### Orders (guest checkout — no login required)
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/orders/guest` | – | Places an order. Body: `{ customer: { name, phone, email? }, shippingAddress: { line1, city, state, pincode }, items: [{ productId, quantity }], paymentMethod, notes? }` |
| GET | `/orders/:orderNumber` | – | Order status lookup |
| GET | `/orders` | admin | All orders (`?status=placed`) |
| PATCH | `/orders/:id/status` | admin | Update status |

Pricing is always recalculated server-side from the live `Product` record —
the client-sent price is ignored, so it can't be tampered with. Wholesale
pricing kicks in automatically once quantity meets `minWholesaleQty`.
A guest "account" is created/matched by phone number so repeat customers
build order history without a real signup flow.

### Enquiries (Contact page form)
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/enquiries` | – | `{ name, phone, message }` |
| GET | `/enquiries` | admin | All enquiries (`?status=new`) |

Both `orders/guest` and `enquiries` trigger best-effort email + WhatsApp
notifications to the business (see "Order/enquiry notifications" below) —
creation never fails just because notifications aren't configured.

### Dealers (wholesale registration)
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/dealers` | user | Submit dealer application |
| GET | `/dealers/me` | user | Your own application status |
| GET | `/dealers` | admin | List applications (`?status=pending`) |
| PATCH | `/dealers/:id/status` | admin | Approve/reject |

## Architecture notes

- **Auth**: JWT in `Authorization: Bearer <token>` header. Password hashing
  via bcrypt in a Mongoose `pre('save')` hook.
- **Roles**: `customer` (default) → `dealer` (after admin approval) →
  `admin`. `authorize('admin')` middleware guards write routes.
- **Pricing model**: every product carries both `retailPrice` and
  `wholesalePrice`, with a `minWholesaleQty` threshold — the frontend decides
  which to charge based on order quantity.
- **Error handling**: controllers throw `ApiError(statusCode, message)`;
  a single `errorHandler` middleware normalizes Mongoose cast/validation/
  duplicate-key errors and JWT errors into consistent JSON responses.
- **Security**: helmet, CORS locked to `CLIENT_URL`, rate limiting on `/api`,
  input goes through Mongoose schema validation (add `express-validator`
  chains per-route if you want request-shape validation before it hits the DB).

## Order/enquiry notifications

All optional — the site works fully without any of this configured.

- **Email**: set `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`/`SMTP_FROM`
  and `BUSINESS_EMAIL` in `.env`. For Gmail, use an
  [App Password](https://myaccount.google.com/apppasswords), not your normal
  password (requires 2FA enabled first).
- **WhatsApp**: there is no free way for a server to send WhatsApp messages.
  Set `TWILIO_ACCOUNT_SID`/`TWILIO_AUTH_TOKEN`/`TWILIO_WHATSAPP_FROM` (from
  [twilio.com/console](https://console.twilio.com), after enabling WhatsApp
  sender access — has a small per-message cost) and `BUSINESS_WHATSAPP`
  (digits only, e.g. `919335912637`). Without these, every order/enquiry
  still succeeds — WhatsApp sending is just skipped and logged instead of
  silently pretending to work.

## Not yet built

- Razorpay payment capture (COD works fully; online payment does not yet)
- Image upload (Cloudinary/Multer) — products currently take image URLs directly
- Admin analytics/reporting endpoints
