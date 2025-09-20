import { Array as A, flow } from 'effect';
import { createStore } from 'effector';
import { createAction } from 'effector-action';
import { persist } from 'effector-storage/local';
import { nanoid } from 'nanoid';
import { readonly } from 'patronum';

import { Expense, ValidatedExpenseDraft } from '../lib';

type RemovingExpense = Pick<Expense, 'id' | 'name'>;

export const createExpensesModel = () => {
    const $expenses = createStore<readonly Expense[]>([]);
    const $removingExpense = createStore<RemovingExpense | null>(null);

    const $removingExpenseId = $removingExpense.map((expense) => expense?.id ?? null);
    const $isRemoveInProgress = createStore(false);

    const $notDistributedPercent = $expenses.map(
        flow(
            A.reduce(0, (acc, expense) => acc + expense.percent),
            (distributedPercent) => 100 - distributedPercent,
        ),
    );

    const replaceAll = createAction({
        target: $expenses,
        fn: (target, expenses: readonly Expense[]) => target(expenses),
    });

    const push = createAction({
        target: $expenses,
        fn: (target, draft: ValidatedExpenseDraft) => target(A.append({ ...draft, id: nanoid() })),
    });

    const remove = createAction({
        target: $expenses,
        fn: (target, id: Expense['id']) => target(A.filter((expense) => expense.id !== id)),
    });

    const removeStarted = createAction({
        target: {
            $removingExpense,
            $isRemoveInProgress,
        },
        fn: (target, removingExpense: RemovingExpense) => {
            target.$removingExpense(removingExpense);
            target.$isRemoveInProgress(true);
        },
    });

    const removeEndedTransitionStarted = createAction({
        target: $isRemoveInProgress,
        fn: (target) => target(false),
    });

    const removeEnded = createAction({
        target: $removingExpense,
        fn: (target) => target.reinit(),
    });

    const removeConfirmed = createAction({
        source: $removingExpenseId,
        target: {
            remove,
            removeEndedTransitionStarted,
        },
        fn: (target, removingExpenseId) => {
            if (removingExpenseId === null) return;

            target.remove(removingExpenseId);
            target.removeEndedTransitionStarted();
        },
    });

    const update = createAction({
        target: $expenses,
        fn: (target, updatedExpense: Expense) => target(A.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense))),
    });

    persist({
        key: 'expenses',
        store: $expenses,
    });

    return {
        replaceAll,
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
