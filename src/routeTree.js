import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';
import { Route as gameRoute } from './routes/game';
import { Route as highScoresRoute } from './routes/high-scores';

const routeTree = rootRoute.addChildren([
  indexRoute,
  gameRoute,
  highScoresRoute,
]);

export { routeTree };
