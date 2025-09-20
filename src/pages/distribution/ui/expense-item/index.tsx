import { ActionIcon, Paper, Text, Title, Tooltip } from '@mantine/core';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useUnit } from 'effector-react';

import { formatAsRubles } from '~/shared/lib/currency';

import { CalculatedExpense } from '../../lib';
import { distributionModel } from '../../model';
import styles from './expense-item.module.scss';

const editButtonLabel = 'Изменить статью расходов';
const deleteButtonLabel = 'Удалить статью расходов';

interface ExpenseItemProps {
    expense: CalculatedExpense;
}

export const ExpenseItem = ({ expense }: ExpenseItemProps) => {
    const { onExpenseRemove, onExpenseEdit } = useUnit({
        onExpenseRemove: distributionModel.expenseRemoveStarted,
        onExpenseEdit: distributionModel.expenseEditStarted,
    });

    return (
        <Paper className={styles.root}>
            <Title order={3} className={styles.title}>
                {expense.name}
            </Title>
            <Tooltip label={editButtonLabel}>
                <ActionIcon color="gray" className={styles.edit} onClick={() => onExpenseEdit(expense)}>
                    <IconPencil />
                </ActionIcon>
            </Tooltip>
            <Tooltip label={deleteButtonLabel}>
                <ActionIcon color="red" className={styles.delete} onClick={() => onExpenseRemove(expense)}>
                    <IconTrash />
                </ActionIcon>
            </Tooltip>

            <Text className={styles.percent}>{expense.percent}%</Text>
            {expense.sum !== undefined && <Text className={styles.sum}>{formatAsRubles(expense.sum)}</Text>}
        </Paper>
    );
};
