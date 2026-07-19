import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Static admin credentials, checked here only — not stored as a User
 * document, not exposed to the frontend bundle. Override the defaults in
 * .env for anything beyond local development.
 */
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "RKtraders";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "India@123";

export const adminLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    throw new ApiError(401, "Invalid username or password");
  }

  const token = jwt.sign({ isAdminSession: true }, env.jwtSecret, { expiresIn: "12h" });
  res.json({ success: true, token });
});
