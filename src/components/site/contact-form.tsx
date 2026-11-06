"use client";

import { track } from "@vercel/analytics";
import { useActionState, useCallback } from "react";

import { ArrowIcon } from "@/components/icons";
import { useInterests } from "@/components/interests/interest-provider";
import { MAX_LENGTH, TRAP_FIELD, type EnquiryField, type EnquiryState } from "@/lib/contact/enquiry";
import { FEATURE_FIELD, OFFER_FIELD } from "@/lib/contact/interest-ids";
import { sendEnquiry } from "@/lib/contact/send-enquiry";
import { CONTACT_EMAIL } from "@/lib/content/contact";
import { SERVICE_OPTIONS } from "@/lib/content/services";

import { AttachedInterests } from "./attached-interests";

const INITIAL_STATE: EnquiryState = { status: "idle" };

/**
 * The enquiry form in the contact section. Validated in the browser for speed
 * and again in `sendEnquiry`, which is the check that counts.
 *
 * Offers and features picked elsewhere on the page come from the interest
 * store and travel as hidden `offer` / `feature` fields. Clicking a card never
 * touches what's typed here: the text fields are uncontrolled and the store
 * only feeds the select and the attachments.
 */
export function ContactForm() {
  const { primaryService, offerIds, featureIds, dispatch } = useInterests();

  /* Success is only what the server confirms; then the picks are spent. */
  const submit = useCallback(
    async (previous: EnquiryState, formData: FormData): Promise<EnquiryState> => {
      const result = await sendEnquiry(previous, formData);
      if (result.status === "sent") {
        try {
          track("enquiry_success", {
            offers: formData.getAll(OFFER_FIELD).length,
            features: formData.getAll(FEATURE_FIELD).length,
          });
        } catch {
          /* Analytics never blocks an enquiry. */
        }
        dispatch({ type: "reset" });
      }
      return result;
    },
    [dispatch],
  );

  const [state, formAction, pending] = useActionState(submit, INITIAL_STATE);

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
            value={primaryService}
            onChange={(event) => dispatch({ type: "set-service", value: event.target.value })}
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

      <AttachedInterests />
      {offerIds.map((id) => (
        <input key={id} type="hidden" name={OFFER_FIELD} value={id} />
      ))}
      {featureIds.map((id) => (
        <input key={id} type="hidden" name={FEATURE_FIELD} value={id} />
      ))}

      <div className="field">
        <label htmlFor="enquiry-message">Project details</label>
        <textarea
          id="enquiry-message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={MAX_LENGTH.message}
          placeholder="What does your business do, what is slow or manual today, and what would you like to improve?"
          defaultValue={values?.message}
          aria-describedby={errors.message ? "enquiry-message-error" : "enquiry-message-hint"}
          aria-invalid={errors.message ? true : undefined}
        />
        <p id="enquiry-message-hint" className="field-hint">
          Mention the tools you use today and any deadline, if you have one.
        </p>
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
