import { pipe } from 'effect';
import * as O from 'effect/Option';
import { Store, combine, createStore, sample } from 'effector';
import { createAction } from 'effector-action';
import { readonly } from 'patronum';

import { Expense } from '../../lib';
import { createExpenseForm } from './form';

export type CreateExpenseEditModelParams = {
    $notDistributedPercent: Store<number>;
};
export const createExpenseEditModel = ({ $notDistributedPercent }: CreateExpenseEditModelParams) => {
    const $current = createStore<Expense | null>(null);

    const form = createExpenseForm({
        $notDistributedPercent: combine(
            { notDistributedPercent: $notDistributedPercent, currentEditedExpense: $current },
            ({ notDistributedPercent, currentEditedExpense }) => notDistributedPercent + (currentEditedExpense?.percent ?? 0),
        ),
    });

    const validatedAndSubmitted = sample({
        clock: sample({
            clock: form.validatedAndSubmitted,
            source: $current,
            fn: (expense, validatedExpenseDraft) =>
                pipe(
                    expense,
                    O.fromNullable,
                    O.map((nonEmptyExpense) => ({ ...validatedExpenseDraft, id: nonEmptyExpense.id })),
                    O.getOrNull,
                ),
        }),
        filter: Boolean,
    });

    const started = createAction({
        target: {
            $current,
            name: form.fields.name.onChange,
            percent: form.fields.percent.onChange,
        },
        fn: (target, expense: Expense) => {
            target.$current(expense);
            target.name(expense.name);
            target.percent(expense.percent);
        },
    });

    const reinit = createAction({
        target: {
            form: form.reinit,
            $current,
        },
        fn: (target) => {
            target.form();
            target.$current.reinit();
        },
    });

    return {
        form: { ...form, reinit, validatedAndSubmitted },

        started,
        $current: readonly($current),
    };
};
