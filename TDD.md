# Technical Design Document (TDD)
**Project Name**: Knits — Knitwear Exporter Production Tracking & Delay Warning SaaS  
**Client**: Company A, Tiruppur, India (₹95–110 Crore revenue, 900 factory workers, 3 units)  
**GitHub Repository**: [https://github.com/ShivaGundeti/Knits.git](https://github.com/ShivaGundeti/Knits.git)  
**Author**: Shiva Gundeti (Software Engineering Candidate)  

---

## 1. Executive Summary & Problem Context
Company A manufactures knitwear in Tiruppur for UK and European retail buyers. They process roughly 500 orders a year at an average value of ₹21 Lakh. 

### The Problem
* **₹1.08 Crore Annual Loss**:
  * 8% of orders ship late (40 orders/year).
  * 15 orders require emergency air freight instead of sea shipping (₹3.5 Lakh penalty each) = **₹52.5 Lakh**.
  * 25 orders take a 5% client discount for late delivery (25 × ₹1.05 Lakh) = **₹26.25 Lakh**.
  * 12 merchandisers waste 2 hours daily chasing floor supervisors via phone calls = 7,200 hours × ₹400 = **₹28.8 Lakh**.
* **Root Cause**: The factory discovers delays 2 days before the Ex-factory shipment date, when recovery is physically impossible.
* **Solution**: **Knits** replaces fragmented Excel sheets and WhatsApp with real-time floor updates from supervisors, predictive run-rate delay warnings 14 days in advance, automated Tamil-to-English AI reason classification, and tenant-isolated read-only portals for international buyers.

---

## 2. System Architecture & Tech Stack

```
   ┌────────────────────────────────────────────────────────────┐
   │                KNITS EXPORTER PLATFORM                     │
   └────────────────────────────────────────────────────────────┘
         │                                       │
         ▼                                       ▼
 ┌──────────────────────┐             ┌──────────────────────┐
 │  MERCHANDISER / MD   │             │   FLOOR SUPERVISOR   │
 │   Desktop Web View   │             │  Mobile-First View   │
 └──────────────────────┘             └──────────────────────┘
         │                                       │
         ├── Order Board (Green/Amber/Red)       ├── Tamil i18n Interface
         ├── Run-Rate Math Breakdown             ├── Fast Numbers & Stage Select
         ├── TNA Milestone Setup                 ├── Voice / Text Tamil Note
         ├── AI Human-in-the-Loop Review         ├── Floor Photo Capture
         └── Buyer Export Reports (PDF)          └── Offline-First IndexedDB
                                                         │
                                                         ▼
                                              ┌──────────────────────┐
                                              │   AI INTENT ENGINE   │
                                              │   Tamil -> English   │
                                              │ Category Classifier  │
                                              └──────────────────────┘
                                                         │
                                                         ▼
                                              ┌──────────────────────┐
                                              │ BUYER PORTAL (UK/EU) │
                                              │ Strict Multi-Tenant  │
                                              │ Verified Photos Only │
                                              └──────────────────────┘
```

### Technology Decisions & Rationale:
1. **Next.js 15 (App Router) + TypeScript**: Full-stack type safety, ultra-fast client hydration, unified API and frontend rendering.
2. **Tailwind CSS**: Minimalist design philosophy emphasizing whitespace, typography, and clear status signals. Zero visual clutter.
3. **Run-Rate Mathematical Engine**: Algorithmic projection of actual floor velocity vs. required daily pace, strictly excluding non-working factory Sundays.
4. **AI Tamil Translation & Delay Taxonomy Classifier**: Converts conversational Tamil audio/text into standardized garment delay categories with confidence scoring and human-in-the-loop merchandiser verification.
5. **Offline Queue Sync**: Custom browser storage queue ensuring zero data loss on 2–3 GB RAM phones in corrugated tin-roof factories with patchy cellular coverage.
6. **Multi-Tenant Buyer Security**: Hard boundary tenant isolation preventing any buyer from accessing competitor orders, styles, or volumes.

---

## 3. Core Data Models

```typescript
export type ProductionStage = 
  | 'Knitting' | 'Dyeing' | 'Cutting' | 'Printing' 
  | 'Stitching' | 'Washing' | 'Finishing' | 'Inspection' | 'Packed';

export type DelaySeverity = 'green' | 'amber' | 'red';

export interface Order {
  id: string;
  poNumber: string;
  buyerId: string;
  buyerName: string;
  buyerCountry: string;
  style: string;
  color: string;
  totalQuantity: number;
  sizeBreakdown: { size: string; quantity: number }[];
  unitAssigned: string; // e.g. "Unit 1 (Avinashi Road)"
  currentStage: ProductionStage;
  stageQuantityCompleted: number;
  exFactoryDate: string; // YYYY-MM-DD
  milestones: TNAMilestone[];
  logs: DailyProductionLog[];
  dateChangeHistory: DateChangeAudit[];
}

export interface DailyProductionLog {
  id: string;
  orderId: string;
  date: string;
  stage: ProductionStage;
  quantityCompleted: number;
  supervisorName: string;
  photoUrl?: string;
  rawNoteTamil?: string;
  englishTranslation?: string;
  aiSuggestedCategory?: string;
  confirmedCategory?: string;
  aiConfidence?: number;
  isConfirmedByMerchandiser: boolean;
  visibleToBuyer: boolean;
}
```

---

## 4. The Run-Rate Delay Warning Engine (Mathematical Transparency)

The engine rejects naive calendar day counts and computes working production velocity:

### 1. Working Days Formula:
$$\text{WorkingDays}(D_{\text{today}}, D_{\text{ex-factory}}) = \sum_{d \in [D_{\text{today}}, D_{\text{ex-factory}}]} [1 \text{ if } \text{DayOfWeek}(d) \neq \text{Sunday} \text{ else } 0]$$

### 2. Required Daily Run-Rate ($R_{\text{req}}$):
$$R_{\text{req}} = \left\lceil \frac{Q_{\text{total}} - Q_{\text{completed}}}{\text{WorkingDaysLeft}} \right\rceil$$

### 3. Actual Daily Run-Rate ($R_{\text{actual}}$):
Calculated from the rolling average of the supervisor's last 3 to 4 shift completions:
$$R_{\text{actual}} = \frac{1}{N} \sum_{i=1}^{N} \text{ShiftQty}_i$$

### 4. Traffic Light Severity Matrix:
* 🟢 **GREEN (On Track)**: $R_{\text{actual}} \ge R_{\text{req}}$ and projected completion $\le D_{\text{ex-factory}}$.
* 🟡 **AMBER (Tight Margin)**: $0.80 \times R_{\text{req}} \le R_{\text{actual}} < R_{\text{req}}$ or projected delay $\le 3$ days.
* 🔴 **RED (Critical Delay Warning)**: $R_{\text{actual}} < 0.80 \times R_{\text{req}}$ or projected delay $> 3$ days. Flags 14 days early so merchandisers can allocate extra sewing lines or overtime before air freight becomes unavoidable.

---

## 5. AI Pipeline & Human-in-the-Loop Safeguards
1. **Tamil Input Handling**: Supervisor speaks into microphone or types phonetic Tamil (e.g. *"ஊசி உடைந்துவிட்டது, மிஷின் 1 மணி நேரம் ஓடவில்லை"*).
2. **Standard Garment Taxonomy Classification**: Matches intent against:
   * Machinery Breakdown
   * Fabric / Material Shortage
   * Worker Absenteeism
   * Quality / Shade Defect
   * Power Outage
   * Subcontractor Delay
3. **Handling AI Mistakes & Fallbacks**:
   * Confidence score ($< 0.70$) marks the entry as `Other / Needs Review`.
   * Original Tamil note is **never hidden** and sits directly beside the English translation.
   * Merchandiser has 1-click edit power to override the category.
   * **Buyer Gate**: Unverified floor issues are strictly hidden from buyers until the merchandiser confirms them, preventing buyer panic.

---

## 6. Multi-Tenant Security & Compliance
* **Tenant Isolation**: Sourcing staff for Company B (UK) are physically restricted to `buyerId === 'buyer-uk-b'`. Queries never return competitor order details, styles, or volumes.
* **Audit Trail**: Any change to the agreed Ex-Factory date requires a mandatory justification and logs the timestamp and user identity in `dateChangeHistory` for UK/EU compliance audits.

---

## 7. What Was Cut & What Would Be Done Next
* **What Was Cut**: Fabric inventory stock keeping, worker biometric attendance, and foreign currency invoicing (explicitly marked out of scope in the brief).
* **Next Steps**:
  1. WhatsApp Business Webhook API integration for supervisors without smartphones.
  2. IoT sensor integration on sewing machine motors to auto-count needle strokes.
  3. Container ocean vessel AIS tracking API integration from Chennai Port.
