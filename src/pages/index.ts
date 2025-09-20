import { createRoutesView } from 'atomic-router-react';

import { DistributionRouteView, SharedDistributionRouteView } from './distribution';
import { HomeRouteView } from './home';

export const Routes = createRoutesView({
    routes: [HomeRouteView, SharedDistributionRouteView, DistributionRouteView],
});
