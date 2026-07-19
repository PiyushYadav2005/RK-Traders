import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";

/** Verifies the JWT from the Authorization header and attaches the user
 * (without password) to req.user. Throws 401 if missing/invalid. */
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    throw new ApiError(401, "Not authenticated — please log in");
  }

  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = user;
  next();
});

/** Restricts a route to specific roles. Use after `protect`.
 * Example: router.post('/', protect, authorize('admin'), handler) */
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "You don't have permission to do this");
    }
    next();
  };

/**
 * Verifies the admin panel's session token. The admin panel uses a static
 * username/password (checked in adminAuthController.js, not against a User
 * document — there's no admin signup flow), but once logged in, the panel
 * still needs the backend to actually enforce access — a frontend-only gate
 * would mean anyone who finds the API base URL could hit these routes
 * directly. So: on successful static-credential login we sign a real JWT
 * (same jsonwebtoken library already used elsewhere) with { isAdminSession: true },
 * and this middleware verifies that token on every admin-panel request
 * without needing a User lookup. No new auth library, but real protection.
 */
export const protectAdmin = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    throw new ApiError(401, "Admin session required — please log in");
  }

  const decoded = jwt.verify(token, env.jwtSecret);
  if (!decoded.isAdminSession) {
    throw new ApiError(403, "This token is not an admin session");
  }

  req.admin = true;
  next();
});
