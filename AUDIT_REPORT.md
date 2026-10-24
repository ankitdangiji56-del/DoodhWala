# Doodhwala — Comprehensive System Audit Report

**Date**: 2026-10-24  
**Auditor**: Principal Full-Stack Engineer, Software Architect & QA Specialist  
**Application Target**: Doodhwala Dairy E-Commerce Platform (`http://localhost:5173`)  
**Commit/Base**: Initial Scaffold & Core Prototype  

---

## 1. Executive Summary

An exhaustive code-level and runtime audit of the Doodhwala dairy platform was conducted. While core layout structures, CSS variables, product data models, and Vite build pipelines are functional, critical defects and architectural gaps were identified:
1. **Critical Authentication Bypass & Insecure Session Management**: Entering arbitrary email addresses (e.g. any `@gmail.com`) or phone numbers creates authenticated sessions without password or OTP verification. Users were automatically initialized into a hardcoded demo customer session on first visit.
2. **Total Absence of Localization (English Only)**: The platform defaults to English and lacks multi-language infrastructure. No Hindi default, no Braj Bhasha, and no Marwari Bhasha translations exist.
3. **Improper Role Separation**: A demo role switcher is embedded directly inside the customer-facing navbar (`#role-switch-button`), allowing any user to toggle into the Administrator portal. A dedicated `/admin/login` route is missing.
4. **Outdated/Inaccurate Business Contact Details**: Contact details in the footer and contact page show placeholder Bangalore numbers and addresses instead of the authentic Biaora, Rajgarh (MP) coordinates and designated family contacts.
5. **Customer Support Widget Absence**: A persistent, accessible, responsive multi-contact support panel with direct click-to-call links is absent.

---

## 2. Detailed Audit Findings

### Issue AUD-01: Insecure Client-Side Authentication Bypass & Auto-Session
- **Classification**: Confirmed Defect
- **Severity**: **Critical**
- **Component**: `src/lib/store.tsx` (`login()` and `useState<UserProfile>(currentUser)` initialization)
- **Steps to Reproduce**:
  1. Open a new incognito browser window and navigate to `http://localhost:5173/`.
  2. Observe navbar account state: User is already logged in as "Ramesh Sharma".
  3. Navigate to `/login`.
  4. Type any random string or arbitrary email (e.g., `random123@gmail.com`) and any arbitrary password.
  5. Click "Sign In to Account".
- **Expected Behaviour**: The authentication system must validate credentials against stored registered accounts or Supabase Auth. Unregistered or mismatched credentials must be rejected with "Invalid credentials".
- **Actual Observed Behaviour**: `store.tsx` automatically constructs a new authenticated `UserProfile` object for any non-empty input and persists it to `localStorage`, granting immediate login without password verification.
- **Root Cause**: `store.tsx` lines 149–175 had a hardcoded default customer object in `useState`, and lines 308–320 generated an ad-hoc session without credential checking.
- **Proposed Correction**: 
  1. Remove default mock user initialization; default `currentUser` to `null`.
  2. Implement a persistent registered user store (`STORAGE_KEYS.USERS`) and integrate Supabase Auth when configured.
  3. Validate password hashes or match registered accounts. Reject unknown emails and incorrect passwords.
- **Verification Method**: Automated unit tests and UI testing ensuring invalid inputs yield error messages and unauthorized access is blocked.

---

### Issue AUD-02: Public Role Escalation via Navigation Bar Switcher
- **Classification**: Confirmed Defect
- **Severity**: **Critical**
- **Component**: `src/components/layout/Navbar.tsx` (`#role-switch-button`), `src/lib/store.tsx` (`switchRoleForDemo`)
- **Steps to Reproduce**:
  1. Visit `http://localhost:5173/` on desktop.
  2. Click the visible button in the header labeled "Mode: Customer".
  3. The state immediately flips to "Mode: Admin" and displays a gold "Admin Panel" link.
  4. Click "Admin Panel" to gain full access to `/admin`.
- **Expected Behaviour**: Public customer-facing navigation must never expose administrative privilege switches. Administrative access must require authenticating through a dedicated `/admin/login` route with administrative credentials.
- **Actual Observed Behaviour**: Any anonymous visitor can elevate their session to Administrator with a single click.
- **Root Cause**: Temporary prototype testing hook left exposed in production navbar components.
- **Proposed Correction**:
  1. Remove the role switcher button from `Navbar.tsx` and mobile drawers.
  2. Build a dedicated `/admin/login` page with independent admin credentials validation.
  3. Protect all `/admin/*` routes with strict route guards that redirect unauthorized users.
- **Verification Method**: Security tests proving unauthenticated or regular customer accounts cannot reach `/admin` without admin login.

---

### Issue AUD-03: Complete Lack of Multi-Language Localization (Hindi Default Missing)
- **Classification**: Confirmed Defect
- **Severity**: **High**
- **Component**: Entire application (`src/components/*`, `src/pages/*`)
- **Steps to Reproduce**:
  1. Visit `http://localhost:5173/`.
  2. Inspect language: All text is rendered in English.
  3. Look for language selector: No selector exists.
- **Expected Behaviour**: 
  - Website must open in **Hindi (`hi`)** by default on a first visit.
  - Must support **Hindi (`hi`)**, **English (`en`)**, **Braj Bhasha (`brx`)**, and **Marwari Bhasha (`mwr`)**.
  - Must display a prominent language selector in the navbar and mobile drawer that changes the language reactively without reloading the webpage.
  - Selection must persist in `localStorage`.
- **Actual Observed Behaviour**: All strings are hardcoded in English.
- **Root Cause**: Internationalization infrastructure was not yet established.
- **Proposed Correction**:
  1. Create typed translation dictionaries: `src/locales/hi.ts`, `src/locales/en.ts`, `src/locales/brx.ts`, `src/locales/mwr.ts`.
  2. Create a reactive `LanguageContext` with `t(key)` helper, persistent storage, and Hindi default.
  3. Embed an accessible language selector dropdown/pills in `Navbar.tsx` and mobile menu.
- **Verification Method**: Automated translation completeness test and browser verification across all 4 languages.

---

### Issue AUD-04: Incorrect Customer Support Information & Absence of Floating Support Panel
- **Classification**: Confirmed Defect
- **Severity**: **Medium**
- **Component**: `src/components/layout/Footer.tsx`, `src/pages/public/ContactPage.tsx`
- **Steps to Reproduce**:
  1. Open `http://localhost:5173/contact` or view the footer.
  2. Observe contact number `+91 98765 43210`, email `care@doodhwala.local`, and address in Bangalore.
- **Expected Behaviour**: Must display the official Doodhwala business details:
  - Business: Doodhwala
  - Email: `doodhwala@gmail.com`
  - Address: Khajuriya, Biaora, Rajgarh, Madhya Pradesh, India, PIN: 465674
  - Designated Support Contacts:
    - Lakshmichand Dangi (+91 9893927434)
    - Jagdish Dangi (+91 9981758282)
    - Dinesh Dangi (+91 9926035537)
    - Omprakash Dangi (+91 9425016514)
  - Provide a responsive floating Customer Support widget with click-to-call links.
- **Actual Observed Behaviour**: Generic placeholder values are displayed.
- **Root Cause**: Initial configuration had starter placeholder data before business coordinates were provided.
- **Proposed Correction**: Update `initialData.ts` and create a dedicated `SupportWidget.tsx` component.
- **Verification Method**: Code inspection and verification of `tel:` and `mailto:` links in the UI.

---

### Issue AUD-05: Antigravity Playwright Browser Tooling Download Blocker
- **Classification**: External Configuration Blocker
- **Severity**: **Medium**
- **Component**: Antigravity Browser Subagent runtime
- **Observation**: When running `browser_subagent`, the environment failed with HTTP 404 attempting to download `playwright-1.57.0-mac-arm64.zip` from Microsoft CDN.
- **Mitigation**: All functionality is verified via:
  1. Automated Vitest test suites running in Node.js with simulated DOM/business logic.
  2. Direct HTTP curl verification against the running dev server on `http://localhost:5173`.
  3. Clean Vite TypeScript compilation (`npm run build`).

---

## 3. Findings Summary Table

| ID | Module / Area | Issue Summary | Severity | Classification |
| :--- | :--- | :--- | :--- | :--- |
| **AUD-01** | Auth / Store | Insecure login bypass; arbitrary email/phone logs in; auto-logged in session | Critical | Confirmed Defect |
| **AUD-02** | Security / Navbar | Navbar role switcher exposes admin escalation without credentials | Critical | Confirmed Defect |
| **AUD-03** | Localization | English-only UI; missing Hindi default, Braj, Marwari & language switcher | High | Confirmed Defect |
| **AUD-04** | Support / Info | Placeholder contacts instead of Biaora/Rajgarh and designated family contacts | Medium | Confirmed Defect |
| **AUD-05** | Environment | Playwright driver 404 in browser subagent runner | Medium | External Blocker |

---

*Report prepared and logged for immediate remediation.*
