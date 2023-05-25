import { Wrap } from '../helpers'
import express from 'express'

const root = express.Router()

/*
 * GET /
 * @description Root route
 */
root.get(
  '/',
  Wrap(async (req: express.Request, res: express.Response) => {
    return res.status(200).json({
      message: `genie backend api (work in progress)`,
    })
  }),
)

export default root
