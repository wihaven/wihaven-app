import { createEvent } from 'effector';
import { createAction } from 'effector-action';
import { readonly } from 'patronum';

import { createModal } from '~/shared/lib/factories/modal';

import { Expense } from '../../lib';

type RemovingExpense = Pick<Expense, 'id' | 'name'>;

export const createRemoveExpenseConfirmationModel = () => {
    const modal = createModal<RemovingExpense | null>({ initialPayload: null });

    const confirmed = createEvent<Expense['id']>();

    const confirm = createAction({
        source: modal.$payload,
        target: {
            confirmed,
            modalClose: modal.closeTransitionStarted,
        },
        fn: (target, removingExpense) => {
            if (removingExpense === null) return;

            target.confirmed(removingExpense.id);
            target.modalClose();
        },
    });

    return {
        modal,
        started: modal.open,
        $isRemoveInProgress: modal.$isOpen,
        $current: modal.$payload,
        confirm,
        confirmed: readonly(confirmed),
    };
};
