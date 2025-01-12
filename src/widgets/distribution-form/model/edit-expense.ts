import { Store, combine, createEvent, createStore, sample } from 'effector';
import { pipe } from 'fp-ts/lib/function';
import { readonly, spread } from 'patronum';

import { O } from '~/shared/lib/fp-ts';

import { Expense } from '../lib';
import { createExpenseForm } from './expense-form';

export type CreateExpenseEditModelParams = {
    $notDistributedPercent: Store<number>;
};
export const createExpenseEditModel = ({ $notDistributedPercent }: CreateExpenseEditModelParams) => {
    const $currentEditedExpense = createStore<Expense | null>(null);
    const expenseEditStarted = createEvent<Expense>();

    const form = createExpenseForm({
        $notDistributedPercent: combine(
            { notDistributedPercent: $notDistributedPercent, currentEditedExpense: $currentEditedExpense },
            ({ notDistributedPercent, currentEditedExpense }) => notDistributedPercent + (currentEditedExpense?.percent ?? 0),
        ),
    });

    const validatedAndSubmitted = sample({
        clock: sample({
            clock: form.validatedAndSubmitted,
            source: $currentEditedExpense,
            fn: (expense, validatedExpenseDraft) =>
                pipe(
                    expense,
                    O.fromNullable,
                    O.map((nonEmptyExpense) => ({ ...validatedExpenseDraft, id: nonEmptyExpense.id })),
                    O.toNullable,
                ),
        }),
        filter: Boolean,
    });

    sample({
        clock: expenseEditStarted,
        target: [
            $currentEditedExpense,
            spread({
                name: form.name.change,
                percent: form.percent.change,
            }),
        ],
    });

    sample({
        clock: form.reset,
        fn: () => null,
        target: $currentEditedExpense,
    });

    return {
        expenseEditForm: {
            ...form,
            validatedAndSubmitted,
        },

        expenseEditStarted,
        $currentEditedExpense: readonly($currentEditedExpense),
    };
};
