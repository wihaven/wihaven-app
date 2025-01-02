import { createRoutesView } from 'atomic-router-react';

import { DistributionRouteView } from './distribution';
import { HomeRouteView } from './home';

export const Routes = createRoutesView({
    routes: [HomeRouteView, DistributionRouteView],
});
