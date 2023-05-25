import 'reflect-metadata'

import express, { Express, Request, Response } from 'express'
import Routes from './routes'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
app.set('port', process.env.PORT || 3001)
app.set('ip', process.env.IP || 'localhost')

const router = express.Router()
Routes.forEach((route: { path: string; route: express.Router }) => {
  router.use(route.path, route.route)
})

app.use(router)
app.listen(app.get('port'), async () => {
  // Announce server is live
  console.log(
    `⚡️[server]: Server is running at http://${app.get('ip')}:${app.get(
      'port',
    )}`,
  )
})
