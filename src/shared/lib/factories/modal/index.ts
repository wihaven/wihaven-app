/* eslint-disable no-redeclare -- need to override the function declaration */
import { EventCallable, Store, createStore } from 'effector';
import { createAction } from 'effector-action';
import { readonly } from 'patronum';

export type CreateModalParams<Payload, WithoutTransition extends boolean> = unknown extends Payload
    ? undefined
    : {
          initialPayload: Payload;
          withoutTransition?: WithoutTransition;
      };

type ModalBase<Payload> = unknown extends Payload
    ? {
          $isOpen: Store<boolean>;
          open: EventCallable<void>;
          toggle: EventCallable<void>;
      }
    : {
          $payload: Store<Payload>;
          $isOpen: Store<boolean>;
          open: EventCallable<Payload>;
      };

export type ModalWithTransition<Payload = unknown> = ModalBase<Payload> & {
    closeTransitionStarted: EventCallable<void>;
    closeTransitionEnded: EventCallable<void>;
};
export type ModalWithoutTransition<Payload = unknown> = ModalBase<Payload> & {
    close: EventCallable<void>;
};

type CreateModalReturnType<Payload, WithoutTransition> = unknown extends Payload
    ? ModalWithoutTransition<Payload>
    : WithoutTransition extends true
      ? ModalWithoutTransition<Payload>
      : ModalWithTransition<Payload>;

export function createModal(): ModalWithoutTransition<unknown>;
export function createModal<Payload>(params: CreateModalParams<Payload, false>): CreateModalReturnType<Payload, false>;
export function createModal<Payload>(params: CreateModalParams<Payload, true>): CreateModalReturnType<Payload, true>;
export function createModal<Payload>(params?: CreateModalParams<Payload, boolean>): CreateModalReturnType<Payload, boolean> {
    const $isOpen = createStore(false);
    if (params !== undefined) {
        const $payload = createStore<Payload>(params.initialPayload);

        const open = createAction({
            target: {
                $isOpen,
                $payload,
            },
            fn: (target, payload: Payload) => {
                target.$payload(payload);
                target.$isOpen(true);
            },
        });

        const base = {
            open,
            $payload: readonly($payload),
            $isOpen: readonly($isOpen),
        };

        if (params?.withoutTransition === true) {
            // @ts-expect-error ModalWithoutTransition returns in other cases
            return {
                ...base,
                close: createAction({
                    target: {
                        $isOpen,
                        $payload,
                    },
                    fn: (target) => {
                        target.$isOpen.reinit();
                        target.$payload.reinit();
                    },
                }),
            };
        }

        // @ts-expect-error ModalWithoutTransition returns in other cases
        return {
            ...base,
            closeTransitionStarted: createAction({
                target: $isOpen,
                fn: (target) => target.reinit(),
            }),
            closeTransitionEnded: createAction({
                target: $payload,
                fn: (target) => target.reinit(),
            }),
        };
    }

    // @ts-expect-error Simple modal if no params
    return {
        $isOpen: readonly($isOpen),
        open: createAction({
            target: $isOpen,
            fn: (target) => target(true),
        }),
        close: createAction({
            target: $isOpen,
            fn: (target) => target.reinit(),
        }),
        toggle: createAction({
            target: $isOpen,
            fn: (target) => target((isOpen) => !isOpen),
        }),
    };
}
