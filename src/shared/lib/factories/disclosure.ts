import { Predicate as P } from 'effect';
import { createStore, sample } from 'effector';
import { createAction } from 'effector-action';
import { readonly } from 'patronum';

export const createDisclosure = (initialState = false) => {
    const $isOpen = createStore(initialState);

    const open = createAction({
        source: $isOpen,
        target: $isOpen,
        fn: (target) => target(true),
    });

    const close = createAction({
        target: $isOpen,
        fn: (target) => target(false),
    });

    const toggle = createAction({
        target: $isOpen,
        fn: (target) => target((isOpen) => !isOpen),
    });

    const set = createAction({
        target: $isOpen,
        fn: (target, isOpen: boolean) => target(isOpen),
    });

    const closed = sample({
        clock: $isOpen,
        filter: P.not(Boolean),
    });

    const opened = sample({
        clock: $isOpen,
        filter: Boolean,
    });

    return {
        $isOpen: readonly($isOpen),
        open,
        close,
        toggle,
        set,

        closed,
        opened,
    };
};

export type Disclosure = ReturnType<typeof createDisclosure>;
