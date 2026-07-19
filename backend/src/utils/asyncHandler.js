/** Wraps an async route handler so rejected promises are forwarded to
 * Express's error middleware instead of needing a try/catch in every
 * controller. */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
