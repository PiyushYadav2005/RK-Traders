import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { QuoteRequest } from "../models/QuoteRequest.js";
import { WholesaleRequest } from "../models/WholesaleRequest.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardSummary = asyncHandler(async (req, res) => {
  // Today's date range (midnight → now, IST-aware via UTC offset)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    productCount,
    orderCount,
    pendingOrders,
    confirmedOrders,
    completedOrders,
    cancelledOrders,
    todayOrders,
    quoteCount,
    newQuotes,
    wholesaleCount,
    customerCount,
    revenueAgg,
    todayRevenueAgg,
    recentOrders,
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.countDocuments({ status: "placed" }),
    Order.countDocuments({ status: "confirmed" }),
    Order.countDocuments({ status: "delivered" }),
    Order.countDocuments({ status: "cancelled" }),
    Order.countDocuments({ createdAt: { $gte: todayStart } }),
    QuoteRequest.countDocuments(),
    QuoteRequest.countDocuments({ status: "new" }),
    WholesaleRequest.countDocuments(),
    User.countDocuments({ role: "customer" }),
    // All-time revenue (all placed orders)
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$pricing.total" } } },
    ]),
    // Today's revenue
    Order.aggregate([
      { $match: { createdAt: { $gte: todayStart }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$pricing.total" } } },
    ]),
    // Recent 10 orders
    Order.find()
      .populate("user", "name phone email")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("orderNumber status pricing shippingAddress createdAt paymentMethod"),
  ]);

  res.json({
    success: true,
    summary: {
      productCount,
      orderCount,
      pendingOrders,
      confirmedOrders,
      completedOrders,
      cancelledOrders,
      todayOrders,
      quoteCount,
      newQuotes,
      wholesaleCount,
      customerCount,
      revenue: revenueAgg[0]?.total ?? 0,
      todayRevenue: todayRevenueAgg[0]?.total ?? 0,
      recentOrders,
    },
  });
});

export const listCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: { $in: ["customer", "dealer"] } })
    .select("name email phone role dealerStatus createdAt")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: customers.length, customers });
});
