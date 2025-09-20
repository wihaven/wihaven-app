import { distributionRoute, sharedDistributionRoute } from '~/shared/routing';

import { DistributionPage } from './ui';

export const DistributionRouteView = {
    route: distributionRoute,
    view: DistributionPage,
};

export const SharedDistributionRouteView = {
    route: sharedDistributionRoute,
    view: DistributionPage,
};
