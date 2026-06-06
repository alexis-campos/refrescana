# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Refrescana E-Commerce Project

Next.js 15 full-stack e-commerce app for natural and artisanal drinks (Peruvian brand "Refrescaña"). Features a public storefront and a comprehensive admin dashboard.

## Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check (no emit)

npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma db push   # Push schema to MySQL (no migrations)
npx prisma studio    # GUI for the database
```

## Architecture

### Route Structure
- **`src/app/(shop)/`** — Public storefront with its own layout (Navbar, Footer, CartSidebar, Preloader). Routes: `/`, `/productos`, `/productos/[slug]`, `/servicios`, `/nosotros`, `/blog`, `/blog/[slug]`, `/contacto`, `/checkout`.
- **`src/app/admin/`** — Admin dashboard with separate layout. Routes: `/admin`, `/admin/orders`, `/admin/orders/[id]`, `/admin/products`, `/admin/categories`, `/admin/blog`, `/admin/login`.
- **`src/app/api/`** — API routes split into `admin/*` (all protected by `getServerSession`) and public `checkout/*`.

### Auth & Security
- NextAuth with JWT strategy, `CredentialsProvider`, bcrypt passwords. Session includes `role` and `id`.
- `src/middleware.ts` protects all `/admin/*` routes — redirects unauthenticated users to `/admin/login`.
- Admin API routes check `session.user.role` against `ADMIN` or `SALES`; use `getServerSession(authOptions)` from `src/lib/auth.ts`.
- Checkout GET (`/api/checkout/[orderId]`) requires `?email=` query param to prevent order enumeration.

### Checkout Flow
1. `POST /api/checkout` — validates stock, creates `Order` + `OrderItem`s in a Prisma transaction, decrements stock, generates `receiptNumber` (format `RF-0001`), creates a `Notification`.
2. `POST /api/checkout/upload-voucher` — attaches Yape voucher image to existing order, sets status to `PAYMENT_UPLOADED`.
3. `GET /api/checkout/[orderId]` — returns order details (requires customer email as `?email=`).
4. Client side uses `useCartStore` (Zustand, persisted to `localStorage` as `"refrescana-cart"`), `CheckoutForm`, `VoucherUpload`, `OrderConfirmation` components.

### Image / Upload Serving
Images are saved to `public/uploads/` but served via **`/api/uploads/[...path]/route.ts`** — this bypasses Next.js dev-server static caching so freshly uploaded files are immediately visible. Always reference uploaded images as `/api/uploads/...` not `/uploads/...`.

Admin image upload goes through `POST /api/admin/upload`.

### Notification System
Polling-based: `NotificationBell` component polls `GET /api/admin/notifications?unread=true` periodically. Notifications are created server-side whenever an order is placed or a voucher is uploaded. Mark-read via `PATCH /api/admin/notifications`.

### Animation System
`src/components/animations/` wraps Framer Motion and GSAP:
- `ScrollReveal`, `TextReveal`, `HorizontalReveal`, `StaggerContainer` — Framer Motion entrance animations.
- `ParallaxImage`, `ParallaxVideo` — GSAP ScrollTrigger parallax.
- `CounterAnimation` — animated number counter.
- Shared constants in `src/lib/constants.ts` under `ANIMATION_DEFAULTS`.

Smooth scrolling is provided by **Lenis** (`src/components/animations/SmoothScroll.tsx`).

### Key Shared Utilities
- `src/lib/prisma.ts` — singleton Prisma client (use this, never instantiate a new `PrismaClient`).
- `src/lib/auth.ts` — `authOptions` (import here, not inline).
- `src/lib/constants.ts` — site metadata, `CONTACT`, `NAV_LINKS`, `SHIPPING_ZONES`, `FREE_SHIPPING_MIN`, `YAPE_CONFIG`, `ANIMATION_DEFAULTS`.
- `src/lib/generateReceipt.ts` — client-side jsPDF receipt generation.
- `src/components/ui/` — shared UI primitives: `Button`, `Input`, `Card`, `Badge`, `Modal`, `Typography`, `ProductCard`, `BlogCard`, `Breadcrumbs`, `AddToCartButton`, `WhatsAppButton`.

### Database
MySQL via Prisma. Models: `User` (roles: ADMIN, EDITOR, SALES, CUSTOMER), `Category`, `Product` + `ProductImage`, `Order` + `OrderItem`, `BlogPost`, `ContactMessage`, `Notification`.

`OrderStatus` enum: `PENDING → PAYMENT_UPLOADED → PAID → PREPARING → SHIPPED → DELIVERED` (also `CANCELLED`, `REJECTED`).

Receipt numbers are generated inside a Prisma transaction to prevent duplicates under concurrent orders.

## Environment Variables

```env
DATABASE_URL="mysql://user:password@localhost:3306/refrescana"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

The `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars in the old setup are no longer used — admin users are stored in the `User` table with `role: ADMIN`.
