import { createHistoryRouter, createRoute, createRouterControls } from 'atomic-router';

export const homeRoute = createRoute();
export const distributionRoute = createRoute();

const routes = [{ path: '/', route: distributionRoute }];

export const controls = createRouterControls();

export const router = createHistoryRouter({ routes, controls });
