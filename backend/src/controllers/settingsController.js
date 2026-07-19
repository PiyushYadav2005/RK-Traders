import { Settings } from "../models/Settings.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne({ key: "shop" });
  if (!settings) {
    settings = await Settings.create({ key: "shop" });
  }
  res.json({ success: true, settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOneAndUpdate({ key: "shop" }, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  res.json({ success: true, settings });
});
