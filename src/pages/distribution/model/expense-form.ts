import { Store } from 'effector';

import { createForm } from '~/shared/lib/factories/form';

import { ExpenseDraftNameContract, ExpenseDraftPercentContract } from '../lib';

export type CreateExpenseFormParams = {
    $notDistributedPercent: Store<number>;
};

export const createExpenseForm = ({ $notDistributedPercent }: CreateExpenseFormParams) => {
    const expenseForm = createForm({
        name: {
            initialValue: '',
            validation: ExpenseDraftNameContract,
        },
        percent: {
            initialValue: '' as number | '',
            validation: $notDistributedPercent.map((notDistributedPercent) =>
                ExpenseDraftPercentContract.refine((percent) => notDistributedPercent - percent >= 0, {
                    error: 'Сумма всех процентов не может превышать 100%',
                }),
            ),
        },
    });

    return {
        name: expenseForm.fields.name,
        percent: expenseForm.fields.percent,
        submit: expenseForm.submit,
        reset: expenseForm.reinit,
        validatedAndSubmitted: expenseForm.validatedAndSubmitted,
    };
};

export type ExpenseFormModel = ReturnType<typeof createExpenseForm>;
export type ExpenseFormViewModel = Omit<ExpenseFormModel, 'validatedAndSubmitted'>;
