import { Event, Scope, createWatch } from 'effector';
import { vi } from 'vitest';

type EventWatcherParams = {
    event: Event<unknown>;
    scope: Scope;
};

export const eventWatcher = ({ event, scope }: EventWatcherParams) => {
    const fn = vi.fn();

    const unwatch = createWatch({
        unit: event,
        fn,
        scope,
    });

    return { fn, unwatch };
};
