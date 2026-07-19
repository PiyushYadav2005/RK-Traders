import { WholesaleRequest } from "../models/WholesaleRequest.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/email.js";
import { sendWhatsAppMessage } from "../utils/whatsapp.js";
import { notifyConfig } from "../config/notifications.js";

function generateRequestNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `RKW${y}${m}-${rand}`;
}

function notificationHtml(req) {
  return `
    <h2>New wholesale request: ${req.requestNumber}</h2>
    <p><strong>Customer:</strong> ${req.customerName} (${req.customerType})</p>
    ${req.companyName ? `<p><strong>Company:</strong> ${req.companyName} ${req.gstNumber ? `— GST: ${req.gstNumber}` : ""}</p>` : ""}
    <p><strong>Phone:</strong> ${req.phone} ${req.whatsapp ? `| WhatsApp: ${req.whatsapp}` : ""}</p>
    ${req.email ? `<p><strong>Email:</strong> ${req.email}</p>` : ""}
    <p><strong>Required products:</strong> ${req.requiredProducts}</p>
    ${req.bulkQuantity ? `<p><strong>Bulk quantity:</strong> ${req.bulkQuantity}</p>` : ""}
    ${req.expectedBudget ? `<p><strong>Expected budget:</strong> ${req.expectedBudget}</p>` : ""}
    ${req.deliveryAddress ? `<p><strong>Delivery address:</strong> ${req.deliveryAddress}</p>` : ""}
    ${req.additionalRequirements ? `<p><strong>Additional requirements:</strong> ${req.additionalRequirements}</p>` : ""}
  `;
}

export const createWholesaleRequest = asyncHandler(async (req, res) => {
  const { customerName, phone, customerType, requiredProducts } = req.body;

  if (!customerName || !phone || !customerType || !requiredProducts) {
    throw new ApiError(
      400,
      "Customer name, phone, customer type, and required products are required"
    );
  }

  const request = await WholesaleRequest.create({
    ...req.body,
    requestNumber: generateRequestNumber(),
    statusHistory: [{ status: "pending" }],
  });

  if (notifyConfig.businessEmail) {
    sendEmail({
      to: notifyConfig.businessEmail,
      subject: `New wholesale request ${request.requestNumber} — ${customerName}`,
      html: notificationHtml(request),
    }).catch(() => {});
  }

  if (notifyConfig.businessWhatsapp) {
    sendWhatsAppMessage(
      notifyConfig.businessWhatsapp,
      `New wholesale request ${request.requestNumber} from ${customerName} (${phone}, ${customerType}): ${requiredProducts}`
    ).catch(() => {});
  }

  res.status(201).json({ success: true, request });
});

// Admin
export const listWholesaleRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const requests = await WholesaleRequest.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: requests.length, requests });
});

export const updateWholesaleRequestStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  if (!["pending", "processing", "quoted", "completed", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const request = await WholesaleRequest.findById(req.params.id);
  if (!request) throw new ApiError(404, "Wholesale request not found");

  request.status = status;
  request.statusHistory.push({ status, note });
  await request.save();

  res.json({ success: true, request });
});
