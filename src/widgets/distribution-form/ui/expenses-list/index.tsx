import { useList, useStoreMap } from 'effector-react';

import { distributionModel } from '../../model';
import { ExpenseForm } from '../expense-form';
import { ExpenseItem } from '../expense-item';

export const ExpensesList = () => {
    const currentEditedExpenseId = useStoreMap(distributionModel.$currentEditedExpense, (expense) => expense?.id ?? null);

    return useList(distributionModel.$expenses, {
        fn: (expense) =>
            currentEditedExpenseId === expense.id ? <ExpenseForm form={distributionModel.expenseEditForm} /> : <ExpenseItem expense={expense} />,
        getKey: (expense) => expense.id,
        keys: [currentEditedExpenseId],
    });
};
