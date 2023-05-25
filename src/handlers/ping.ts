import { Wrap } from '../helpers'
import express from 'express'

const ping = express.Router()

/*
 * GET /ping/
 * @description Health check / ping route
 */
ping.get(
  '/',
  Wrap(async (req: express.Request, res: express.Response) => {
    return res.status(200).json({
      message: 'pong',
    })
  }),
)

export default ping
