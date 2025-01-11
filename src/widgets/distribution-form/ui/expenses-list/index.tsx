import { ActionIcon, Paper, Text, Title, Tooltip } from '@mantine/core';

import { IconTrash } from '@tabler/icons-react';
import { useList, useUnit } from 'effector-react';

import { formatAsRubles } from '~/shared/lib/currency';

import { distributionModel } from '../../model';
import styles from './expenses-list.module.scss';

const deleteButtonLabel = 'Удалить статью расходов';

export const ExpensesList = () => {
    const expenseRemoved = useUnit(distributionModel.expenseRemoved);
    return useList(distributionModel.$expenses, {
        fn: (expense) => (
            <Paper className={styles.root}>
                <Title order={3} className={styles.title}>
                    {expense.name}
                </Title>
                <Tooltip label={deleteButtonLabel}>
                    <ActionIcon color="red" className={styles.delete} onClick={() => expenseRemoved(expense.id)}>
                        <IconTrash />
                    </ActionIcon>
                </Tooltip>
                <Text className={styles.percent}>{expense.percent}%</Text>
                {expense.sum !== undefined && <Text className={styles.sum}>{formatAsRubles(expense.sum)}</Text>}
            </Paper>
        ),
        getKey: (expense) => expense.id,
        keys: [],
    });
};
