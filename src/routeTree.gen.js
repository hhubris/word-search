/* eslint-disable */
// This file was manually created for JavaScript compatibility
// TanStack Router CLI generates TypeScript by default

import { Route as rootRouteImport } from './routes/__root'
import { Route as HighScoresRouteImport } from './routes/high-scores'
import { Route as GameRouteImport } from './routes/game'
import { Route as IndexRouteImport } from './routes/index'

const HighScoresRoute = HighScoresRouteImport.update({
  id: '/high-scores',
  path: '/high-scores',
  getParentRoute: () => rootRouteImport,
})

const GameRoute = GameRouteImport.update({
  id: '/game',
  path: '/game',
  getParentRoute: () => rootRouteImport,
})

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
})

const rootRouteChildren = {
  IndexRoute: IndexRoute,
  GameRoute: GameRoute,
  HighScoresRoute: HighScoresRoute,
}

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
