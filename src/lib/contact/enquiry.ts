/**
 * The contact form's shape, shared by the form (client) and its Server Action.
 * No secrets or server-only code here.
 */

export const ENQUIRY_FIELDS = ["name", "email", "company", "service", "message"] as const;

export type EnquiryField = (typeof ENQUIRY_FIELDS)[number];

export type EnquiryValues = Record<EnquiryField, string>;

export type EnquiryState =
  | { status: "idle" }
  | { status: "sent" }
  | {
      status: "invalid" | "failed";
      message: string;
      errors: Partial<Record<EnquiryField, string>>;
      /** Echoed back so a failed submit doesn't wipe what the visitor typed. */
      values: EnquiryValues;
    };

export const MAX_LENGTH: Record<EnquiryField, number> = {
  name: 100,
  email: 200,
  company: 120,
  service: 60,
  message: 5000,
};

/** The honeypot field: hidden from people, filled in by bots. */
export const TRAP_FIELD = "website";
