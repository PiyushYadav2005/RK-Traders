import { Enquiry } from "../models/Enquiry.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail, enquiryNotificationHtml } from "../utils/email.js";
import { sendWhatsAppMessage } from "../utils/whatsapp.js";
import { notifyConfig } from "../config/notifications.js";

export const createEnquiry = asyncHandler(async (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !phone || !message) {
    throw new ApiError(400, "Name, phone, and message are required");
  }

  const enquiry = await Enquiry.create({ name, phone, message });

  if (notifyConfig.businessEmail) {
    const emailRes = await sendEmail({
      to: notifyConfig.businessEmail,
      subject: `New enquiry from ${name}`,
      html: enquiryNotificationHtml(enquiry),
    });
    if (!emailRes.sent) {
      console.error("[email] Failed to send enquiry notification email");
    }
  }

  if (notifyConfig.businessWhatsapp) {
    sendWhatsAppMessage(
      notifyConfig.businessWhatsapp,
      `New website enquiry from ${name} (${phone}): ${message}`
    ).catch(() => {});
  }

  res.status(201).json({ success: true, enquiry });
});

// Admin
export const listEnquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: enquiries.length, enquiries });
});
