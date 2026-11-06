import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { InterestLink } from "@/components/interests/interest-link";
import { InterestProvider } from "@/components/interests/interest-provider";
import { ContactForm } from "@/components/site/contact-form";
import { FEATURES } from "@/lib/content/catalogue";
import type { EnquiryState } from "@/lib/contact/enquiry";
import { sendEnquiry } from "@/lib/contact/send-enquiry";

import { FeatureCatalogue } from "./feature-catalogue";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));
vi.mock("@/lib/contact/send-enquiry", () => ({ sendEnquiry: vi.fn() }));

const send = vi.mocked(sendEnquiry);

afterEach(() => {
  cleanup();
  send.mockReset();
});

function renderPage() {
  return render(
    <InterestProvider>
      <InterestLink offerId="commerce" service="E-commerce">
        Discuss my store
      </InterestLink>
      <InterestLink offerId="automation">Discuss a workflow</InterestLink>
      <FeatureCatalogue />
      <ContactForm />
    </InterestProvider>,
  );
}

const draft = () => within(screen.getByRole("complementary", { name: "your-system" }));
const attached = () => within(screen.getByRole("group", { name: /Attached to your message/ }));
const checkbox = (name: string) => screen.queryByRole("checkbox", { name: new RegExp(`^${name}`) });

function fillForm() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Sherry Baptiste" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "sherry@example.com" } });
  fireEvent.change(screen.getByLabelText("Project details"), {
    target: { value: "We sell jewellery and track stock in a spreadsheet." },
  });
}

describe("feature catalogue and enquiry", () => {
  it("renders every feature with what it needs before any interaction", () => {
    renderPage();
    for (const feature of FEATURES) {
      expect(checkbox(feature.title)).not.toBeNull();
      expect(screen.getByText(feature.needs, { exact: false })).toBeTruthy();
    }
    expect(screen.getByText(`All ${FEATURES.length} features`)).toBeTruthy();
  });

  it("keeps picks through filtering, and restores everything when cleared", () => {
    renderPage();
    fireEvent.click(checkbox("Inventory and stock alerts")!);
    fireEvent.click(checkbox("Order notifications")!);

    fireEvent.click(screen.getByRole("button", { name: "Operations" }));
    expect(checkbox("Inventory and stock alerts")).toBeNull();
    expect(screen.getByText(/^Showing \d+ of 18 features$/)).toBeTruthy();
    expect(draft().getByText("Inventory and stock alerts")).toBeTruthy();
    expect(draft().getByText("2 modules")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Find a feature"), { target: { value: "zzz" } });
    expect(screen.getByText(/No features match “zzz” in Operations/)).toBeTruthy();

    fireEvent.click(screen.getAllByRole("button", { name: "Show all features" })[0]);
    expect(screen.getByText(`All ${FEATURES.length} features`)).toBeTruthy();
    expect((checkbox("Inventory and stock alerts") as HTMLInputElement).checked).toBe(true);
    expect((checkbox("Order notifications") as HTMLInputElement).checked).toBe(true);
  });

  it("removes from the draft and clears all", () => {
    renderPage();
    fireEvent.click(checkbox("Owner dashboard")!);
    fireEvent.click(checkbox("Automated reports")!);

    fireEvent.click(draft().getByRole("button", { name: "Remove Owner dashboard" }));
    expect((checkbox("Owner dashboard") as HTMLInputElement).checked).toBe(false);
    expect(draft().getByText("1 module")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(draft().getByText("0 modules")).toBeTruthy();
    expect(attached().getByText(/Nothing attached yet/)).toBeTruthy();
  });

  it("attaches an offer without disturbing what's typed, and never twice", () => {
    renderPage();
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Sherry" } });
    fireEvent.change(screen.getByLabelText("Project details"), { target: { value: "Half-written note" } });

    fireEvent.click(screen.getByText("Discuss my store"));
    fireEvent.click(screen.getByText("Discuss my store"));

    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Sherry");
    expect((screen.getByLabelText("Project details") as HTMLTextAreaElement).value).toBe("Half-written note");
    expect(attached().getAllByText("Kaisora Commerce")).toHaveLength(1);
    expect((screen.getByLabelText(/What do you need/) as HTMLSelectElement).value).toBe("E-commerce");

    fireEvent.click(attached().getByRole("button", { name: "Remove Kaisora Commerce" }));
    expect(attached().queryByText("Kaisora Commerce")).toBeNull();
  });

  it("sends the Commerce journey's interests and resets after the server confirms", async () => {
    send.mockResolvedValue({ status: "sent" } satisfies EnquiryState);
    renderPage();

    fireEvent.click(screen.getByText("Discuss my store"));
    fireEvent.click(checkbox("Inventory and stock alerts")!);
    fireEvent.click(checkbox("Order notifications")!);
    fireEvent.click(screen.getByRole("button", { name: "Commerce" }));
    fillForm();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    });

    await waitFor(() => expect(send).toHaveBeenCalledOnce());
    const data = send.mock.calls[0][1];
    expect(data.get("name")).toBe("Sherry Baptiste");
    expect(data.get("service")).toBe("E-commerce");
    expect(data.getAll("offer")).toEqual(["commerce"]);
    expect(data.getAll("feature")).toEqual(["inventory-alerts", "order-notifications"]);

    await screen.findByText(/your message is on its way/);
    expect(draft().getByText("0 modules")).toBeTruthy();
  });

  it("keeps the automation journey's interests when sending fails", async () => {
    send.mockResolvedValue({
      status: "failed",
      message: "Your message couldn't be sent.",
      errors: {},
      values: {
        name: "Sherry Baptiste",
        email: "sherry@example.com",
        company: "",
        service: "",
        message: "We sell jewellery and track stock in a spreadsheet.",
      },
    } satisfies EnquiryState);
    renderPage();

    fireEvent.click(screen.getByText("Discuss a workflow"));
    fireEvent.click(checkbox("Spreadsheet imports")!);
    fillForm();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    });

    await screen.findByText("Your message couldn't be sent.");
    expect(attached().getByText("Kaisora Workflow Automation")).toBeTruthy();
    expect(attached().getByText("Spreadsheet imports")).toBeTruthy();
    expect((screen.getByLabelText("Project details") as HTMLTextAreaElement).value).toContain(
      "jewellery",
    );
  });
});
