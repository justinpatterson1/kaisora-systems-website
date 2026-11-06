import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sendEnquiry } from "./send-enquiry";

vi.mock("botid/server", () => ({ checkBotId: vi.fn(async () => ({ isBot: false })) }));

/* No real email is ever sent: Resend is a stubbed fetch. */
const fetchMock = vi.fn();

function form(fields: Record<string, string | string[]>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    for (const item of Array.isArray(value) ? value : [value]) data.append(key, item);
  }
  return data;
}

const VALID = {
  name: "Sherry Baptiste",
  email: "sherry@example.com",
  company: "",
  service: "E-commerce",
  message: "We sell jewellery and track stock in a spreadsheet.",
};

const sentBody = () => JSON.parse(fetchMock.mock.calls[0][1].body as string);

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("sendEnquiry", () => {
  it("emails the enquiry with its offers and features named", async () => {
    const state = await sendEnquiry(
      { status: "idle" },
      form({
        ...VALID,
        offer: ["commerce", "commerce"],
        feature: ["order-notifications", "inventory-alerts"],
      }),
    );

    expect(state).toEqual({ status: "sent" });
    expect(fetchMock).toHaveBeenCalledOnce();
    const body = sentBody();
    expect(body.reply_to).toBe(VALID.email);
    expect(body.text).toContain("Interested in: E-commerce");
    expect(body.text).toContain("Offers: Kaisora Commerce\n");
    expect(body.text).toContain(
      "Features of interest:\n- Inventory and stock alerts (inventory-alerts)\n- Order notifications (order-notifications)",
    );
    expect(body.html).toContain("Kaisora Commerce");
  });

  it("escapes what the visitor typed in the HTML email", async () => {
    await sendEnquiry(
      { status: "idle" },
      form({ ...VALID, name: "<b>Sherry</b>", message: 'Hello <script>alert("x")</script> there' }),
    );
    const { html } = sentBody();
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;b&gt;Sherry&lt;/b&gt;");
  });

  it("rejects an unknown feature without sending", async () => {
    const state = await sendEnquiry(
      { status: "idle" },
      form({ ...VALID, feature: ["inventory-alerts", "crypto-wallet"] }),
    );

    expect(state.status).toBe("invalid");
    expect(fetchMock).not.toHaveBeenCalled();
    if (state.status === "invalid") expect(state.values.message).toBe(VALID.message);
  });

  it("rejects a service that isn't offered", async () => {
    const state = await sendEnquiry({ status: "idle" }, form({ ...VALID, service: "Mobile apps" }));
    expect(state.status).toBe("invalid");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("still accepts the original service options", async () => {
    const state = await sendEnquiry(
      { status: "idle" },
      form({ ...VALID, service: "Backend systems & APIs" }),
    );
    expect(state).toEqual({ status: "sent" });
  });

  it("reports failure, keeping what was typed, when Resend refuses", async () => {
    fetchMock.mockResolvedValue(new Response("nope", { status: 500 }));
    const state = await sendEnquiry({ status: "idle" }, form(VALID));

    expect(state.status).toBe("failed");
    if (state.status === "failed") {
      expect(state.values).toEqual(VALID);
      expect(state.message).toContain("info@kaisorasystems.com");
    }
  });

  it("never claims success without an API key", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const state = await sendEnquiry({ status: "idle" }, form(VALID));
    expect(state.status).toBe("failed");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("quietly drops a bot that filled the honeypot", async () => {
    const state = await sendEnquiry({ status: "idle" }, form({ ...VALID, website: "spam.example" }));
    expect(state).toEqual({ status: "sent" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps enquiry text out of the logs", async () => {
    fetchMock.mockResolvedValue(new Response(`bad address ${VALID.email}`, { status: 422 }));
    await sendEnquiry({ status: "idle" }, form(VALID));

    const logged = JSON.stringify(vi.mocked(console.error).mock.calls);
    expect(logged).not.toContain(VALID.email);
    expect(logged).not.toContain(VALID.message);
  });
});
