import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  sendEmail,
  orderNotificationHtml,
  customerConfirmationHtml,
} from "../utils/email.js";
import { sendWhatsAppMessage, buildWhatsAppLink } from "../utils/whatsapp.js";
import { notifyConfig } from "../config/notifications.js";

// ─── Sequential Order Number ──────────────────────────────────────────────────
// Format: RKYYMMxxxx e.g. RK2407-0001
// Finds the highest existing number for the current month and increments.
async function generateOrderNumber() {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `RK${yy}${mm}`;

  const last = await Order.findOne(
    { orderNumber: { $regex: `^${prefix}` } },
    { orderNumber: 1 },
    { sort: { orderNumber: -1 } }
  );

  let seq = 1;
  if (last) {
    const lastSeq = parseInt(last.orderNumber.replace(prefix, ""), 10);
    if (!isNaN(lastSeq)) seq = lastSeq + 1;
  }

  return `${prefix}${String(seq).padStart(4, "0")}`;
}

// ─── Guest Checkout ───────────────────────────────────────────────────────────
/**
 * POST /api/orders/guest
 * No login required. Validates all required fields server-side, re-prices
 * every line from the real Product record (never trusts client prices),
 * saves the order, then fires email notifications best-effort.
 */
export const createGuestOrder = asyncHandler(async (req, res) => {
  const { customer, shippingAddress, items, paymentMethod = "cod", notes } = req.body;

  // ── Field validation ──────────────────────────────────────────────────────
  const errors = {};
  if (!customer?.name?.trim()) errors.name = "Full name is required";
  if (!customer?.phone?.trim()) {
    errors.phone = "Mobile number is required";
  } else if (!/^[0-9]{10}$/.test(customer.phone.trim())) {
    errors.phone = "Enter a valid 10-digit mobile number";
  }
  if (!shippingAddress?.line1?.trim()) errors.line1 = "Address is required";
  if (!shippingAddress?.city?.trim()) errors.city = "City is required";
  if (!shippingAddress?.state?.trim()) errors.state = "State is required";
  if (!shippingAddress?.pincode?.trim()) {
    errors.pincode = "Pincode is required";
  } else if (!/^[0-9]{6}$/.test(shippingAddress.pincode.trim())) {
    errors.pincode = "Enter a valid 6-digit pincode";
  }
  if (!Array.isArray(items) || items.length === 0) {
    errors.items = "Cart is empty";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  // ── Find or create guest user ─────────────────────────────────────────────
  let user = await User.findOne({ phone: customer.phone.trim() });
  if (!user) {
    user = await User.create({
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || `guest-${customer.phone.trim()}@rktraders.local`,
      password: Math.random().toString(36).slice(2) + "Aa1!", // unusable random password
    });
  }

  // ── Re-price server-side ───────────────────────────────────────────────────
  // NEVER trust prices from the client.
  const orderItems = [];
  let subtotal = 0;

  for (const line of items) {
    const product = await Product.findById(line.productId);
    if (!product || !product.isActive) {
      throw new ApiError(400, `Product no longer available: ${line.name || line.productId}`);
    }

    const quantity = Math.max(1, Number(line.quantity) || 1);

    // FIX: fallback wholesalePrice to retailPrice when not set, preventing NaN
    const wholesalePrice =
      product.pricing.wholesalePrice > 0
        ? product.pricing.wholesalePrice
        : product.pricing.retailPrice;

    const minWholesaleQty = product.pricing.minWholesaleQty || 9999;
    const unitPrice =
      quantity >= minWholesaleQty ? wholesalePrice : product.pricing.retailPrice;

    // Guard: ensure unitPrice is a valid number
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      throw new ApiError(500, `Invalid price for product: ${product.name}`);
    }

    const lineTotal = unitPrice * quantity;
    subtotal += lineTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      unitPrice,
      quantity,
      lineTotal,
    });
  }

  const gstAmount = Math.round(subtotal * 0.18);
  const total = subtotal + gstAmount;

  // ── Create order ──────────────────────────────────────────────────────────
  const orderNumber = await generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    user: user._id,
    orderType: "retail",
    items: orderItems,
    pricing: { subtotal, gstAmount, shippingFee: 0, total },
    shippingAddress: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      line1: shippingAddress.line1.trim(),
      line2: shippingAddress.line2?.trim() || "",
      city: shippingAddress.city.trim(),
      state: shippingAddress.state.trim(),
      pincode: shippingAddress.pincode.trim(),
    },
    paymentMethod,
    status: "placed",
    statusHistory: [{ status: "placed", note: notes?.trim() || "" }],
  });

  // ── Best-effort notifications ─────────────────────────────────────────────
  // Order is already saved — email/WhatsApp failures do NOT cancel the order.
  let emailResult = { sent: false, reason: "not_configured" };
  let customerEmailResult = { sent: false, reason: "not_configured" };

  if (notifyConfig.businessEmail) {
    emailResult = await sendEmail({
      to: notifyConfig.businessEmail,
      subject: `🛒 New Order ${order.orderNumber} — ${customer.name} | RK Traders`,
      html: orderNotificationHtml(order, notes?.trim() || ""),
    }).catch((err) => {
      console.error("[email] Business notification failed:", err.message);
      return { sent: false, reason: err.message };
    });
  }

  // Optional: customer confirmation if they provided email
  if (customer.email?.trim()) {
    customerEmailResult = await sendEmail({
      to: customer.email.trim(),
      subject: `Your RK Traders Order has been Received — ${order.orderNumber}`,
      html: customerConfirmationHtml(order),
    }).catch((err) => {
      console.error("[email] Customer confirmation failed:", err.message);
      return { sent: false, reason: err.message };
    });
  }

  // WhatsApp summary
  let whatsappLink = null;
  const waSummary = `New order ${order.orderNumber} from ${customer.name} (${customer.phone}) — ${orderItems.length} item(s), total ₹${total}. Address: ${shippingAddress.line1}, ${shippingAddress.city}.`;

  if (notifyConfig.businessWhatsapp) {
    sendWhatsAppMessage(notifyConfig.businessWhatsapp, waSummary).catch(() => {});
    whatsappLink = buildWhatsAppLink(notifyConfig.businessWhatsapp, waSummary);
  }

  res.status(201).json({
    success: true,
    order,
    whatsappLink,
    notifications: {
      businessEmail: emailResult,
      customerEmail: customerEmailResult,
    },
  });
});

// ─── Public: get order by orderNumber ─────────────────────────────────────────
export const getOrder = asyncHandler(async (req, res) => {
  const { orderNumber } = req.params;
  if (!orderNumber) throw new ApiError(400, "Order number is required");

  const order = await Order.findOne({ orderNumber }).populate(
    "items.product",
    "name slug images"
  );
  if (!order) throw new ApiError(404, "Order not found");
  res.json({ success: true, order });
});

// ─── Admin: get single order by MongoDB _id ───────────────────────────────────
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name phone email")
    .populate("items.product", "name slug images");
  if (!order) throw new ApiError(404, "Order not found");
  res.json({ success: true, order });
});

// ─── Admin: list all orders ────────────────────────────────────────────────────
export const listOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const filter = status && status !== "all" ? { status } : {};

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name phone email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: orders.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    orders,
  });
});

// ─── Admin: update order status ───────────────────────────────────────────────
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const validStatuses = ["placed", "confirmed", "packed", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = status;
  order.statusHistory.push({ status, note: note || "", at: new Date() });
  await order.save();

  res.json({ success: true, order });
});

// ─── Admin: delete order ───────────────────────────────────────────────────────
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  res.json({ success: true, message: "Order deleted" });
});
