"use server";

import { after } from "next/server";

import { CONTACT_EMAIL } from "@/lib/content/contact";
import { SERVICE_OPTIONS } from "@/lib/content/services";

import { confirmationEmail } from "./confirmation-email";
import {
  ENQUIRY_FIELDS,
  MAX_LENGTH,
  TRAP_FIELD,
  type EnquiryField,
  type EnquiryState,
  type EnquiryValues,
} from "./enquiry";

/**
 * The contact form's Server Action: validates the enquiry and emails it to
 * `CONTACT_EMAIL` through Resend's REST API, with Reply-To set to the visitor
 * so a reply from the inbox goes straight back to them. Once that succeeds, a
 * confirmation (`confirmation-email.ts`) goes to the visitor after the
 * response is sent, so its failure never fails the submit.
 *
 * `RESEND_API_KEY` is required. `CONTACT_FROM_EMAIL` overrides the sender,
 * e.g. `onboarding@resend.dev` before kaisorasystems.com is verified in Resend.
 */

const DEFAULT_FROM = "Kaisora Systems website <website@kaisorasystems.com>";

/* The name the visitor sees in their inbox on the confirmation. */
const CONFIRMATION_FROM = "Kaisora Systems <website@kaisorasystems.com>";

/* Deliberately loose: the browser's `type="email"` does the strict check, and
   Resend rejects what isn't deliverable. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const values = Object.fromEntries(
    ENQUIRY_FIELDS.map((field) => [field, String(formData.get(field) ?? "").trim()]),
  ) as EnquiryValues;

  /* A bot filled the hidden field. Report success so it learns nothing. */
  if (String(formData.get(TRAP_FIELD) ?? "") !== "") return { status: "sent" };

  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    return {
      status: "invalid",
      message: "Please check the highlighted fields.",
      errors,
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !CONTACT_EMAIL) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_EMAIL is not set.");
    return failed(values);
  }

  const delivered = await postToResend(apiKey, "enquiry", {
    from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
    to: [CONTACT_EMAIL],
    reply_to: values.email,
    subject: `New enquiry from ${values.name}${values.company ? ` (${values.company})` : ""}`,
    text: plainText(values),
    html: html(values),
  });
  if (!delivered) return failed(values);

  const replyTo = CONTACT_EMAIL;
  const receivedAt = new Date();
  after(() =>
    postToResend(apiKey, "confirmation", {
      from: process.env.CONTACT_FROM_EMAIL || CONFIRMATION_FROM,
      to: [values.email],
      reply_to: replyTo,
      ...confirmationEmail({ name: values.name, service: values.service, receivedAt }),
    }),
  );

  return { status: "sent" };
}

/** Sends one email through Resend; logs and returns false on any failure. */
async function postToResend(
  apiKey: string,
  kind: "enquiry" | "confirmation",
  email: Record<string, unknown>,
): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(`Contact form (${kind}): Resend responded ${response.status}`, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Contact form (${kind}): request to Resend failed`, error);
    return false;
  }
}

function validate(values: EnquiryValues): Partial<Record<EnquiryField, string>> {
  const errors: Partial<Record<EnquiryField, string>> = {};

  if (!values.name) errors.name = "Tell us your name.";
  if (!values.email) errors.email = "We need an email to reply to.";
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = "That email doesn't look right.";
  if (!values.message) errors.message = "Tell us a little about the project.";
  else if (values.message.length < 10) errors.message = "A sentence or two helps us reply properly.";
  if (values.service && !SERVICE_OPTIONS.includes(values.service)) {
    errors.service = "Pick one of the listed options.";
  }

  for (const field of ENQUIRY_FIELDS) {
    if (!errors[field] && values[field].length > MAX_LENGTH[field]) {
      errors[field] = `Keep this under ${MAX_LENGTH[field].toLocaleString("en")} characters.`;
    }
  }

  return errors;
}

function failed(values: EnquiryValues): EnquiryState {
  return {
    status: "failed",
    message: CONTACT_EMAIL
      ? `Your message couldn't be sent. Please try again, or email us at ${CONTACT_EMAIL}.`
      : "Your message couldn't be sent. Please try again in a moment.",
    errors: {},
    values,
  };
}

const LABELS: Record<EnquiryField, string> = {
  name: "Name",
  email: "Email",
  company: "Company",
  service: "Interested in",
  message: "Message",
};

function plainText(values: EnquiryValues): string {
  const details = ENQUIRY_FIELDS.filter((field) => field !== "message" && values[field])
    .map((field) => `${LABELS[field]}: ${values[field]}`)
    .join("\n");

  return `${details}\n\n${values.message}\n\n— Sent from the kaisorasystems.com contact form. Reply to this email to answer ${values.name}.`;
}

function html(values: EnquiryValues): string {
  const rows = ENQUIRY_FIELDS.filter((field) => field !== "message" && values[field])
    .map(
      (field) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#60646c">${LABELS[field]}</td><td style="padding:4px 0">${escapeHtml(values[field])}</td></tr>`,
    )
    .join("");

  return `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#0b0b0d">
<table style="border-collapse:collapse;font-size:14px">${rows}</table>
<p style="white-space:pre-wrap;margin:20px 0">${escapeHtml(values.message)}</p>
<p style="font-size:12px;color:#60646c">Sent from the kaisorasystems.com contact form. Reply to this email to answer ${escapeHtml(values.name)}.</p>
</div>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
