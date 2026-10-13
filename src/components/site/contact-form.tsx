"use client";

import { useActionState } from "react";

import { ArrowIcon } from "@/components/icons";
import { MAX_LENGTH, TRAP_FIELD, type EnquiryField, type EnquiryState } from "@/lib/contact/enquiry";
import { sendEnquiry } from "@/lib/contact/send-enquiry";
import { CONTACT_EMAIL } from "@/lib/content/contact";
import { SERVICE_OPTIONS } from "@/lib/content/services";

const INITIAL_STATE: EnquiryState = { status: "idle" };

/**
 * The enquiry form in the contact section. Validated in the browser for speed
 * and again in `sendEnquiry`, which is the check that counts.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendEnquiry, INITIAL_STATE);

  if (state.status === "sent") {
    return (
      <div className="contact-form contact-sent" role="status">
        <p className="contact-sent-title">Thanks, your message is on its way.</p>
        <p>
          We read every enquiry ourselves and will reply from{" "}
          {CONTACT_EMAIL ?? "our studio inbox"}.
        </p>
      </div>
    );
  }

  const errors = "errors" in state ? state.errors : {};
  const values = "values" in state ? state.values : undefined;

  /* Spread onto each control: wires its error message for screen readers. */
  const describe = (field: EnquiryField) =>
    errors[field]
      ? { "aria-invalid": true as const, "aria-describedby": `enquiry-${field}-error` }
      : {};

  const error = (field: EnquiryField) =>
    errors[field] ? (
      <p id={`enquiry-${field}-error`} className="field-error">
        {errors[field]}
      </p>
    ) : null;

  return (
    <form action={formAction} className="contact-form">
      <div className="field-row">
        <div className="field">
          <label htmlFor="enquiry-name">Name</label>
          <input
            id="enquiry-name"
            name="name"
            autoComplete="name"
            required
            maxLength={MAX_LENGTH.name}
            defaultValue={values?.name}
            {...describe("name")}
          />
          {error("name")}
        </div>
        <div className="field">
          <label htmlFor="enquiry-email">Email</label>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={MAX_LENGTH.email}
            defaultValue={values?.email}
            {...describe("email")}
          />
          {error("email")}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="enquiry-company">
            Company <span className="field-optional">optional</span>
          </label>
          <input
            id="enquiry-company"
            name="company"
            autoComplete="organization"
            maxLength={MAX_LENGTH.company}
            defaultValue={values?.company}
            {...describe("company")}
          />
          {error("company")}
        </div>
        <div className="field">
          <label htmlFor="enquiry-service">
            What do you need? <span className="field-optional">optional</span>
          </label>
          <select
            id="enquiry-service"
            name="service"
            defaultValue={values?.service ?? ""}
            {...describe("service")}
          >
            <option value="">Choose one</option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error("service")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="enquiry-message">Project details</label>
        <textarea
          id="enquiry-message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={MAX_LENGTH.message}
          placeholder="What you're building or fixing, what exists today, and any deadline."
          defaultValue={values?.message}
          {...describe("message")}
        />
        {error("message")}
      </div>

      {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
      <div className="field-trap" aria-hidden="true">
        <label htmlFor="enquiry-website">Website</label>
        <input id="enquiry-website" name={TRAP_FIELD} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="contact-form-footer">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
          {!pending && <ArrowIcon width={14} height={14} />}
        </button>
        <p className="contact-form-status" role="alert">
          {"message" in state ? state.message : null}
        </p>
      </div>
    </form>
  );
}
