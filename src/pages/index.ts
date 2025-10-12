import { createRoutesView } from 'atomic-router-react';

import { DistributionRouteView, SharedDistributionRouteView } from './distribution';

export const Routes = createRoutesView({
    routes: [SharedDistributionRouteView, DistributionRouteView],
});
