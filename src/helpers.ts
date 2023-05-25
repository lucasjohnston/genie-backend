import * as express from 'express'

/**
 * A higher-order function that wraps an async callback to properly trigger the
 * Express error-handling middleware on errors.
 */
export const Wrap =
  (fn: Function) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }
