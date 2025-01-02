import { combine, sample } from 'effector';

import { N, O, RA, pipe } from '~/shared/lib/fp-ts';

import { CalculatedExpense, ValidatedExpenseDraft } from '../lib';
import { createExpenseCreationModel } from './expense-form';
import { createExpensesModel } from './expenses';
import { createIncomeForm } from './income-form';

const createDistributionModel = () => {
    const { $expenses, push, remove } = createExpensesModel();
    const incomeForm = createIncomeForm();
    const { expenseForm, expenseCreation } = createExpenseCreationModel({ $expenses });

    sample({
        clock: expenseForm.validatedAndSubmitted,
        fn: (draft) => draft as ValidatedExpenseDraft,
        target: push,
    });

    sample({
        clock: expenseForm.validatedAndSubmitted,
        target: expenseForm.reset,
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
        clock: expenseForm.reset,
        target: expenseCreation.deactivate,
    });

    return {
        incomeDraftSubmitted: incomeForm.submit,
        incomeField: incomeForm.fields.income,

        $expenses: $calculatedExpenses,
        expenseRemoved: remove,
        expenseDraftSubmitted: expenseForm.submit,
        expenseCreationReset: expenseForm.reset,
        expenseNameField: expenseForm.fields.name,
        expensePercentField: expenseForm.fields.percent,
        expenseCreation,
    };
};

export const distributionModel = createDistributionModel();
