import * as express from 'express'
import root from './handlers/root'
import ping from './handlers/ping'
import listen from './handlers/listen'
import speak from './handlers/speak'

type Route = {
  path: string
  route: express.Router
}

const Routes: Route[] = [
  { path: '/', route: root },
  { path: '/ping', route: ping },
  { path: '/listen', route: listen },
  { path: '/speak', route: speak },
]
export default Routes
