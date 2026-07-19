import nodemailer from "nodemailer";
import { notifyConfig, isEmailConfigured } from "../config/notifications.js";

let transporter = null;

function getTransporter() {
  if (!isEmailConfigured) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: notifyConfig.smtp.host,
      port: notifyConfig.smtp.port,
      secure: notifyConfig.smtp.port === 465,
      auth: { user: notifyConfig.smtp.user, pass: notifyConfig.smtp.pass },
    });
  }
  return transporter;
}

/**
 * Sends an email if SMTP is configured; otherwise logs and no-ops so order/
 * enquiry creation never fails just because email isn't set up yet.
 * Returns { sent: boolean, reason?: string }
 */
export async function sendEmail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.warn(`[email] SMTP not configured — skipping email "${subject}" to ${to}`);
    return { sent: false, reason: "not_configured" };
  }

  try {
    await t.sendMail({ from: notifyConfig.smtp.from, to, subject, html });
    console.log(`[email] ✅ Sent "${subject}" to ${to}`);
    return { sent: true };
  } catch (err) {
    console.error("[email] ❌ Send failed:", err.message);
    return { sent: false, reason: err.message };
  }
}

// ─── Professional Business Alert Email ────────────────────────────────────────

export function orderNotificationHtml(order, notes = "") {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n ?? 0);

  const formatDate = (d) => {
    const date = new Date(d ?? Date.now());
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  const addr = order.shippingAddress ?? {};
  const paymentLabel =
    order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod?.toUpperCase();

  const itemRows = (order.items ?? [])
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">
          <strong style="color:#0a1128;">${i.name}</strong>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">SKU: ${i.sku ?? "—"}</div>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:center;color:#334155;">${i.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right;color:#334155;">${formatINR(i.unitPrice)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;color:#0a1128;">${formatINR(i.lineTotal)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>New Order — RK Traders</title>
</head>
<body style="margin:0;padding:0;font-family:Inter,Helvetica,Arial,sans-serif;background:#f1f5f9;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(10,17,40,0.08);max-width:600px;">

      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#0a1128 0%,#1e3a8a 100%);padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">⚡ RK Traders</div>
                <div style="font-size:12px;color:#93c5fd;margin-top:2px;">Electrical Wholesale & Retail — Lucknow</div>
              </td>
              <td align="right">
                <div style="background:#ffd500;color:#0a1128;font-weight:700;font-size:11px;padding:6px 14px;border-radius:20px;display:inline-block;">NEW ORDER</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Order ID Banner -->
      <tr>
        <td style="background:#0057ff;padding:14px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="font-size:11px;color:#93c5fd;text-transform:uppercase;letter-spacing:1px;">Order ID</div>
                <div style="font-size:20px;font-weight:700;color:#ffffff;font-family:monospace;">${order.orderNumber}</div>
              </td>
              <td align="right">
                <div style="font-size:11px;color:#bfdbfe;">${formatDate(order.createdAt)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Body -->
      <tr><td style="padding:28px 32px;">

        <!-- Customer Details -->
        <div style="font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Customer Details</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;padding:16px;margin-bottom:24px;">
          <tr>
            <td style="padding:4px 0;">
              <span style="color:#64748b;font-size:12px;">Name</span><br/>
              <strong style="color:#0a1128;font-size:15px;">${addr.name ?? "—"}</strong>
            </td>
            <td style="padding:4px 0;">
              <span style="color:#64748b;font-size:12px;">Phone</span><br/>
              <strong style="color:#0a1128;font-size:15px;">${addr.phone ?? "—"}</strong>
            </td>
          </tr>
          <tr><td colspan="2" style="padding-top:12px;">
            <span style="color:#64748b;font-size:12px;">Delivery Address</span><br/>
            <span style="color:#0a1128;font-size:13px;">${addr.line1 ?? ""}, ${addr.city ?? ""}, ${addr.state ?? ""} — ${addr.pincode ?? ""}</span>
          </td></tr>
          <tr><td colspan="2" style="padding-top:10px;">
            <span style="background:#ffd500;color:#0a1128;font-size:11px;font-weight:700;padding:4px 12px;border-radius:12px;">${paymentLabel}</span>
          </td></tr>
        </table>

        <!-- Products -->
        <div style="font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Products Ordered</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Rate</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <!-- Totals -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td width="55%"></td>
            <td width="45%">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;padding:16px;">
                <tr>
                  <td style="padding:4px 0;color:#64748b;font-size:13px;">Subtotal</td>
                  <td style="padding:4px 0;text-align:right;color:#334155;font-size:13px;">${formatINR(order.pricing?.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#64748b;font-size:13px;">GST (18%)</td>
                  <td style="padding:4px 0;text-align:right;color:#334155;font-size:13px;">${formatINR(order.pricing?.gstAmount)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0 4px;border-top:2px solid #e2e8f0;color:#0a1128;font-weight:700;font-size:15px;">Total</td>
                  <td style="padding:10px 0 4px;border-top:2px solid #e2e8f0;text-align:right;color:#0057ff;font-weight:700;font-size:15px;">${formatINR(order.pricing?.total)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${notes ? `
        <!-- Order Notes -->
        <div style="background:#fffbeb;border-left:4px solid #ffd500;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:24px;">
          <div style="font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Order Notes</div>
          <div style="color:#78350f;font-size:13px;">${notes}</div>
        </div>` : ""}

        <!-- CTA -->
        <div style="text-align:center;margin:24px 0 8px;">
          <a href="http://localhost:5173/admin/orders" style="background:#0057ff;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;">View Order in Dashboard →</a>
        </div>

      </td></tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:12px;color:#64748b;">
                <strong style="color:#0a1128;">RK Traders</strong> — Shop No. 1, Raj Rani Complex, Aminabad, Lucknow<br/>
                📞 +91-93359-12637 &nbsp;|&nbsp; Mon–Sat, 9:30 AM–8:30 PM
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Customer Confirmation Email ──────────────────────────────────────────────

export function customerConfirmationHtml(order) {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n ?? 0);

  const addr = order.shippingAddress ?? {};
  const paymentLabel =
    order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod?.toUpperCase();

  const itemRows = (order.items ?? [])
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">
          <strong style="color:#0a1128;">${i.name}</strong>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">SKU: ${i.sku ?? "—"}</div>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:center;color:#334155;">${i.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right;color:#334155;">${formatINR(i.unitPrice)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;color:#0a1128;">${formatINR(i.lineTotal)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Order Confirmed — RK Traders</title></head>
<body style="margin:0;padding:0;font-family:Inter,Helvetica,Arial,sans-serif;background:#f1f5f9;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(10,17,40,0.08);max-width:600px;">
      <tr>
        <td style="background:linear-gradient(135deg,#0a1128 0%,#1e3a8a 100%);padding:28px 32px;text-align:center;">
          <div style="font-size:40px;margin-bottom:8px;">✅</div>
          <div style="font-size:22px;font-weight:800;color:#ffffff;">Order Confirmed!</div>
          <div style="font-size:13px;color:#93c5fd;margin-top:4px;">Thank you for shopping with RK Traders</div>
        </td>
      </tr>
      <tr><td style="padding:28px 32px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:12px;color:#64748b;margin-bottom:4px;">Your Order ID</div>
          <div style="font-size:24px;font-weight:700;color:#0057ff;font-family:monospace;">${order.orderNumber}</div>
        </div>

        <div style="background:#f0fdf4;border-radius:10px;padding:14px 18px;margin-bottom:24px;text-align:center;">
          <div style="color:#166534;font-size:13px;">Your order has been received and our team will contact you shortly to confirm delivery.</div>
        </div>

        <!-- Customer Details -->
        <div style="font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Delivery Details</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;padding:16px;margin-bottom:24px;">
          <tr>
            <td style="padding:4px 0;">
              <span style="color:#64748b;font-size:12px;">Name</span><br/>
              <strong style="color:#0a1128;font-size:15px;">${addr.name ?? "—"}</strong>
            </td>
            <td style="padding:4px 0;">
              <span style="color:#64748b;font-size:12px;">Phone</span><br/>
              <strong style="color:#0a1128;font-size:15px;">${addr.phone ?? "—"}</strong>
            </td>
          </tr>
          <tr><td colspan="2" style="padding-top:12px;">
            <span style="color:#64748b;font-size:12px;">Delivery Address</span><br/>
            <span style="color:#0a1128;font-size:13px;">${addr.line1 ?? ""}, ${addr.city ?? ""}, ${addr.state ?? ""} — ${addr.pincode ?? ""}</span>
          </td></tr>
          <tr><td colspan="2" style="padding-top:10px;">
            <span style="background:#ffd500;color:#0a1128;font-size:11px;font-weight:700;padding:4px 12px;border-radius:12px;">${paymentLabel}</span>
          </td></tr>
        </table>

        <!-- Products -->
        <div style="font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Your Order</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Rate</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <!-- Totals -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td width="55%"></td>
            <td width="45%">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;padding:16px;">
                <tr>
                  <td style="padding:4px 0;color:#64748b;font-size:13px;">Subtotal</td>
                  <td style="padding:4px 0;text-align:right;color:#334155;font-size:13px;">${formatINR(order.pricing?.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#64748b;font-size:13px;">GST (18%)</td>
                  <td style="padding:4px 0;text-align:right;color:#334155;font-size:13px;">${formatINR(order.pricing?.gstAmount)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0 4px;border-top:2px solid #e2e8f0;color:#0a1128;font-weight:700;font-size:15px;">Total</td>
                  <td style="padding:10px 0 4px;border-top:2px solid #e2e8f0;text-align:right;color:#0057ff;font-weight:700;font-size:15px;">${formatINR(order.pricing?.total)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;text-align:center;">
          Questions? Call us: <strong style="color:#0a1128;">+91-93359-12637</strong><br/>
          <span style="color:#94a3b8;">Mon–Sat, 9:30 AM–8:30 PM</span>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function enquiryNotificationHtml(enquiry) {
  return `
    <h2>New website enquiry</h2>
    <p><strong>Name:</strong> ${enquiry.name}</p>
    <p><strong>Phone:</strong> ${enquiry.phone}</p>
    <p><strong>Message:</strong><br/>${enquiry.message}</p>
  `;
}
