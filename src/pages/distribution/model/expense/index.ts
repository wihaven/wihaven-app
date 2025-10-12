import { Array as A, flow } from 'effect';
import { combine, createStore, sample } from 'effector';
import { createAction } from 'effector-action';
import { persist } from 'effector-storage/local';
import { nanoid } from 'nanoid';
import { readonly } from 'patronum';

import { Expense, ValidatedExpenseDraft, foldNumberInputValueToNumber } from '../../lib';
import { createExpenseCreationModel } from './creation';
import { createExpenseEditModel } from './edit';
import { createRemoveExpenseConfirmationModel } from './remove';

export const createExpensesModel = () => {
    const $items = createStore<readonly Expense[]>([]);

    const $notDistributedPercent = $items.map(
        flow(
            A.reduce(0, (acc, expense) => acc + expense.percent),
            (distributedPercent) => 100 - distributedPercent,
        ),
    );

    const remove = createAction({
        target: $items,
        fn: (target, id: Expense['id']) => target(A.filter((expense) => expense.id !== id)),
    });
    const removeConfirmation = createRemoveExpenseConfirmationModel();
    sample({
        clock: removeConfirmation.confirmed,
        target: remove,
    });

    const update = createAction({
        target: $items,
        fn: (target, updatedExpense: Expense) => target(A.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense))),
    });
    const edit = createExpenseEditModel({ $notDistributedPercent });
    sample({
        clock: edit.form.validatedAndSubmitted,
        target: [update, edit.form.reinit],
    });

    const push = createAction({
        target: $items,
        fn: (target, draft: ValidatedExpenseDraft) => target(A.append({ ...draft, id: nanoid() })),
    });
    const creation = createExpenseCreationModel({ $notDistributedPercent });
    sample({
        clock: creation.form.validatedAndSubmitted,
        target: [push, creation.form.reinit],
    });

    persist({
        key: 'expenses',
        store: $items,
    });

    return {
        replaceAll: createAction({
            target: $items,
            fn: (target, expenses: readonly Expense[]) => target(expenses),
        }),

        remove: removeConfirmation,
        creation,
        edit,
        $items: readonly($items),
        $notDistributedPercent: combine(
            {
                notDistributedPercent: $notDistributedPercent,
                currentEditedExpense: edit.$current,
                expenseEditFormValue: edit.form.fields.percent.$value.map(foldNumberInputValueToNumber),
                expenseCreationFormValue: creation.form.fields.percent.$value.map(foldNumberInputValueToNumber),
            },
            ({ notDistributedPercent, currentEditedExpense, expenseEditFormValue, expenseCreationFormValue }) => {
                if (currentEditedExpense !== null) {
                    return notDistributedPercent + currentEditedExpense.percent - expenseCreationFormValue - expenseEditFormValue;
                }

                return notDistributedPercent - expenseCreationFormValue;
            },
        ),
    };
};
