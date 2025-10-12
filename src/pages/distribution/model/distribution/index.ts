import { pipe } from 'effect';
import * as A from 'effect/Array';
import * as N from 'effect/Number';
import * as O from 'effect/Option';
import { combine } from 'effector';
import { createAction } from 'effector-action';

import { distributionRoute, sharedDistributionRoute } from '~/shared/routing';

import { CalculatedExpense, Expense } from '../../lib';
import { createExpensesModel } from '../expense';
import { createIncomeForm } from '../income/form';
import { createDistributionReplaceModel } from './replace';
import { createDistributionReplaceConfirmationModel } from './replace-confirmation';

const createDistributionModel = () => {
    const income = createIncomeForm();
    const expenses = createExpensesModel();

    const distributionReplace = createDistributionReplaceModel();
    const distributionReplaceConfirmation = createDistributionReplaceConfirmationModel({
        open: sharedDistributionRoute.opened.map((params) => params.params.distribution),
        // NOTE: parse distribution from url if exists -> open distribution page with parsed value and clear distribution from url
        confirmed: createAction({
            target: {
                replaceAll: expenses.replaceAll,
                distributionRouteOpen: distributionRoute.open,
            },
            fn: (target, expenses: readonly Expense[]) => {
                target.replaceAll(expenses);
                target.distributionRouteOpen();
            },
        }),
        denied: distributionRoute.open.prepend(() => {}),
    });

    return {
        income,

        expenses: {
            ...expenses,
            $expenses: combine(income.fields.income.$value, expenses.$items, (income, expenses) =>
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
            ),
        },

        distributionReplace,
        distributionReplaceConfirmation,
    };
};

export const distributionModel = createDistributionModel();
