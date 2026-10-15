import { CONTACT_EMAIL } from "@/lib/content/contact";
import { PRODUCTION_URL } from "@/lib/site-url";

/**
 * The acknowledgement sent to whoever submitted the contact form: what
 * happens next and when to expect a reply.
 *
 * The form can address this email to anyone, so it never repeats the
 * visitor's free text. Only a first name (dropped if it looks like a link or
 * address) and the service they picked from a fixed list are echoed back.
 *
 * Built for email clients, not browsers: tables, inline styles, hex colours
 * (Outlook ignores rgba), and the Pixel K drawn from table cells so it renders
 * with images blocked. Light is the base; the dark twin is applied through
 * `prefers-color-scheme` where the client supports it (DESIGN.md, Inverted
 * Twin Rule).
 */

/** Promised on every enquiry, so it stays realistic for a one-person studio. */
export const REPLY_WITHIN_BUSINESS_DAYS = 2;

/** Trinidad & Tobago keeps Atlantic Standard Time all year (no DST). */
const TIME_ZONE = "America/Port_of_Spain";

const SUBJECT = "We've got your message";

type ConfirmationInput = {
  name: string;
  /** One of `SERVICE_OPTIONS`, or empty. Already validated. */
  service: string;
  receivedAt: Date;
};

export type ConfirmationEmail = { subject: string; html: string; text: string };

export function confirmationEmail({ name, service, receivedAt }: ConfirmationInput): ConfirmationEmail {
  const firstName = safeFirstName(name);
  const received = formatReceived(receivedAt);
  const replyBy = formatDay(addBusinessDays(receivedAt, REPLY_WITHIN_BUSINESS_DAYS));
  const greeting = firstName ? `Thanks, ${firstName}.` : "Thanks for getting in touch.";
  const within = `within ${REPLY_WITHIN_BUSINESS_DAYS} business days`;

  return {
    subject: SUBJECT,
    text: plainText({ greeting, within, received, replyBy, service }),
    html: html({ greeting, within, received, replyBy, service }),
  };
}

/* ------------------------------------------------------------------ copy -- */

type Copy = {
  greeting: string;
  within: string;
  received: string;
  replyBy: string;
  service: string;
};

const SITE_HOST = new URL(PRODUCTION_URL).host;
const WORK_URL = `${PRODUCTION_URL}/work/sherryberries`;
const REPLY_FROM = CONTACT_EMAIL ?? "our studio inbox";

function plainText({ greeting, within, received, replyBy, service }: Copy): string {
  return [
    greeting,
    "",
    `We've received your enquiry and will reply ${within}.`,
    "",
    "What happens next",
    "",
    `1. Received: ${received}${service ? `\n   Interested in: ${service}` : ""}`,
    "2. We read it: our founder, Justin Patterson, reads every enquiry personally.",
    `3. We reply: by ${replyBy}, from ${REPLY_FROM}, with honest next steps.`,
    "",
    "Anything to add? Reply to this email and it comes straight to us.",
    "",
    "Justin Patterson",
    "Founder, Kaisora Systems",
    "",
    `While you wait, see how we built SherryBerries: ${WORK_URL}`,
    "",
    "---",
    `Kaisora Systems, Trinidad & Tobago. ${SITE_HOST}`,
    `You're getting this because your address was entered on the contact form at ${SITE_HOST}. If that wasn't you, reply and let us know.`,
  ].join("\n");
}

/* ------------------------------------------------------------------ html -- */

/* DESIGN.md tokens, flattened to solid hex over their grounds. */
const LIGHT = {
  ground: "#f7f7f8",
  panel: "#ffffff",
  hairline: "#e8e8e9",
  hairline2: "#d9d9da",
  ink: "#0b0b0d",
  ink2: "#45474e",
  ink3: "#60646c",
  accentText: "#6a1fe0",
  signalLine: "#c0a1f2",
  markInk: "#0b0b0f",
};

const DARK = {
  ground: "#0b0b0f",
  panel: "#121217",
  hairline: "#25252a",
  hairline2: "#333337",
  ink: "#ededef",
  ink2: "#a3a6ad",
  ink3: "#8a8f98",
  accentText: "#a87bff",
  signalLine: "#5d468b",
  markInk: "#ffffff",
};

const BRAND_PURPLE = "#7b2ff7";

const SANS = "'Rethink Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "'Geist Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

/* Each class pairs with an inline light value; the media query swaps it. */
const DARK_RULES = `
  .k-ground { background-color:${DARK.ground} !important; }
  .k-panel { background-color:${DARK.panel} !important; border-color:${DARK.hairline2} !important; }
  .k-rule { border-color:${DARK.hairline} !important; }
  .k-ink { color:${DARK.ink} !important; }
  .k-ink2 { color:${DARK.ink2} !important; }
  .k-ink3 { color:${DARK.ink3} !important; }
  .k-accent { color:${DARK.accentText} !important; }
  .k-rail { background-color:${DARK.signalLine} !important; }
  .k-step-open { background-color:${DARK.panel} !important; border-color:${DARK.signalLine} !important; }
  .k-mark-ink { background-color:${DARK.markInk} !important; }`;

function html(copy: Copy): string {
  const { greeting, within, received, replyBy, service } = copy;
  const preheader = `We've received your enquiry and will reply ${within}, by ${replyBy}.`;

  const steps = [
    step({
      done: true,
      title: "Received",
      body: `<span class="k-ink2" style="font-family:${MONO};font-size:12.5px;line-height:1.5;color:${LIGHT.ink2};font-variant-numeric:tabular-nums;">${received}</span>${
        service
          ? `<br><span class="k-ink3" style="color:${LIGHT.ink3};">Interested in</span> <span class="k-ink2" style="color:${LIGHT.ink2};">${escapeHtml(service)}</span>`
          : ""
      }`,
    }),
    step({
      title: "We read it",
      body: "Our founder, Justin Patterson, reads every enquiry personally.",
    }),
    step({
      title: "We reply",
      body: `By <span class="k-ink" style="color:${LIGHT.ink};font-weight:600;">${replyBy}</span>, from ${escapeHtml(REPLY_FROM)}, with honest next steps.`,
      last: true,
    }),
  ].join("");

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${SUBJECT}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;700&family=Rethink+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  body { margin:0; padding:0; width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table { border-collapse:collapse; mso-table-lspace:0; mso-table-rspace:0; }
  a { text-decoration-thickness:1px; text-underline-offset:3px; }
  @media (max-width:600px) {
    .k-pad { padding:28px 22px !important; }
    .k-outer { padding:24px 12px 32px !important; }
    .k-title { font-size:24px !important; }
  }
  @media (prefers-color-scheme: dark) {${DARK_RULES}
  }
</style>
</head>
<body class="k-ground" style="margin:0;padding:0;background-color:${LIGHT.ground};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${LIGHT.ground};opacity:0;">${escapeHtml(preheader)}${"&#8199;&#65279;&#847; ".repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="k-ground" style="background-color:${LIGHT.ground};">
<tr><td align="center" class="k-outer" style="padding:40px 16px 48px;">
  <!--[if mso]><table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

    <tr><td style="padding:0 0 24px;">
      <a href="${PRODUCTION_URL}" style="text-decoration:none;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="middle" style="padding:0 14px 0 0;">${pixelK()}</td>
          <td valign="middle" class="k-ink" style="font-family:${MONO};font-size:20px;line-height:1;font-weight:700;letter-spacing:0.06em;color:${LIGHT.ink};">KAISORA</td>
        </tr></table>
      </a>
    </td></tr>

    <tr><td class="k-panel k-pad" style="background-color:${LIGHT.panel};border:1px solid ${LIGHT.hairline2};border-radius:8px;padding:40px;">
      <h1 class="k-ink k-title" style="margin:0;font-family:${SANS};font-size:28px;line-height:1.15;font-weight:700;letter-spacing:-0.025em;color:${LIGHT.ink};">${escapeHtml(greeting)}</h1>
      <p class="k-ink2" style="margin:14px 0 0;font-family:${SANS};font-size:16px;line-height:1.55;color:${LIGHT.ink2};">We've received your enquiry and will reply ${within}.</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0;">
        ${steps}
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0;">
        <tr><td class="k-rule" style="border-top:1px solid ${LIGHT.hairline};padding:24px 0 0;font-family:${SANS};font-size:15px;line-height:1.55;">
          <p class="k-ink2" style="margin:0;color:${LIGHT.ink2};">Anything to add? Reply to this email and it comes straight to us.</p>
          <p class="k-ink" style="margin:24px 0 0;font-size:15.5px;font-weight:600;letter-spacing:-0.01em;color:${LIGHT.ink};">Justin Patterson</p>
          <p class="k-accent" style="margin:2px 0 0;font-size:13.5px;color:${LIGHT.accentText};">Founder, Kaisora Systems</p>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:24px 4px 0;font-family:${SANS};font-size:14px;line-height:1.55;">
      <p class="k-ink2" style="margin:0;color:${LIGHT.ink2};">While you wait, <a href="${WORK_URL}" class="k-accent" style="color:${LIGHT.accentText};text-decoration:underline;">see how we built SherryBerries&nbsp;&rarr;</a></p>
      <p class="k-ink3" style="margin:20px 0 0;font-size:12.5px;line-height:1.6;color:${LIGHT.ink3};">Kaisora Systems &middot; Trinidad &amp; Tobago &middot; <a href="${PRODUCTION_URL}" class="k-ink3" style="color:${LIGHT.ink3};text-decoration:underline;">${SITE_HOST}</a><br>You're getting this because your address was entered on the contact form at ${SITE_HOST}. If that wasn't you, reply and let us know.</p>
    </td></tr>

  </table>
  <!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}

/**
 * One row of the "what happens next" sequence. A 7px pixel square marks the
 * step (filled brand purple once done, outlined otherwise) and a 1px
 * signal-line rail joins it to the next. The rail is a cell background, so it
 * stretches with the row in every client.
 */
function step({ title, body, done = false, last = false }: { title: string; body: string; done?: boolean; last?: boolean }): string {
  const marker = done
    ? `background-color:${BRAND_PURPLE};`
    : `background-color:${LIGHT.panel};border:1px solid ${LIGHT.signalLine};width:5px;height:5px;`;
  const markerClass = done ? "" : ` class="k-step-open"`;
  const rail = last
    ? `<td colspan="3" style="font-size:0;line-height:0;">&nbsp;</td>`
    : `<td width="3" style="width:3px;font-size:0;line-height:0;">&nbsp;</td><td width="1" class="k-rail" style="width:1px;background-color:${LIGHT.signalLine};font-size:0;line-height:0;">&nbsp;</td><td width="3" style="width:3px;font-size:0;line-height:0;">&nbsp;</td>`;

  return `
        <tr>
          <td colspan="3" width="7" valign="middle" style="width:7px;padding:0;font-size:0;line-height:0;">
            <div${markerClass} style="width:7px;height:7px;${marker}font-size:0;line-height:0;">&nbsp;</div>
          </td>
          <td width="18" style="width:18px;font-size:0;line-height:0;">&nbsp;</td>
          <td class="k-ink" style="font-family:${SANS};font-size:15.5px;line-height:22px;font-weight:600;letter-spacing:-0.01em;color:${LIGHT.ink};">${title}</td>
        </tr>
        <tr>
          ${rail}
          <td width="18" style="width:18px;font-size:0;line-height:0;">&nbsp;</td>
          <td class="k-ink2" style="padding:4px 0 ${last ? 0 : 22}px;font-family:${SANS};font-size:15px;line-height:1.55;color:${LIGHT.ink2};">${body}</td>
        </tr>`;
}

/**
 * The Pixel K from its 5 × 5 grid (DESIGN.md, Square Grid Rule): 6px squares
 * on an 8px pitch, the same 3:4 ratio as the SVG. Ink squares follow the
 * theme; the diagonal stays brand purple in both.
 */
function pixelK(): string {
  const ink = new Set(["0,0", "0,1", "0,2", "0,3", "0,4", "1,2"]);
  const purple = new Set(["2,2", "3,1", "4,0", "3,3", "4,4"]);
  const SQUARE = 6;
  const GAP = 2;

  const rows: string[] = [];
  for (let row = 0; row < 5; row++) {
    const cells: string[] = [];
    for (let col = 0; col < 5; col++) {
      const key = `${col},${row}`;
      const fill = purple.has(key) ? BRAND_PURPLE : ink.has(key) ? LIGHT.markInk : null;
      const cls = ink.has(key) ? ' class="k-mark-ink"' : "";
      cells.push(
        `<td width="${SQUARE}" height="${SQUARE}"${cls} style="width:${SQUARE}px;height:${SQUARE}px;${fill ? `background-color:${fill};` : ""}font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>`,
      );
      if (col < 4) cells.push(`<td width="${GAP}" style="width:${GAP}px;font-size:0;line-height:0;">&nbsp;</td>`);
    }
    rows.push(`<tr>${cells.join("")}</tr>`);
    if (row < 4) rows.push(`<tr><td colspan="9" height="${GAP}" style="height:${GAP}px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr>`);
  }

  return `<table role="presentation" aria-label="Kaisora Systems" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows.join("")}</table>`;
}

/* ------------------------------------------------------------- helpers -- */

/**
 * The first word of the name, or nothing if it could carry a link, address
 * or markup. The form accepts anyone's address, so the greeting must not be
 * a way to deliver someone else's words.
 */
function safeFirstName(name: string): string | null {
  const first = name.trim().split(/\s+/)[0] ?? "";
  if (!first || first.length > 30) return null;
  if (/[./:@<>\\]|https?|www/i.test(first)) return null;
  return first;
}

/** Calendar parts of `date` as seen in Trinidad & Tobago. */
function localParts(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** Weekdays only; public holidays aren't counted. Noon UTC keeps the date stable. */
function addBusinessDays(from: Date, days: number): Date {
  const { year, month, day } = localParts(from);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  let added = 0;
  while (added < days) {
    date.setUTCDate(date.getUTCDate() + 1);
    const weekday = date.getUTCDay();
    if (weekday !== 0 && weekday !== 6) added++;
  }
  return date;
}

/** "Friday 16 October" */
function formatDay(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date).replace(",", "");
}

/** "Wed 14 Oct 2026, 3:42 pm AST" */
function formatReceived(date: Date): string {
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date).replace(",", "");
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(date).toLowerCase();
  return `${day}, ${time} AST`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
