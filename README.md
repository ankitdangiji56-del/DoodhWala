# 🥛 Doodhwala — Responsive Farm-Fresh Dairy Platform

[![Built with React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Doodhwala** is a responsive, high-trust dairy e-commerce and recurring subscription web platform designed for first-time founders launching single-origin farm-fresh dairy with **zero upfront software budget**.

Built on **React, TypeScript, Vite, Vanilla CSS custom properties, and Supabase PostgreSQL with Row Level Security (RLS)**, it delivers authentic functionality: multi-pack sizes, morning delivery service-area validation, COD & manual UPI verification, recurring daily milk subscriptions, and staff administration.

---

## 🎨 Design System & Visual Tokens

The platform strictly adheres to the curated brand palette and modern typography:

| Token | Hex Code | Role |
| :--- | :--- | :--- |
| **Milk Blue** | `#1E5AA8` | Primary brand color, hero headings, action badges |
| **Dark Blue** | `#14407A` | Deep contrast headings, navbar accents, footer text |
| **Cream** | `#FFF8E7` | Warm, homely background tint for alternate sections |
| **Ghee Gold** | `#F5B041` | High-visibility action buttons (*Order Now*, *Subscribe*) |
| **Fresh Green** | `#3FA56B` | Stock badges, WhatsApp triggers, delivery statuses |
| **White** | `#FFFFFF` | Clean background canvas, card surfaces |
| **Dark Gray** | `#1F2937` | High-readability body copy, footer background |
| **Light Gray** | `#6B7280` | Secondary metadata, borders, muted hints |

- **Headings**: `Poppins` (Google Fonts, weights 500, 600, 700)
- **Body**: `Inter` (Google Fonts, weights 400, 500, 600)
- **Visual Feel**: Homely, trustworthy, generous whitespace, subtle rounded elevation, and full support for `prefers-reduced-motion`.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v20+)
- **npm** v9+

### 2. Clone & Install
```bash
git clone <your-repository-url> doodhwala
cd doodhwala
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The platform will run instantly in fully functional **Local Store Mode**, allowing complete testing of the catalogue, cart, checkout, and admin dashboard without needing external credentials!

---

## 🧪 Running Automated Tests & Builds

```bash
# Run Vitest unit tests (pricing, stock validation, state transitions)
npm test

# Run TypeScript type check and production bundle compilation
npm run build
```

---

## 📦 Project Architecture & Structure

```
doodhwala/
├── index.html                         # Typography imports & SEO meta tags
├── package.json                       # Scripts and lean dependencies
├── vite.config.ts                     # Build and test configurations
├── .env.example                       # Safe environment variable placeholders
├── public/
│   ├── favicon.svg                    # Brand milk-bottle favicon
│   └── images/                        # High-resolution dairy photographs
│       ├── hero-dairy.jpg             # Farm table hero photograph
│       ├── milk.jpg                   # Whole Cow Milk
│       ├── ghee.jpg                   # Bilona Cow Ghee
│       ├── paneer.jpg                 # Fresh Malai Paneer
│       └── curd.jpg                   # Artisan Set Curd (Dahi)
├── supabase/
│   ├── migrations/
│   │   ├── 20261024000000_initial_schema.sql      # 13 tables, RLS policies, indexes
│   │   └── 20261024000001_seed_initial_data.sql   # Milk, Ghee, Paneer, Curd seed
│   ├── admin-bootstrap.sql            # Secure script to promote your first admin
│   └── functions/
│       └── whatsapp-notification/     # Meta WhatsApp Cloud API Edge Function
│           └── index.ts
└── src/
    ├── main.tsx                       # App entry point
    ├── App.tsx                        # Router layout and route definitions
    ├── index.css                      # Design tokens, variables, responsive utility classes
    ├── types/                         # TypeScript interfaces (Product, Order, Subscription, Settings)
    ├── lib/
    │   ├── initialData.ts             # Default launch catalog, settings & starter zones
    │   ├── orderLogic.ts              # Pure business calculations & transition guards
    │   ├── store.tsx                  # Reactive state, cart, orders, inventory, auth
    │   └── supabase.ts                # Production Supabase client wrapper
    ├── locales/                       # Four-Language Localization Resources
    │   ├── types.ts                   # LanguageCode, LanguageOption & TranslationDictionary
    │   ├── hi.ts                      # Hindi (Default Devanagari translation)
    │   ├── en.ts                      # English dictionary
    │   ├── brx.ts                     # Braj Bhasha (Devanagari culturally natural copy)
    │   └── mwr.ts                     # Marwari Bhasha (Devanagari respectful regional copy)
    ├── context/
    │   └── LanguageContext.tsx        # React LanguageProvider, persistence & fallback
    ├── components/
    │   ├── common/                    # LanguageSelector, SupportWidget
    │   ├── layout/                    # Navbar, Footer, AdminLayout
    │   └── product/                   # ProductCard
    ├── pages/
    │   ├── public/                    # Home, Products, ProductDetail, Cart, Checkout, OrderConfirmation, Contact, Policies
    │   ├── auth/                      # Login, Signup
    │   ├── account/                   # Dashboard, OrderHistory, Subscriptions, Wishlist
    │   └── admin/                     # AdminLoginPage, Dashboard, Products, Orders, Payments, DeliveryZones, Subscriptions, Settings
    └── test/
        ├── orderLogic.test.ts         # Vitest unit test suite (15 tests)
        ├── auth.test.ts               # Authentication security & admin isolation suite (9 tests)
        └── localization.test.ts       # 4-Language parity & authentic vocabulary suite (6 tests)
```

---

## 🌐 Four-Language Localization System

The platform provides a native, zero-flicker internationalization engine:
- **Hindi (`hi`)**: Explicit default on first visit. Natural Devanagari phrasing for everyday families.
- **English (`en`)**: Professional, concise dairy commerce terminology.
- **Braj Bhasha (`brx`)**: Culturally natural vocabulary (`हमारो दूध-माखन`, `थैली में धरौ`, `ताज़ौ दूध`, `बिलौने कौ घी`, `माटी की मटकी कौ दही`).
- **Marwari Bhasha (`mwr`)**: Respectful regional vocabulary (`म्हारा देसी उत्पाद`, `झोली में जोड़ो`, `ताजो दूध`, `बिलोणा रो घी`, `माटी री मटकी रो दही`).

**Persistent Language Selection**: The language selector is prominently accessible in the desktop header and mobile drawer. Customer selections immediately update the UI without reloading and are saved in `localStorage['doodhwala_lang_v1']`.

---

## 📞 Official Customer Support Coordinates

The platform renders the exact business coordinates centrally:
- **Business Address**: Khajuriya, Biaora, Rajgarh, Madhya Pradesh, India — 465674
- **Official Email**: [doodhwala@gmail.com](mailto:doodhwala@gmail.com)
- **Support Team**:
  - Lakshmichand Dangi: `+91 9893927434`
  - Jagdish Dangi: `+91 9981758282`
  - Dinesh Dangi: `+91 9926035537`
  - Omprakash Dangi: `+91 9425016514`
- **Floating Support Widget**: Floating, non-intrusive bottom widget providing one-tap click-to-call (`tel:`), direct email (`mailto:`), and direct WhatsApp messaging.

---

## 🛡️ Security & Authentication Model

1. **Strict Admin Portal Isolation**:
   - Customer login (`/login`) and Customer registration (`/signup`) create and authenticate customer accounts only.
   - Staff administration is strictly gatekept behind **`/admin/login`**.
   - Public navigation contains no privilege escalation switches.
2. **Row Level Security (RLS)**: Every PostgreSQL table has RLS enabled. Customers can only read/write their own records.
3. **Server-Side Price Integrity**: Order totals are calculated from authoritative variant prices stored in the database. Client-sent totals are never trusted.
4. **Manual UPI Verification**: Submitting a UPI UTR reference sets status to `pending_verification`. Only staff can verify bank deposits and mark orders as `paid`.
5. **Secret Protection**: Meta WhatsApp Cloud API tokens and Supabase service keys are kept strictly in server-side Edge Function secrets.

---

## ⚙️ Connecting Supabase (Production Setup)

1. Create a free account at [Supabase.com](https://supabase.com).
2. Create a new project (e.g., `doodhwala-prod`).
3. Open the **SQL Editor** in Supabase and run:
   - `supabase/migrations/20261024000000_initial_schema.sql`
   - `supabase/migrations/20261024000001_seed_initial_data.sql`
4. Copy your **Project URL** and **Anon Public Key** from *Project Settings > API*.
5. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
   ```
6. Bootstrap your admin user following `supabase/admin-bootstrap.sql`.

---

## 💬 WhatsApp Cloud API Integration (Production Setup)

1. Register for a **Meta for Developers** account and configure a **WhatsApp Business Account (WABA)**.
2. Register your business phone number and submit notification templates (e.g., `doodhwala_order_confirmed`).
3. In the Supabase Dashboard, go to **Edge Functions > Secrets** and add:
   - `WHATSAPP_CLOUD_API_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `ADMIN_ALERT_PHONE_NUMBER`
4. Deploy the edge function:
   ```bash
   npx supabase functions deploy whatsapp-notification
   ```

---

## 🌐 Free Static Deployment on Cloudflare Pages

1. Push your repository to **GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete Doodhwala platform"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages > Create application > Pages > Connect to Git**.
3. Select your `doodhwala` repository.
4. Build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**. Cloudflare Pages will build and deploy your live site with free SSL!
