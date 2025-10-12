import { Event, EventCallable } from 'effector';
import { createAction } from 'effector-action';
import { readonly } from 'patronum';

import { createModal } from '~/shared/lib/factories/modal';

import { Expense, deserializeExpenses } from '../../lib';

export type CreateDistributionReplaceConfirmationModelParams = {
    open: Event<string>;
    confirmed: EventCallable<readonly Expense[]>;
    denied: EventCallable<void>;
};

export const createDistributionReplaceConfirmationModel = ({ open, confirmed, denied }: CreateDistributionReplaceConfirmationModelParams) => {
    const modal = createModal<readonly Expense[]>({ initialPayload: [], withoutTransition: true });

    const confirm = createAction({
        source: modal.$payload,
        target: { confirmed, close: modal.close },
        fn: (target, expenses) => {
            target.confirmed(expenses);
            target.close();
        },
    });

    const deny = createAction({
        target: { close: modal.close, denied },
        fn: (target) => {
            target.close();
            target.denied();
        },
    });

    createAction(open, {
        target: {
            open: modal.open,
            deny,
        },
        fn: (target, raw: string) => {
            const expenses = deserializeExpenses(raw);

            if (expenses.length === 0) {
                target.deny();
                return;
            }

            target.open(expenses);
        },
    });

    return {
        $opened: modal.$isOpen,
        open,
        confirm,
        deny,
        $expensesCandidate: modal.$payload,
        confirmed: readonly(confirmed),
        denied: readonly(denied),
    };
};
