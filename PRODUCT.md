# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three client groups, all addressed at once (confirmed 2026-10-10):

- **Small and mid-sized businesses** in Trinidad & Tobago and the Caribbean that need a website, an online store, or manual processes automated.
- **Established companies** with existing systems that need integration, automation, backend or data work.
- **Startups and founders** who need a technical partner to build a new product.

They arrive judging whether Kaisora can be trusted with their system, and want to see what it builds, how it works, and how to start a conversation.

## Product Purpose

The site is the business website for **Kaisora Systems**, a software studio. It is no longer a personal portfolio. Success means a prospective client understands what Kaisora builds, believes it can deliver, and gets in touch.

## Positioning

Kaisora is an engineering-led studio, run by its founder, that builds systems meant to hold up in production: e-commerce, backend services and APIs, business process automation, database work and system integration. Its proof is depth that can be checked, such as architecture diagrams, failure modes handled and reliability decisions, not volume of logos.

## Operating Context

- Based in Trinidad & Tobago. Payment work includes WiPay and bank-transfer flows (see the SherryBerries case study).
- Each project gets a case study at `/work/[slug]`, driven by one record in `src/lib/content/case-studies.ts`.
- All copy lives in `src/lib/content/`.

## Capabilities and Constraints

- Services (current list in `src/lib/content/services.ts`): Web Application Development, Backend Systems & APIs, Business Process Automation, Database Solutions, System Integration, Technical Consulting. Only what can be delivered today: no mobile apps, no security audits.
- Next.js 16 App Router, statically prerendered, Tailwind CSS 4, light and dark themes.
- Contact email is still `null` (`src/lib/content/contact.ts`). The UI must hide what it would drive rather than show placeholders.

## Brand Commitments

- Name: **Kaisora Systems**. The studio speaks as "we".
- The founder, Justin Patterson (Software Developer & Systems Analyst), stays visible in a short founder section. Personal experience and education are condensed into it rather than kept as standalone portfolio sections.
- The name "Justin Patterson" should stay findable in metadata.
- Logo: the Pixel K mark with the KAISORA wordmark, from the owner-supplied brand sheet at brand/kaisora-pixel-k-sheet.png (supplied 2026-10-11). Brand colours are #7B2FF7, #0B0B0F and #FFFFFF.
- **Visual standing preference (2026-10-10):** a modern, techy look. Dark theme by default, with light mode available. It should sit alongside Vercel/Linear, Raycast/Supabase and Railway/Resend, and their craft level is the bar. The brand accent is the logo purple #7B2FF7, set by the owner. Convention executed at full fidelity, with no smuggled quirk.
- Primary homepage action: **start a project / enquire**. It leads to contact; the business email is still to be supplied.

## Evidence on Hand

- **SherryBerries E-Commerce Platform**: a real, live, public project with a repository. Every claim has been checked against the code.
- **Financial Data Automation, Market Pricing Automation, Revenue Processing Engine**: the founder's prior professional work, not Kaisora client work. Show them honestly as founder experience, and also as capability examples ("what we can build, based on this experience"). Never present them as Kaisora clients. Keep them generalized: no employer, vendor or system names, no figures.
- Founder photo in `public/images/about/`.
- **Absent, never fabricate:** testimonials, client logos, metrics or impact figures, pricing, team members beyond the founder, and completion dates for credentials.

## Product Principles

1. Every claim survives the question "what exactly was done?"
2. Be honest about scale: a founder-led studio with checkable depth, not an agency pretending to be big.
3. Lead with the client's problem and Kaisora's capability, then the person behind it.
4. Nothing on the page is a placeholder. Missing values hide their UI.
