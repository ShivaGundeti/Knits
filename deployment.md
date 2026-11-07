# Deployment & Setup Guide (`deployment.md`)

This guide explains how to run the full-stack **Knits** platform (NestJS Backend + Next.js Frontend) locally for reviewer evaluation and describes production deployment settings.

---

## 1. Quick Local Setup (Step-by-Step)

### Prerequisites
* **Node.js**: v18.17+ or v20+ (tested on Node v20/v24)
* **npm**: v9+ or v10+
* **Git**

### Step A: Start the NestJS Backend (`knits-backend`)
```bash
# 1. Navigate to backend directory
cd knits-backend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the NestJS REST API (runs on port 4000)
npm run start
```
The NestJS API will be available at: `http://localhost:4000/orders`

---

### Step B: Start the Next.js Frontend (`knits-app`)
In a new terminal window:
```bash
# 1. Navigate to frontend directory
cd knits-app

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start the Next.js development server (runs on port 3000)
npm run dev
```

Open your browser at:
`http://localhost:3000`

*(Note: The frontend has automatic offline fallback storage, so if the NestJS backend is temporarily stopped, the application continues to run seamlessly without breaking).*

---

## 2. Reviewer Demo Credentials & Role Switcher
For seamless reviewer evaluation, a live **Role Switcher** is pinned directly in the top navigation bar:

| Role | Purpose | Features to Test |
| :--- | :--- | :--- |
| **Merchandiser** | Office Project Manager | Order Board, Red/Amber/Green alerts, Click Run-Rate Math breakdown, Edit AI Tamil categories, Export PDF report |
| **Supervisor (தளம்)** | Factory Floor Manager | Tamil interface, Stage selection, Numbers entry, Voice note capture, Offline Mode toggle |
| **Buyer View** | UK & EU Sourcing Staff | Strict tenant isolation (Switch between Company B and Company C), Verified floor photos, Ex-factory audit trail |

---

## 3. Seeded Realistic Test Data
The application comes pre-loaded with the 3 sample purchase orders from the client brief:
1. `B-PO-88213`: Company B (UK), Men's crew neck tee (Navy Blue), 12,000 pcs, Stitching stage (6,800 done) — **Triggers critical RED delay warning with math breakdown**.
2. `B-PO-88240`: Company B (UK), Men's polo (White), 8,000 pcs, Finishing stage (5,200 done) — **Amber status**.
3. `C-PO-0488`: Company C (Germany), Kids printed tee (Yellow), 10,000 pcs, Printing stage (3,100 done) — **Green on-track status**.

---

## 4. Production Environment Configuration

When deploying to Vercel, Netlify, Railway, or AWS, configure the following environment variable names (values kept private as per security rules):

```env
# Backend Service URL (used by Next.js frontend)
NEXT_PUBLIC_API_URL=http://localhost:4000

# Backend Listening Port
PORT=4000

# AI Service API (e.g. Gemini / OpenAI / Cloud Speech-to-Text)
AI_TRANSLATION_API_KEY=
AI_TRANSLATION_MODEL=

# Database / Storage (if switching from in-memory/browser store to managed PostgreSQL/Neon)
DATABASE_URL=
DIRECT_URL=

# Authentication & Session (NextAuth / JWT)
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Cloud Object Storage for High-Resolution Factory Floor Photos
S3_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

---

## 5. Automated Tests
To run the automated test suite verifying the run-rate mathematical engine and Tamil translation categorization:
```bash
# In knits-backend:
cd knits-backend
npm run test

# In knits-app:
cd knits-app
npx vitest run
```
