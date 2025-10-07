import { createEvent, createStore } from 'effector';
import { createAction } from 'effector-action';
import { readonly } from 'patronum';

import { createDisclosure } from '~/shared/lib/factories';

import { Expense, deserializeExpenses } from '../lib';

export const createDistributionReplaceConfirmationModel = () => {
    const disclosure = createDisclosure(false);
    const confirmed = createEvent<readonly Expense[]>();
    const denied = createEvent();

    const $expensesCandidate = createStore<readonly Expense[]>([]);

    const confirm = createAction({
        source: $expensesCandidate,
        target: { confirmed, close: disclosure.close },
        fn: (target, expenses) => {
            target.confirmed(expenses);
            target.close();
        },
    });

    const deny = createAction({
        target: { close: disclosure.close, denied },
        fn: (target) => {
            target.close();
            target.denied();
        },
    });

    const open = createAction({
        target: {
            open: disclosure.open,
            $expensesCandidate,
            deny,
        },
        fn: (target, raw: string) => {
            const expenses = deserializeExpenses(raw);

            if (expenses.length === 0) {
                target.deny();
                return;
            }

            target.open();
            target.$expensesCandidate(expenses);
        },
    });

    return {
        $opened: disclosure.$isOpen,
        open,
        confirm,
        deny,
        $expensesCandidate: readonly($expensesCandidate),
        confirmed: readonly(confirmed),
        denied: readonly(denied),
    };
};
