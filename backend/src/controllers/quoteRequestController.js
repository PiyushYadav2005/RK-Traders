import { QuoteRequest } from "../models/QuoteRequest.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/email.js";
import { sendWhatsAppMessage } from "../utils/whatsapp.js";
import { notifyConfig } from "../config/notifications.js";

function generateQuoteNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `RKQ${y}${m}-${rand}`;
}

function notificationHtml(q) {
  return `
    <h2>New quote request: ${q.quoteNumber}</h2>
    <p><strong>Name:</strong> ${q.fullName} ${q.company ? `(${q.company})` : ""}</p>
    <p><strong>Phone:</strong> ${q.phone} ${q.email ? `| Email: ${q.email}` : ""}</p>
    ${q.gstNumber ? `<p><strong>GST:</strong> ${q.gstNumber}</p>` : ""}
    ${q.address ? `<p><strong>Address:</strong> ${q.address}</p>` : ""}
    ${q.projectType ? `<p><strong>Project type:</strong> ${q.projectType}</p>` : ""}
    ${q.productCategory ? `<p><strong>Category:</strong> ${q.productCategory}</p>` : ""}
    ${q.brand ? `<p><strong>Brand:</strong> ${q.brand}</p>` : ""}
    <p><strong>Required products:</strong> ${q.requiredProducts}</p>
    ${q.quantity ? `<p><strong>Quantity:</strong> ${q.quantity}</p>` : ""}
    ${q.budget ? `<p><strong>Budget:</strong> ${q.budget}</p>` : ""}
    ${q.message ? `<p><strong>Message:</strong><br/>${q.message}</p>` : ""}
  `;
}

export const createQuoteRequest = asyncHandler(async (req, res) => {
  const { fullName, phone, requiredProducts } = req.body;

  if (!fullName || !phone || !requiredProducts) {
    throw new ApiError(400, "Full name, phone, and required products are required");
  }

  const quote = await QuoteRequest.create({
    ...req.body,
    quoteNumber: generateQuoteNumber(),
  });

  if (notifyConfig.businessEmail) {
    const emailRes = await sendEmail({
      to: notifyConfig.businessEmail,
      subject: `New quote request ${quote.quoteNumber} — ${fullName}`,
      html: notificationHtml(quote),
    });
    if (!emailRes.sent) {
      console.error("[email] Failed to send quote notification email");
    }
  }

  if (notifyConfig.businessWhatsapp) {
    sendWhatsAppMessage(
      notifyConfig.businessWhatsapp,
      `New quote request ${quote.quoteNumber} from ${fullName} (${phone}): ${requiredProducts}`
    ).catch(() => {});
  }

  res.status(201).json({ success: true, quote });
});

// Admin
export const listQuoteRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const quotes = await QuoteRequest.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: quotes.length, quotes });
});

export const updateQuoteStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["new", "reviewing", "quoted", "closed"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }
  const quote = await QuoteRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!quote) throw new ApiError(404, "Quote request not found");
  res.json({ success: true, quote });
});
