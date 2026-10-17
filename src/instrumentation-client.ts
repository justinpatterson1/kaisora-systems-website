import { initBotId } from "botid/client/core";

/**
 * Vercel BotID: attaches an invisible challenge token to protected requests,
 * which `checkBotId()` in `sendEnquiry` verifies. No CAPTCHA is shown.
 *
 * The contact form sits in the footer of every page, the 404 included, and a
 * Server Action POSTs to whatever page it was submitted from, so every POST
 * is protected. Its script loads through this origin (`withBotId` in
 * next.config.ts), so the CSP needs no new hosts.
 */
initBotId({
  protect: [{ path: "/*", method: "POST" }],
});
