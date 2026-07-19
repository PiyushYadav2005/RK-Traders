import { Dealer } from "../models/Dealer.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerDealer = asyncHandler(async (req, res) => {
  const existing = await Dealer.findOne({ user: req.user._id });
  if (existing) {
    throw new ApiError(409, "You've already submitted a dealer application");
  }

  const dealer = await Dealer.create({ ...req.body, user: req.user._id });

  await User.findByIdAndUpdate(req.user._id, { dealerStatus: "pending" });

  res.status(201).json({ success: true, dealer });
});

export const getMyDealerProfile = asyncHandler(async (req, res) => {
  const dealer = await Dealer.findOne({ user: req.user._id });
  if (!dealer) throw new ApiError(404, "No dealer application found");
  res.json({ success: true, dealer });
});

// Admin
export const listDealers = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const dealers = await Dealer.find(filter).populate("user", "name email phone");
  res.json({ success: true, count: dealers.length, dealers });
});

export const updateDealerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const dealer = await Dealer.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!dealer) throw new ApiError(404, "Dealer application not found");

  await User.findByIdAndUpdate(dealer.user, {
    dealerStatus: status,
    ...(status === "approved" ? { role: "dealer" } : {}),
  });

  res.json({ success: true, dealer });
});
