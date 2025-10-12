import { useList, useStoreMap } from 'effector-react';

import { distributionModel } from '../../model/distribution';
import { ExpenseForm } from '../expense-form';
import { ExpenseItem } from './expense-item';
import { RemoveConfirmation } from './remove-confirmation';

export const ExpensesList = () => {
    const currentEditedExpenseId = useStoreMap(distributionModel.expenses.edit.$current, (expense) => expense?.id ?? null);

    return (
        <>
            {useList(distributionModel.expenses.$expenses, {
                fn: (expense) =>
                    currentEditedExpenseId === expense.id ? (
                        <ExpenseForm form={distributionModel.expenses.edit.form} />
                    ) : (
                        <ExpenseItem expense={expense} />
                    ),
                getKey: (expense) => expense.id,
                keys: [currentEditedExpenseId],
            })}
            <RemoveConfirmation />
        </>
    );
};
