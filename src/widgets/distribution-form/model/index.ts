import { combine, sample } from 'effector';

import { createDisclosure } from '~/shared/lib/factories';
import { N, O, RA, pipe } from '~/shared/lib/fp-ts';

import { CalculatedExpense, foldNumberInputValueToNumber } from '../lib';
import { createExpenseEditModel } from './edit-expense';
import { createExpenseForm } from './expense-form';
import { createExpensesModel } from './expenses';
import { createIncomeForm } from './income-form';

const createDistributionModel = () => {
    const incomeForm = createIncomeForm();
    const {
        $expenses,
        $notDistributedPercent,
        $isRemoveInProgress,
        $removingExpense,
        push,
        removeStarted,
        removeConfirmed,
        removeEndedTransitionStarted,
        removeEnded,
        update,
    } = createExpensesModel();
    const expenseCreationForm = createExpenseForm({ $notDistributedPercent });

    const { $currentEditedExpense, expenseEditStarted, expenseEditForm } = createExpenseEditModel({ $notDistributedPercent });

    const expenseCreation = createDisclosure(false);

    const $notDistributed = combine(
        {
            notDistributedPercent: $notDistributedPercent,
            currentEditedExpense: $currentEditedExpense,
            expenseEditFormValue: expenseEditForm.percent.$value.map(foldNumberInputValueToNumber),
            expenseCreationFormValue: expenseCreationForm.percent.$value.map(foldNumberInputValueToNumber),
        },
        ({ notDistributedPercent, currentEditedExpense, expenseEditFormValue, expenseCreationFormValue }) => {
            if (currentEditedExpense !== null) {
                return notDistributedPercent + currentEditedExpense.percent - expenseCreationFormValue - expenseEditFormValue;
            }

            return notDistributedPercent - expenseCreationFormValue;
        },
    );

    sample({
        clock: expenseCreationForm.validatedAndSubmitted,
        target: [push, expenseCreationForm.reset],
    });

    sample({
        clock: expenseEditForm.validatedAndSubmitted,
        target: [update, expenseEditForm.reset],
    });

    const $calculatedExpenses = combine(incomeForm.fields.income.$value, $expenses, (income, expenses) =>
        pipe(
            income,
            O.fromPredicate(N.isNumber),
            O.map((income) =>
                pipe(
                    expenses,
                    RA.map((expense): CalculatedExpense => ({ ...expense, sum: (income * expense.percent) / 100 })),
                ),
            ),
            O.getOrElse((): readonly CalculatedExpense[] => expenses),
        ),
    );

    sample({
        clock: expenseCreationForm.reset,
        target: expenseCreation.deactivate,
    });

    return {
        incomeDraftSubmitted: incomeForm.submit,
        incomeField: incomeForm.fields.income,

        $expenses: $calculatedExpenses,
        $isRemoveInProgress,
        $removingExpense,
        expenseRemoveStarted: removeStarted,
        expenseRemoveConfirmed: removeConfirmed,
        expenseRemoveEndedTransitionStarted: removeEndedTransitionStarted,
        expenseRemoveEnded: removeEnded,

        expenseCreation,
        expenseCreationForm,

        $currentEditedExpense,
        expenseEditStarted,
        expenseEditForm,

        $notDistributedPercent: $notDistributed,
    };
};

export const distributionModel = createDistributionModel();
