import { allSettled, fork } from 'effector';
import { expect, test } from 'vitest';

import { createModal } from '.';

type TestPayload = { name: string } | null;

test('Modal without transition must opens and closes', async () => {
    const modal = createModal();
    const scope = fork();

    expect(scope.getState(modal.$isOpen)).toBe(false);

    await allSettled(modal.open, { scope });

    expect(scope.getState(modal.$isOpen)).toBe(true);

    await allSettled(modal.close, { scope });

    expect(scope.getState(modal.$isOpen)).toBe(false);
});

test('Modal without transition must erase payload on close', async () => {
    const modal = createModal<TestPayload>({ withoutTransition: true, initialPayload: null });
    const scope = fork();

    const payload = { name: 'John' };

    expect(scope.getState(modal.$isOpen)).toBe(false);

    await allSettled(modal.open, { scope, params: payload });

    expect(scope.getState(modal.$isOpen)).toBe(true);
    expect(scope.getState(modal.$payload)).toEqual(payload);

    await allSettled(modal.close, { scope });

    expect(scope.getState(modal.$isOpen)).toBe(false);
    expect(scope.getState(modal.$payload)).toEqual(null);
});

test('Modal with transition must opens and fully closes after transition ends', async () => {
    const modal = createModal<TestPayload>({ initialPayload: null });
    const scope = fork();

    const payload = { name: 'John' };

    expect(scope.getState(modal.$isOpen)).toBe(false);

    await allSettled(modal.open, { scope, params: payload });

    expect(scope.getState(modal.$isOpen)).toBe(true);
    expect(scope.getState(modal.$payload)).toEqual(payload);

    await allSettled(modal.closeTransitionStarted, { scope });

    expect(scope.getState(modal.$isOpen)).toBe(false);
    expect(scope.getState(modal.$payload)).toEqual(payload);

    await allSettled(modal.closeTransitionEnded, { scope });

    expect(scope.getState(modal.$isOpen)).toBe(false);
    expect(scope.getState(modal.$payload)).toEqual(null);
});
