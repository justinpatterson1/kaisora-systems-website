import type { Feature, Offer } from "@/lib/content/catalogue";

import { ENQUIRY_FIELDS, type EnquiryField, type EnquiryValues } from "./enquiry";

/**
 * The notification Kaisora receives for each enquiry, as plain text and HTML.
 * Everything the visitor typed is escaped in the HTML; offers and features
 * come from the catalogue by ID, so their names are ours, not the visitor's.
 */

export type EnquiryInterests = {
  offers: readonly Offer[];
  features: readonly Feature[];
};

const LABELS: Record<EnquiryField, string> = {
  name: "Name",
  email: "Email",
  company: "Company",
  service: "Interested in",
  message: "Message",
};

export type EnquiryEmail = { subject: string; text: string; html: string };

export function composeEnquiryEmail(
  values: EnquiryValues,
  { offers, features }: EnquiryInterests,
): EnquiryEmail {
  const details: [string, string][] = ENQUIRY_FIELDS.filter(
    (field) => field !== "message" && values[field],
  ).map((field) => [LABELS[field], values[field]]);

  if (offers.length > 0) {
    details.push(["Offers", offers.map((offer) => offer.title).join(", ")]);
  }

  const featureLines = features.map((feature) => `${feature.title} (${feature.id})`);
  const footer = `Sent from the kaisorasystems.com contact form. Reply to this email to answer ${values.name}.`;

  const text = [
    details.map(([label, value]) => `${label}: ${value}`).join("\n"),
    featureLines.length > 0
      ? `Features of interest:\n${featureLines.map((line) => `- ${line}`).join("\n")}`
      : "",
    values.message,
    `— ${footer}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const rows = details
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#60646c;vertical-align:top">${label}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const featureList =
    featureLines.length > 0
      ? `<p style="margin:20px 0 6px;font-size:14px;color:#60646c">Features of interest</p><ul style="margin:0;padding-left:20px;font-size:14px">${featureLines
          .map((line) => `<li>${escapeHtml(line)}</li>`)
          .join("")}</ul>`
      : "";

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#0b0b0d">
<table style="border-collapse:collapse;font-size:14px">${rows}</table>
${featureList}
<p style="white-space:pre-wrap;margin:20px 0">${escapeHtml(values.message)}</p>
<p style="font-size:12px;color:#60646c">${escapeHtml(footer)}</p>
</div>`;

  return {
    subject: `New enquiry from ${values.name}${values.company ? ` (${values.company})` : ""}`,
    text,
    html,
  };
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
