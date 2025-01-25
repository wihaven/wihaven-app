import { createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';
import { nanoid } from 'nanoid';
import { readonly } from 'patronum';

import { RA, constFalse, constNull, constTrue, flow, pipe } from '~/shared/lib/fp-ts';

import { Expense, ValidatedExpenseDraft } from '../lib';

type RemovingExpense = Pick<Expense, 'id' | 'name'>;

export const createExpensesModel = () => {
    const push = createEvent<ValidatedExpenseDraft>();
    const removeStarted = createEvent<RemovingExpense>();
    const removeConfirmed = createEvent();
    const removeEndedTransitionStarted = createEvent();
    const removeEnded = createEvent();
    const remove = createEvent<Expense['id']>();
    const update = createEvent<Expense>();

    const $expenses = createStore<readonly Expense[]>([]);
    const $removingExpense = createStore<RemovingExpense | null>(null);

    const $removingExpenseId = $removingExpense.map((expense) => expense?.id ?? null);
    const $isRemoveInProgress = createStore(false);

    const $notDistributedPercent = $expenses.map(
        flow(
            RA.reduce(0, (acc, expense) => acc + expense.percent),
            (distributedPercent) => 100 - distributedPercent,
        ),
    );

    sample({
        clock: push,
        source: $expenses,
        fn: (expenses, draft) => pipe(expenses, RA.concat([{ ...draft, id: nanoid() }])),
        target: $expenses,
    });

    sample({
        clock: removeStarted,
        target: $removingExpense,
    });

    sample({
        clock: removeStarted,
        fn: constTrue,
        target: $isRemoveInProgress,
    });

    sample({
        clock: removeEndedTransitionStarted,
        fn: constFalse,
        target: $isRemoveInProgress,
    });

    sample({
        clock: removeEnded,
        fn: constNull,
        target: $removingExpense,
    });

    sample({
        clock: removeConfirmed,
        source: $removingExpenseId,
        filter: Boolean,
        target: [remove, removeEndedTransitionStarted],
    });

    sample({
        clock: remove,
        source: $expenses,
        fn: (expenses, id) =>
            pipe(
                expenses,
                RA.filter((expense) => expense.id !== id),
            ),
        target: $expenses,
    });

    sample({
        clock: update,
        source: $expenses,
        fn: (expenses, updatedExpense) =>
            pipe(
                expenses,
                RA.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)),
            ),
        target: $expenses,
    });

    persist({ store: $expenses, key: 'expenses' });

    return {
        push,
        removeStarted,
        removeConfirmed,
        removeEndedTransitionStarted,
        removeEnded,
        update,
        $expenses: readonly($expenses),
        $notDistributedPercent,
        $isRemoveInProgress,
        $removingExpense: readonly($removingExpense),
    };
};
