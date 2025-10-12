import { expectTypeOf, test } from 'vitest';

import { ModalWithTransition, ModalWithoutTransition, createModal } from '.';

type TestPayload = { name: string } | null;

test('Modal without transition and payload', () => {
    const modal = createModal();

    expectTypeOf(modal).toEqualTypeOf<ModalWithoutTransition>();
});

test('Modal with transition and payload', () => {
    const modal = createModal<TestPayload>({ initialPayload: null });

    expectTypeOf(modal).toEqualTypeOf<ModalWithTransition<TestPayload>>();
});

test('Modal without transition but with payload', () => {
    const modal = createModal<TestPayload>({ initialPayload: null, withoutTransition: true });

    expectTypeOf(modal).toEqualTypeOf<ModalWithoutTransition<TestPayload>>();
});
