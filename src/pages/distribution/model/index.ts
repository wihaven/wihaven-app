import { pipe } from 'effect';
import * as A from 'effect/Array';
import * as N from 'effect/Number';
import * as O from 'effect/Option';
import { combine, sample } from 'effector';

import { createDisclosure } from '~/shared/lib/factories';
import { distributionRoute, sharedDistributionRoute } from '~/shared/routing';

import { CalculatedExpense, foldNumberInputValueToNumber } from '../lib';
import { createDistributionReplaceModel } from './distribution-replace';
import { createDistributionReplaceConfirmationModel } from './distribution-replace-confirmation';
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
        replaceAll,
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
            O.liftPredicate(N.isNumber),
            O.map((income) =>
                pipe(
                    expenses,
                    A.map((expense): CalculatedExpense => ({ ...expense, sum: (income * expense.percent) / 100 })),
                ),
            ),
            O.getOrElse((): readonly CalculatedExpense[] => expenses),
        ),
    );

    sample({
        clock: expenseCreationForm.reset,
        target: expenseCreation.deactivate,
    });

    const distributionReplace = createDistributionReplaceModel();

    const distributionReplaceConfirmation = createDistributionReplaceConfirmationModel();
    sample({
        clock: sharedDistributionRoute.opened,
        fn: (params) => params.params.distribution,
        target: distributionReplaceConfirmation.open,
    });

    // NOTE: parse distribution from url if exists -> open distribution page with parsed value and clear distribution from url
    sample({
        clock: distributionReplaceConfirmation.confirmed,
        target: [replaceAll, distributionRoute.open],
    });

    sample({
        clock: distributionReplaceConfirmation.denied,
        target: distributionRoute.open,
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

        distributionReplace,
        distributionReplaceConfirmation,
    };
};

export const distributionModel = createDistributionModel();
