/**
 * The homepage's commercial content: solutions, named offers, the feature
 * catalogue and the FAQ. Plain data with no icons or server-only code, so the
 * server (rendering, enquiry validation, email) and the browser (filtering,
 * selection) read the same records.
 *
 * Rules, from PRODUCT.md:
 * - Prices appear only where the owner approved one (OfferPrice), always as
 *   a starting price in TT dollars. No turnarounds, metrics or guarantees.
 * - A feature describes what can be scoped, not something every project gets.
 * - `evidence` links only to work that actually shows the capability, and
 *   founder experience is labelled as prior experience, never as client work.
 * - IDs are the enquiry's allowlist. Renaming one breaks nothing visible but
 *   changes what the server accepts, so keep them stable.
 */

export const OFFER_IDS = [
  "business-website",
  "commerce",
  "automation",
  "care",
  "custom-systems",
] as const;

export type OfferId = (typeof OFFER_IDS)[number];

export const FEATURE_CATEGORIES = [
  "commerce",
  "operations",
  "data-automation",
  "integrations",
] as const;

export type FeatureCategory = (typeof FEATURE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  commerce: "Commerce",
  operations: "Operations",
  "data-automation": "Data and automation",
  integrations: "Integrations",
};

export type Evidence = {
  href: string;
  label: string;
};

export type Solution = {
  id: string;
  title: string;
  body: string;
  /** Representative deliverables, read as one line. */
  includes: string;
  /** Pre-selects "What do you need?" when it is still empty. */
  service: string;
  cta: string;
};

/**
 * A starting price the owner approved, or how the offer is quoted instead.
 * The approved amounts are recorded in PRODUCT.md ("Pricing"); never add one
 * that isn't. Each amount lives only here: the FAQ is built from these.
 */
export type OfferPrice =
  | {
      from: string;
      /** What the starting price covers, shown under it. */
      basis: string;
      /** The same price as a phrase for the cost FAQ; `{from}` is the amount. */
      phrase: string;
    }
  | { quote: string };

export type Offer = {
  id: OfferId;
  title: string;
  who: string;
  scope: readonly string[];
  price: OfferPrice;
  cta: string;
  evidence?: Evidence;
};

export type Feature = {
  id: string;
  title: string;
  category: FeatureCategory;
  description: string;
  /** What the client has to provide or agree before it can be built. */
  needs: string;
  relatedOfferIds: readonly OfferId[];
  evidence?: Evidence;
};

export type FaqItem = { question: string; answer: string };

const SHERRYBERRIES: Evidence = {
  href: "/work/sherryberries",
  label: "Built for SherryBerries",
};

export const SOLUTIONS: readonly Solution[] = [
  {
    id: "sell-online",
    title: "Sell online",
    body: "Give customers a clear way to browse, order and pay, with tools to manage the work behind each sale.",
    includes:
      "Product catalogue, inventory, order management, local payments, pickup and delivery",
    service: "E-commerce",
    cta: "Ask about selling online",
  },
  {
    id: "reduce-repetitive-work",
    title: "Reduce repetitive work",
    body: "Turn recurring spreadsheet work, data entry and reporting into workflows your team can monitor.",
    includes:
      "Scheduled imports, validation, reports, exception alerts, reconciliation, AI-assisted steps",
    service: "Business automation",
    cta: "Ask about automation",
  },
  {
    id: "connect-systems",
    title: "Connect your systems",
    body: "Move information between your website, business tools and databases with less duplicate entry.",
    includes: "API connections, data mapping, sync status, failure handling",
    service: "System integration",
    cta: "Ask about integration",
  },
  {
    id: "manage-operations",
    title: "Manage daily operations",
    body: "Bring customer records, jobs, quotations and approvals into a system built around your process.",
    includes: "Dashboards, staff access, activity history, customer records",
    service: "Custom business systems",
    cta: "Ask about a custom system",
  },
];

/** The short capability line under the solution cards. */
export const CAPABILITIES: readonly string[] = [
  "Business websites",
  "Web applications",
  "Backend systems and APIs",
  "Database cleanup, migration and reporting",
  "Revenue and commission workflows",
  "AI assistants",
  "Technical consulting",
];

export const INDUSTRY_EXAMPLES: readonly { title: string; body: string }[] = [
  { title: "Retail", body: "Online ordering, stock tracking and order fulfilment." },
  {
    title: "Service businesses",
    body: "Enquiries, quotations, bookings and job status.",
  },
  {
    title: "Education providers",
    body: "Programme information, registration enquiries and administrative workflows.",
  },
  {
    title: "Operations teams",
    body: "Validated imports, approvals, reconciliation and reporting.",
  },
];

export const OFFERS: readonly Offer[] = [
  {
    id: "business-website",
    title: "Kaisora Business Website",
    who: "For businesses that need a professional presence and a clear way to get in touch.",
    scope: [
      "Responsive design",
      "Service information",
      "Contact form",
      "Search metadata",
      "Handover",
    ],
    price: {
      from: "TT$1,000",
      basis: "Single-page website",
      phrase: "a single-page business website from {from}",
    },
    cta: "Discuss my website",
  },
  {
    id: "commerce",
    title: "Kaisora Commerce",
    who: "For retailers who need an online store and the tools to run it.",
    scope: [
      "Catalogue and cart",
      "Payment integration",
      "Inventory",
      "Order management",
      "Order emails",
      "Owner dashboard",
    ],
    price: {
      from: "TT$6,000",
      basis: "Base build, modules quoted separately",
      phrase: "an online store's base build from {from}, with modules quoted separately",
    },
    cta: "Discuss my store",
    evidence: { href: "/work/sherryberries", label: "See the SherryBerries case study" },
  },
  {
    id: "automation",
    title: "Kaisora Workflow Automation",
    who: "For teams repeating the same manual data or admin work.",
    scope: [
      "Process mapping",
      "Scheduled workflow",
      "Validation",
      "Exception reporting",
      "AI-assisted steps with review",
      "Deployment and handover",
    ],
    price: { quote: "Quoted after discovery" },
    cta: "Discuss a workflow",
    evidence: {
      href: "/work/financial-data-automation",
      label: "Prior experience: financial data automation",
    },
  },
  {
    id: "care",
    title: "Kaisora Care",
    who: "For keeping a website or application healthy after launch.",
    scope: [
      "Monitoring",
      "Updates",
      "Backup checks",
      "Troubleshooting",
      "Change allowance",
    ],
    price: {
      from: "TT$500",
      basis: "Per month, terms agreed in writing",
      phrase: "ongoing support from {from} a month",
    },
    cta: "Ask about support",
  },
  {
    id: "custom-systems",
    title: "Custom Business Systems & Integrations",
    who: "For processes that don't fit a standard package.",
    scope: [
      "Job tracking",
      "Approval workflows",
      "Database reporting",
      "Revenue calculations",
      "Tool connections",
      "AI assistants",
    ],
    price: { quote: "Quoted after consultation" },
    cta: "Discuss a custom system",
  },
];

export const OFFER_NOTE =
  "Starting prices are in Trinidad and Tobago dollars and cover what's described under each price; anything beyond that is quoted. Offers without a price are quoted once the scope is clear. Every proposal defines the deliverables, running costs, handover and support. Hosting, software subscriptions, payment fees and other third-party charges are identified separately where applicable.";

export const FEATURES: readonly Feature[] = [
  {
    id: "inventory-alerts",
    title: "Inventory and stock alerts",
    category: "commerce",
    description: "Track stock movements and identify products needing attention.",
    needs: "A defined stock source and update rules",
    relatedOfferIds: ["commerce"],
    evidence: SHERRYBERRIES,
  },
  {
    id: "local-payments",
    title: "Local payment integration",
    category: "commerce",
    description: "Connect a supported payment provider to your checkout.",
    needs: "A provider account, approval and API access",
    relatedOfferIds: ["commerce"],
    evidence: SHERRYBERRIES,
  },
  {
    id: "pickup-delivery",
    title: "Pickup and delivery workflows",
    category: "commerce",
    description: "Capture delivery details and manage fulfilment status.",
    needs: "Courier API access for automatic external tracking",
    relatedOfferIds: ["commerce"],
    evidence: SHERRYBERRIES,
  },
  {
    id: "order-notifications",
    title: "Order notifications",
    category: "commerce",
    description: "Send transactional order and fulfilment updates.",
    needs: "An email provider; SMS or WhatsApp automation is scoped separately",
    relatedOfferIds: ["commerce"],
    evidence: SHERRYBERRIES,
  },
  {
    id: "owner-dashboard",
    title: "Owner dashboard",
    category: "operations",
    description: "View orders, customers and useful business totals in one place.",
    needs: "An underlying application and defined data sources",
    relatedOfferIds: ["commerce", "custom-systems"],
    evidence: SHERRYBERRIES,
  },
  {
    id: "quotes-invoices",
    title: "Quotations and invoices",
    category: "operations",
    description: "Prepare quotations, track acceptance and generate invoices or receipts.",
    needs: "Agreed document fields, numbering and accounting requirements",
    relatedOfferIds: ["custom-systems"],
  },
  {
    id: "booking-deposits",
    title: "Booking and deposits",
    category: "operations",
    description: "Manage appointment requests, availability, deposit review and reminders.",
    needs: "Agreed staff calendars and payment verification rules",
    relatedOfferIds: ["custom-systems"],
  },
  {
    id: "customer-portal",
    title: "Customer portal",
    category: "operations",
    description: "Let customers view their orders, documents and request status.",
    needs: "Customer sign-in and access controls",
    relatedOfferIds: ["custom-systems"],
  },
  {
    id: "staff-access",
    title: "Staff access and activity history",
    category: "operations",
    description: "Control staff access and record important changes.",
    needs: "Agreed roles, recorded actions and retention",
    relatedOfferIds: ["custom-systems"],
    evidence: SHERRYBERRIES,
  },
  {
    id: "support-assistant",
    title: "Enquiry and support assistant",
    category: "operations",
    description:
      "Answer common customer questions from your own approved information, and hand anything else to your staff.",
    needs: "Approved source content and rules for when to hand over to a person",
    relatedOfferIds: ["custom-systems"],
  },
  {
    id: "automated-reports",
    title: "Automated reports",
    category: "data-automation",
    description: "Deliver scheduled operational summaries to the right people.",
    needs: "Agreed metrics and data access",
    relatedOfferIds: ["automation"],
  },
  {
    id: "spreadsheet-imports",
    title: "Spreadsheet imports",
    category: "data-automation",
    description: "Validate uploaded records and show what needs correction.",
    needs: "Agreed file formats and validation rules",
    relatedOfferIds: ["automation"],
  },
  {
    id: "payment-reconciliation",
    title: "Payment reconciliation",
    category: "data-automation",
    description: "Match payment records to orders and flag differences for review.",
    needs: "Authorised access to suitable payment data",
    relatedOfferIds: ["automation", "commerce"],
  },
  {
    id: "commission-rules",
    title: "Revenue and commission rules",
    category: "data-automation",
    description: "Apply agreed calculation rules and produce reviewable results.",
    needs: "Business rules, worked examples and an approval process",
    relatedOfferIds: ["automation", "custom-systems"],
    evidence: {
      href: "/work/revenue-processing-engine",
      label: "Prior experience: revenue processing",
    },
  },
  {
    id: "document-extraction",
    title: "Document extraction",
    category: "data-automation",
    description:
      "Read invoices, forms or receipts and turn them into records your team checks before they're saved.",
    needs: "Sample documents and validation rules",
    relatedOfferIds: ["automation"],
  },
  {
    id: "agent-workflows",
    title: "Agent-assisted workflows",
    category: "data-automation",
    description:
      "Draft follow-ups, sort incoming requests or prepare reports, with a person approving each action.",
    needs: "Clear limits on what it may do alone, and an AI provider account",
    relatedOfferIds: ["automation", "custom-systems"],
  },
  {
    id: "system-connections",
    title: "System connections",
    category: "integrations",
    description: "Exchange data between compatible business tools.",
    needs: "Documented APIs, licensing and permissions",
    relatedOfferIds: ["custom-systems"],
  },
  {
    id: "sync-monitoring",
    title: "Sync monitoring and exception handling",
    category: "integrations",
    description: "Surface failed transfers and records requiring investigation.",
    needs: "Agreed recovery and duplicate handling for each integration",
    relatedOfferIds: ["custom-systems", "automation"],
  },
];

export const SUPPORT_COVERAGE: readonly { title: string; body: string }[] = [
  { title: "Monitoring", body: "Watching for errors and failed jobs so problems are found early." },
  { title: "Maintenance", body: "Dependency and platform updates that keep the system current." },
  { title: "Backup checks", body: "Confirming backups run and can be restored from." },
  { title: "Troubleshooting", body: "Investigating and fixing faults in the system we delivered." },
  {
    title: "AI assistants",
    body: "Reviewing answers, updating source information and tracking provider usage costs.",
  },
  {
    title: "Change allowance",
    body: "An agreed amount of small changes each month, where included.",
  },
];

/** The cost answer, built from the offers so prices are never typed twice. */
function costAnswer(): string {
  const phrases = OFFERS.flatMap((offer) =>
    "from" in offer.price ? [offer.price.phrase.replace("{from}", offer.price.from)] : [],
  );
  const listed =
    phrases.length > 1
      ? `${phrases.slice(0, -1).join("; ")}; and ${phrases[phrases.length - 1]}`
      : phrases.join("");
  const opening = listed ? `Starting prices are ${listed}. ` : "";
  return `${opening}Every project is quoted after we understand the scope, existing systems and running costs, and your proposal explains what is included and any third-party charges.`;
}

export const FAQS: readonly FaqItem[] = [
  {
    question: "Do you only build websites?",
    answer:
      "We also build web applications, backend systems, integrations and automation around business operations.",
  },
  {
    question: "Can you improve an existing system?",
    answer:
      "We can review what you already have and recommend whether to improve, connect or replace it. The approach depends on access, code quality and your requirements.",
  },
  {
    question: "Can you connect my POS or accounting software?",
    answer:
      "We first check whether the provider supports the required integration and what access is available. We confirm feasibility before including it in a proposal.",
  },
  {
    question: "How much will my project cost?",
    answer: costAnswer(),
  },
  {
    question: "Do you offer support after launch?",
    answer:
      "Support can be arranged for the system we deliver. Coverage, response arrangements and changes are agreed as part of the engagement.",
  },
  {
    question: "Who owns the website or software?",
    answer:
      "Ownership, source-code handover, account access and third-party licences are defined in your proposal and agreement.",
  },
  {
    question: "Can you add AI to my business?",
    answer:
      "Where it fits, yes. We start by checking whether the task suits an AI assistant, decide what information it may see, and keep a person reviewing its actions. AI provider usage is a running cost, and your proposal states it separately.",
  },
  {
    question: "Can I start small?",
    answer: "We can identify a useful first release and scope later improvements separately.",
  },
];

/* Lookups, used by the browser store and by the enquiry Server Action. */

const OFFERS_BY_ID = new Map(OFFERS.map((offer) => [offer.id, offer]));
const FEATURES_BY_ID = new Map(FEATURES.map((feature) => [feature.id, feature]));

export function getOffer(id: string): Offer | undefined {
  return OFFERS_BY_ID.get(id as OfferId);
}

export function getFeature(id: string): Feature | undefined {
  return FEATURES_BY_ID.get(id);
}
