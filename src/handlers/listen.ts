import processRequest from '../functions/process'
import { Wrap } from '../helpers'
import express from 'express'
import * as jf from 'joiful'

const listen = express.Router()

/*
 * GET /listen
 * @description Listen route accepts text and begins processing their request
 */
class Schema {
  constructor(obj: object) {
    Object.assign(this, obj)
  }

  @jf.string().required()
  input!: string
}
listen.get(
  '/',
  Wrap(async (req: express.Request, res: express.Response) => {
    const params = new Schema(req.query)
    const { error } = jf.validate(params)
    if (error) {
      return res.status(400).json({
        message: error.message,
      })
    }

    const rsp = await processRequest(params.input)
    return res.status(200).json({
      message: rsp,
    })
  }),
)

export default listen
