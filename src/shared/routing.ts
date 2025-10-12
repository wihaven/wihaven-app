import { createHistoryRouter, createRoute, createRouterControls } from 'atomic-router';

export const distributionRoute = createRoute();
export const sharedDistributionRoute = createRoute<{ distribution: string }>();

const routes = [
    { path: '/:distribution', route: sharedDistributionRoute },
    { path: '/', route: distributionRoute },
];

export const controls = createRouterControls();

export const router = createHistoryRouter({ routes, controls });
