import { createEvent, createStore } from 'effector';
import { createAction } from 'effector-action';
import { readonly } from 'patronum';

import { createDisclosure } from '~/shared/lib/factories';

import { Expense, deserializeExpenses } from '../lib';

export const createDistributionReplaceConfirmationModel = () => {
    const { activate, deactivate, $active } = createDisclosure(false);
    const confirmed = createEvent<readonly Expense[]>();
    const denied = createEvent();

    const $expensesCandidate = createStore<readonly Expense[]>([]);

    const confirm = createAction({
        source: $expensesCandidate,
        target: { confirmed, deactivate },
        fn: (target, expenses) => {
            target.confirmed(expenses);
            target.deactivate();
        },
    });

    const deny = createAction({
        target: { deactivate, denied },
        fn: (target) => {
            target.deactivate();
            target.denied();
        },
    });

    const open = createAction({
        target: {
            activate,
            $expensesCandidate,
            deny,
        },
        fn: (target, raw: string) => {
            const expenses = deserializeExpenses(raw);

            if (expenses.length === 0) {
                target.deny();
                return;
            }

            target.activate();
            target.$expensesCandidate(expenses);
        },
    });

    return {
        $opened: readonly($active),
        open,
        confirm,
        deny,
        $expensesCandidate: readonly($expensesCandidate),
        confirmed: readonly(confirmed),
        denied: readonly(denied),
    };
};
