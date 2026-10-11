/**
 * Selected Work and its case-study pages — Prompts 13 and 14.
 *
 * One record drives both the homepage card and `/work/[slug]`, so the two can
 * never describe the same project differently.
 *
 * **The credibility rule applies to every string in this file.** If an
 * interviewer points at a sentence and asks what exactly was done, there has to
 * be a detailed answer:
 *
 * - `public` projects are described from their own codebase. Every
 *   SherryBerries claim below was checked against the repository
 *   (github.com/justinpatterson1/SherryBerriesWebsite) on 2026-09-26 — and
 *   things it does *not* do (restocking on admin cancellation, JSON-LD) are
 *   left out on purpose.
 * - `proprietary` projects are professional work, deliberately generalized:
 *   no employer, server or database names, vendors, formulas, figures or code,
 *   and never a repository link. Their wording stays close to the capability
 *   lists Justin supplied in Prompt 13 and the responsibilities in Prompt 12.
 * - No metrics anywhere. No verified figures have been supplied, so impact is
 *   qualitative only (Prompt 14).
 */

export type CaseStudyKind = "public" | "proprietary";

/** One box in the architecture diagram. */
export type ArchNode = {
  label: string;
  detail: string;
};

export type Architecture = {
  /** The main path, top to bottom. */
  flow: readonly ArchNode[];
  /** Services that branch off one node of the flow, drawn beside it. */
  branch?: {
    /** Index into `flow` of the node the services connect to. */
    from: number;
    title: string;
    nodes: readonly ArchNode[];
  };
  /** One sentence under the diagram — what it simplifies. */
  caption: string;
};

export type Titled = { title: string; body: string };

export type CaseStudy = {
  slug: string;
  title: string;
  kind: CaseStudyKind;
  /** The card description — one to two sentences. */
  summary: string;
  /** Card tags and the page's header tags. Keep to the stack that matters. */
  tags: readonly string[];
  /** A few words for the card eyebrow, e.g. "E-commerce · Live". */
  label: string;
  /** Page `<meta name="description">`, ~150 characters. */
  metaDescription: string;
  image?: { src: string; width: number; height: number; alt: string };
  /**
   * A 1200×630 JPEG for social previews. Separate from `image` because LinkedIn
   * and some other scrapers don't reliably render WebP `og:image`s.
   */
  socialImage?: string;
  liveUrl?: string;
  repoUrl?: string;

  /* The nine sections of Prompt 14, in order. */
  overview: readonly string[];
  problem: readonly string[];
  solution: { intro: string; points: readonly string[] };
  architecture: Architecture;
  decisions: readonly Titled[];
  challenges: readonly Titled[];
  reliability: readonly Titled[];
  impact: readonly string[];
  technologies: readonly string[];
};

/** Prompt 13's wording, shown on every proprietary card and page. */
export const CONFIDENTIALITY_NOTE =
  "This case study has been intentionally generalized to protect confidential business information.";

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: "sherryberries",
    title: "SherryBerries E-Commerce Platform",
    kind: "public",
    label: "E-commerce · Live",
    summary:
      "A full-stack e-commerce platform built for a Trinidad & Tobago body jewelry and piercing aftercare business, supporting product management, inventory, orders, payments and fulfillment workflows.",
    tags: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Neon",
      "Resend",
      "Vercel",
    ],
    metaDescription:
      "How the SherryBerries store was built: Next.js, Prisma and PostgreSQL, with stock reservation, bank-transfer and card payments, pickup and delivery, and audit logging.",
    image: {
      src: "/images/work/sherryberries-home.webp",
      width: 1920,
      height: 938,
      alt: "The SherryBerries storefront homepage: the headline “Welcome home Sweet Berry” beside a photo of a model wearing the store’s jewelry, with nationwide delivery, Curepe pickup and secure payments listed below.",
    },
    socialImage: "/images/work/sherryberries-og.jpg",
    liveUrl: "https://shopsherryberries.com",
    repoUrl: "https://github.com/justinpatterson1/SherryBerriesWebsite",

    overview: [
      "SherryBerries sells body jewelry, piercing aftercare and accessories in Trinidad & Tobago. The platform is the business’s complete online store: a customer-facing storefront, a checkout that handles local payment and delivery options, and an admin dashboard for running the shop day to day.",
      "Kaisora designed and built it end to end — data model, API, storefront, admin tooling, payments, email and deployment.",
    ],
    problem: [
      "A local jewelry business needs more than a product grid. Items come in several sizes — gauge, length or diameter — each with its own stock. Customers need to be able to pay by bank transfer as well as by card, and to choose between collecting an order and having it delivered.",
      "Every one of those options creates operational work behind the scenes: transfers have to be checked by a person before an order is treated as paid, stock has to be held for orders that have not been paid yet, and the owner needs one place to see what is waiting on them.",
    ],
    solution: {
      intro:
        "A Next.js application backed by PostgreSQL, where the storefront and the admin dashboard share one data model and one set of API routes.",
      points: [
        "A product catalog with categories, tags and search.",
        "Product variants with their own SKU, stock level and price adjustment, labelled by the size that applies to the product, plus a gauge sizing guide.",
        "Checkout with WiPay card payments, bank transfer and cash on delivery, with each payment method offered only for the shipping methods it suits.",
        "A bank-transfer workflow: the customer uploads a payment receipt, and an admin approves or rejects it with a reason.",
        "Pickup, TTPost and courier delivery priced by city, plus digital products delivered by download.",
        "Transactional email through Resend — account verification, password reset, order confirmation, receipt received, payment confirmed or rejected, and download ready.",
        "An admin dashboard for products, inventory, orders, payment review and returns.",
      ],
    },
    architecture: {
      flow: [
        { label: "Customer", detail: "Browser — storefront, account and checkout" },
        { label: "Next.js application", detail: "App Router pages, hosted on Vercel" },
        { label: "API route handlers", detail: "Checkout, orders, payments and admin logic" },
        { label: "Prisma", detail: "Typed data access and migrations" },
        { label: "PostgreSQL on Neon", detail: "Separate development and production databases" },
      ],
      branch: {
        from: 2,
        title: "External services",
        nodes: [
          { label: "Auth.js", detail: "Sign-in and sessions" },
          { label: "WiPay", detail: "Card payments" },
          { label: "Resend", detail: "Transactional email" },
          { label: "Cloudflare R2", detail: "Private receipt and file storage" },
          { label: "Upstash Redis", detail: "Rate limiting" },
          { label: "Sentry", detail: "Error monitoring" },
        ],
      },
      caption:
        "Simplified. Every request from the storefront or the admin dashboard goes through the same API layer, which is the only part of the system that talks to the database or to third-party services.",
    },
    decisions: [
      {
        title: "Payment and fulfilment are tracked separately",
        body: "An order carries a payment status and a fulfilment status as two independent fields, so “paid but not yet dispatched” and “dispatched on cash on delivery” are both representable. Payment status changes go through a single guarded transition function rather than being set freely.",
      },
      {
        title: "Stock is reserved at checkout, not at payment",
        body: "Placing an order decrements stock immediately, and it is released again if a card payment fails or a bank-transfer window expires. Unpaid orders therefore can’t be oversold while a customer is still arranging payment.",
      },
      {
        title: "Orders keep a snapshot of what was bought",
        body: "Each order item stores the price at the time of purchase and the order stores a copy of the shipping address, so later catalogue or profile edits never rewrite order history.",
      },
      {
        title: "Separate development and production databases",
        body: "Development and production each have their own Neon database. A promotion script copies catalogue changes from development to production, matching records on natural keys and running as a dry run unless told otherwise.",
      },
    ],
    challenges: [
      {
        title: "Two customers buying the last item",
        body: "Stock is decremented with a single conditional update — only if enough stock remains — inside the checkout transaction. If any line cannot be reserved, the whole order rolls back instead of leaving a partial one.",
      },
      {
        title: "Replayed payment callbacks and double approvals",
        body: "The WiPay callback and the admin approval both change an order only if it is still in the state they expect, so a repeated callback or a second click is a no-op rather than a second state change. The download-ready email is guarded the same way and is sent once.",
      },
      {
        title: "Card payment failures",
        body: "The WiPay payment page is requested before the order is committed, so a gateway failure leaves no order behind and no stock held.",
      },
      {
        title: "Promo codes under concurrency",
        body: "Usage caps are enforced with a conditional increment, and a unique index on redemptions stops two simultaneous checkouts from both using a one-per-customer code.",
      },
      {
        title: "Deleting an account without breaking order history",
        body: "Orders must keep a customer reference, so account deletion anonymises the user record instead of removing it.",
      },
    ],
    reliability: [
      {
        title: "Authentication",
        body: "Email-and-password sign-in through Auth.js with bcrypt-hashed passwords, required email verification, short-lived sessions and an idle sign-out.",
      },
      {
        title: "Authorization",
        body: "Customer, admin and super-admin roles. Account, checkout and admin routes require sign-in, and admin actions re-read the user’s role from the database rather than trusting the session alone.",
      },
      {
        title: "Audit logging",
        body: "Admin changes to products, inventory, orders and payments are written to an audit log in the same transaction as the change itself, recording who did what, with no customer personal data and a 12-month retention period.",
      },
      {
        title: "Validation and rate limiting",
        body: "Checkout re-validates everything on the server, uploaded receipts are validated before storage, and sign-in, search, contact and other sensitive endpoints are rate limited.",
      },
      {
        title: "Payment integrity",
        body: "WiPay callbacks are verified with a hash check before an order is marked paid, and payment receipts are stored in a private bucket.",
      },
      {
        title: "Monitoring, backups and headers",
        body: "Errors are reported to Sentry per environment, the database is dumped nightly to separate private storage with a documented restore procedure, and the site sends a strict Content Security Policy and HSTS.",
      },
    ],
    impact: [
      "The store is live at shopsherryberries.com, taking orders with the payment and delivery options that fit the business.",
      "The owner runs the catalogue, stock, payment checks, orders and returns from one dashboard.",
      "Every admin change is traceable, and the data model keeps order history intact as the catalogue changes.",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Neon",
      "Auth.js",
      "Resend",
      "WiPay",
      "Cloudflare R2",
      "Upstash Redis",
      "Sentry",
      "Vitest",
      "Vercel",
    ],
  },

  {
    slug: "financial-data-automation",
    title: "Financial Data Automation Platform",
    kind: "proprietary",
    label: "Data automation",
    summary:
      "Automated financial data workflows connecting external data services, internal databases and operational systems to reduce repetitive processing and improve data consistency.",
    tags: ["SQL Server", "REST APIs", "Automation", "Scripting"],
    metaDescription:
      "A generalized case study of automated financial data workflows: API integration, SQL Server processing, validation, reconciliation and scheduled automation.",

    overview: [
      "A set of automated workflows that move financial data between external data services, internal databases and the operational systems that depend on them.",
    ],
    problem: [
      "Recurring financial data work involved repetitive processing across several systems. Done by hand, that kind of work is slow, and the same data can end up inconsistent from one system to the next.",
    ],
    solution: {
      intro:
        "Scheduled, database-driven workflows that retrieve, transform, check and deliver the data without manual steps.",
      points: [
        "Integration with external data services through their APIs.",
        "SQL Server processes that transform incoming data into the shape internal systems expect.",
        "Validation of the data before it is used downstream.",
        "Scheduled automation, so the workflows run unattended.",
        "Exception handling that separates records needing attention from the ones that processed cleanly.",
        "Reconciliation and operational reporting on the results.",
      ],
    },
    architecture: {
      flow: [
        { label: "External data services", detail: "Accessed through APIs" },
        { label: "Scheduled jobs", detail: "Retrieval and orchestration scripts" },
        { label: "SQL Server processing", detail: "Transformation, validation and reconciliation" },
        { label: "Operational systems", detail: "Downstream processes and reports" },
      ],
      caption:
        "Generalized. System names, data sources and internal structure are intentionally omitted.",
    },
    decisions: [
      {
        title: "Validate before data moves downstream",
        body: "Checks run as part of the workflow, before data reaches the systems that rely on it, rather than after a problem has already spread.",
      },
      {
        title: "Business rules live in maintainable database logic",
        body: "Financial rules are expressed in SQL Server processes that can be read, tested and changed, rather than in one-off manual steps.",
      },
      {
        title: "Exceptions are surfaced, not skipped",
        body: "Records that fail a check are routed to exception handling so they can be investigated, instead of disappearing silently from an unattended run.",
      },
    ],
    challenges: [
      {
        title: "Depending on external services",
        body: "Workflows rely on data feeds and APIs outside the organisation’s control, so they have to cope with services that are unavailable or return incomplete data.",
      },
      {
        title: "Keeping several systems consistent",
        body: "The same data is used in more than one place, which is what makes reconciliation a core part of the workflow rather than an afterthought.",
      },
      {
        title: "Diagnosing unattended jobs",
        body: "When a scheduled process misbehaves, finding the cause means tracing it across APIs, data feeds, database processes and third-party systems.",
      },
    ],
    reliability: [
      {
        title: "Validation",
        body: "Incoming data is checked before it is processed further.",
      },
      {
        title: "Exception handling",
        body: "Failures are captured and routed for follow-up rather than ignored.",
      },
      {
        title: "Reconciliation",
        body: "Results are compared across systems to confirm the data agrees.",
      },
      {
        title: "Production support",
        body: "Scheduled jobs are supported in production, including troubleshooting when an external service or data feed changes.",
      },
    ],
    impact: [
      "Recurring processing runs as automated, scheduled workflows rather than repetitive manual steps.",
      "Validation and reconciliation make the data that operational systems rely on more consistent.",
    ],
    technologies: ["SQL Server", "REST APIs", "Scheduled automation", "Scripting"],
  },

  {
    slug: "market-pricing-automation",
    title: "Market Pricing Automation",
    kind: "proprietary",
    label: "Pricing automation",
    summary:
      "Automated security pricing workflows involving external market data retrieval, validation, transformation and downstream processing.",
    tags: ["REST APIs", "SQL Server", "Batch Automation", "Data Processing"],
    metaDescription:
      "A generalized case study of automated security pricing: market-data retrieval, pricing validation, fallback logic, scheduled execution and production monitoring.",

    overview: [
      "An automated workflow that retrieves security prices from an external market-data service, checks them, and prepares them for the processes that use them downstream.",
    ],
    problem: [
      "Security prices have to be retrieved and checked on a regular schedule, and a missing or unreliable price affects everything downstream that depends on it.",
    ],
    solution: {
      intro:
        "A scheduled batch process that handles retrieval, validation and hand-off to downstream processing.",
      points: [
        "Automated retrieval of market data through a REST API.",
        "Security filtering, so only the relevant securities are requested and processed.",
        "Pricing validation before prices are used.",
        "Fallback logic for when a price cannot be used as retrieved.",
        "Transformation into the format downstream processing expects.",
        "Scheduled execution with exception handling and production monitoring.",
      ],
    },
    architecture: {
      flow: [
        { label: "Scheduled batch job", detail: "Starts each pricing run" },
        { label: "Market-data API", detail: "External price retrieval" },
        { label: "Validation and fallback", detail: "Checks, filtering and fallback rules" },
        { label: "SQL Server", detail: "Transformation and storage" },
        { label: "Downstream processing", detail: "Processes that consume the prices" },
      ],
      caption:
        "Generalized. The data provider, system names and pricing rules are intentionally omitted.",
    },
    decisions: [
      {
        title: "Filter before requesting",
        body: "Security filtering narrows each run to the securities that need a price, keeping requests to the external service focused.",
      },
      {
        title: "Plan for missing prices",
        body: "Fallback logic is part of the design from the start, because a pricing run has to finish sensibly even when some prices are unavailable.",
      },
      {
        title: "Validate, then hand off",
        body: "Prices are validated before they reach downstream processing, so problems are caught at the point they enter the system.",
      },
    ],
    challenges: [
      {
        title: "An external dependency on a schedule",
        body: "The workflow depends on a third-party API being available and returning complete data at the time the job runs.",
      },
      {
        title: "Troubleshooting API issues in production",
        body: "When a run fails or returns unexpected results, the cause has to be traced between the external API, the batch process and the database.",
      },
    ],
    reliability: [
      {
        title: "Pricing validation",
        body: "Retrieved prices are checked before use.",
      },
      {
        title: "Fallback logic",
        body: "Defined behaviour for prices that are missing or unusable.",
      },
      {
        title: "Exception handling",
        body: "Problems are captured for follow-up rather than silently dropped.",
      },
      {
        title: "Production monitoring",
        body: "Scheduled runs are monitored and supported in production.",
      },
    ],
    impact: [
      "Security prices are retrieved, checked and passed on automatically, on a schedule.",
      "Validation and fallback rules make the prices passed downstream more dependable.",
    ],
    technologies: [
      "REST APIs",
      "SQL Server",
      "Batch automation",
      "Data processing",
    ],
  },

  {
    slug: "revenue-processing-engine",
    title: "Revenue & Commission Processing Engine",
    kind: "proprietary",
    label: "Revenue processing",
    summary:
      "A database-driven processing workflow implementing complex brokerage and advisor revenue rules across multiple transaction sources.",
    tags: ["SQL Server", "Stored Procedures", "Financial Data"],
    metaDescription:
      "A generalized case study of a database-driven revenue processing workflow: stored procedures, historical FX handling, transaction classification and reconciliation.",

    overview: [
      "A database-driven workflow that applies brokerage and advisor revenue rules to transactions from several sources and produces revenue reporting from the results.",
    ],
    problem: [
      "Revenue rules for brokerage and advisory activity are complex, transactions arrive from more than one source, and amounts in other currencies have to be converted at the right historical rate.",
    ],
    solution: {
      intro:
        "The rules are implemented as SQL Server stored procedures that classify, convert and calculate in a repeatable way.",
      points: [
        "Stored procedures implementing the business rules.",
        "Transaction classification across multiple transaction sources.",
        "Historical FX handling, so each amount is converted using the rate that applied to it.",
        "Revenue reporting built on the processed results.",
        "Data reconciliation to confirm the output agrees with its sources.",
      ],
    },
    architecture: {
      flow: [
        { label: "Transaction sources", detail: "Several internal and external feeds" },
        { label: "Classification", detail: "Transactions sorted by type and rule" },
        { label: "Stored procedures", detail: "Business rules and historical FX" },
        { label: "Revenue reporting", detail: "Reconciled results" },
      ],
      caption:
        "Generalized. Revenue rules, formulas and source systems are intentionally omitted.",
    },
    decisions: [
      {
        title: "Rules in the database, close to the data",
        body: "Implementing the rules as stored procedures keeps the processing next to the transaction data it works on, in one place that can be reviewed and changed.",
      },
      {
        title: "Historical rates, not current ones",
        body: "Foreign-currency amounts are converted with the rate for the transaction’s date, so re-running a period reproduces the same result.",
      },
    ],
    challenges: [
      {
        title: "Turning complex rules into maintainable logic",
        body: "Business and financial rules have to be translated into database logic that stays readable and correct as the rules change.",
      },
      {
        title: "Many sources, one result",
        body: "Transactions from different sources have to be classified consistently before the rules can be applied to them.",
      },
    ],
    reliability: [
      {
        title: "Reconciliation",
        body: "Processed results are reconciled against their sources.",
      },
      {
        title: "Repeatable processing",
        body: "The same inputs and rates produce the same output, which makes results checkable.",
      },
    ],
    impact: [
      "Complex revenue rules are applied consistently by a repeatable process.",
      "Revenue reporting is built on classified, reconciled data.",
    ],
    technologies: ["SQL Server", "Stored procedures", "Financial data"],
  },
] as const;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function caseStudyHref(study: Pick<CaseStudy, "slug">): string {
  return `/work/${study.slug}`;
}
