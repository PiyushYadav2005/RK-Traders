import { notifyConfig, isWhatsappConfigured } from "../config/notifications.js";

/**
 * IMPORTANT — read before assuming this "just works":
 *
 * There is no free, unauthenticated way for a server to send a WhatsApp
 * message on your behalf. WhatsApp requires either:
 *   1. Twilio's WhatsApp API (what this file uses) — needs a Twilio account,
 *      a WhatsApp-enabled sender number, and has a small per-message cost.
 *   2. Meta's WhatsApp Cloud API directly — needs a Meta Business account,
 *      app review, and a verified phone number.
 *
 * Without TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_WHATSAPP_FROM set,
 * this function safely no-ops and logs what *would* have been sent — order
 * creation still succeeds either way. To turn it on, get Twilio WhatsApp
 * sandbox/production credentials and add them to backend/.env.
 */
export async function sendWhatsAppMessage(toNumberDigitsOnly, message) {
  if (!isWhatsappConfigured) {
    console.warn(
      `[whatsapp] Twilio not configured — would have sent to ${toNumberDigitsOnly}: "${message.slice(0, 80)}..."`
    );
    return { sent: false, reason: "not_configured" };
  }

  const { accountSid, authToken, fromWhatsApp } = notifyConfig.twilio;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const body = new URLSearchParams({
    From: fromWhatsApp,
    To: `whatsapp:+${toNumberDigitsOnly}`,
    Body: message,
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[whatsapp] Twilio send failed:", text);
      return { sent: false, reason: text };
    }
    return { sent: true };
  } catch (err) {
    console.error("[whatsapp] send failed:", err.message);
    return { sent: false, reason: err.message };
  }
}

/** Builds a wa.me deep link as a guaranteed-to-work fallback — opens on
 * the customer's own device with the message pre-filled, ready to send.
 * Useful to show on the frontend regardless of whether Twilio is configured. */
export function buildWhatsAppLink(toNumberDigitsOnly, message) {
  return `https://wa.me/${toNumberDigitsOnly}?text=${encodeURIComponent(message)}`;
}
