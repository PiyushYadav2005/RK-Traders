/** Thrown deliberately in controllers for expected failure cases
 * (not found, unauthorized, validation) so the error handler can
 * map them to the right status code and a clean client-facing message. */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
