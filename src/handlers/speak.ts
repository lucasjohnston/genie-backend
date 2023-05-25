import { Wrap } from '../helpers'
import express from 'express'

const speak = express.Router()

/*
 * GET /speak
 * @description Speak route returns a response to the user with next steps
 */
speak.get(
  '/',
  Wrap(async (req: express.Request, res: express.Response) => {
    // fetch latest prisma record
    // if there's something new, return
    // else return timeout

    return res.status(200).json({
      message: `work in progress`,
    })
  }),
)

export default speak
