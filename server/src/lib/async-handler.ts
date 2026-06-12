import type { RequestHandler } from 'express';

/**
 * Async handler wrapper. Express 4 does NOT forward a rejected promise to the
 * centralised error handler — an unhandled rejection in an `async` route would
 * otherwise crash the process. Wrapping a handler in `ah()` catches any
 * rejection and forwards it to `next`, so it lands in the error middleware
 * (→ 500) instead of taking the server down.
 *
 *   meRouter.get('/profile', ah(async (req, res) => { … }));
 */
export const ah =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
