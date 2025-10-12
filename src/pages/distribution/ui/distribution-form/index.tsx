import { Button, Stack, Text } from '@mantine/core';

import { IconPlus } from '@tabler/icons-react';
import clsx from 'clsx';
import { useUnit } from 'effector-react';

import { distributionModel } from '../../model/distribution';
import { ExpenseForm } from '../expense-form';
import { ExpensesList } from '../expenses-list';
import { Share } from '../share';
import styles from './distribution-form.module.scss';
import { DistributionReplace } from './distribution-replace';
import { IncomeInput } from './income-input';

const expensesTitle = 'Статьи расходов';
const notDistributedPercentLabel = 'Нераспределено:\xa0';
const allPercentsDistributedLabel = 'Все проценты распределены';
const percentsDistributionOverflowed = 'Вы пытаетесь распределить лишние\xa0';

const foldNotDistributedPercentToLabel = (notDistributedPercent: number) => {
    if (notDistributedPercent === 0) return allPercentsDistributedLabel;
    if (notDistributedPercent > 0) return `${notDistributedPercentLabel}${notDistributedPercent}%`;

    return `${percentsDistributionOverflowed}${-1 * notDistributedPercent}%`;
};

const addMoreButtonLabel = 'Добавить';

const expenses = distributionModel.expenses;

export const DistributionForm = () => {
    const { expenseCreationActive, notDistributedPercent, expenseCreationToggled } = useUnit({
        expenseCreationActive: expenses.creation.modal.$isOpen,
        expenseCreationToggled: expenses.creation.modal.toggle,
        notDistributedPercent: expenses.$notDistributedPercent,
    });

    const distributionLabel = foldNotDistributedPercentToLabel(notDistributedPercent);
    const distributionHasOverflow = notDistributedPercent < 0;
    const distributionIsCompleted = notDistributedPercent === 0;

    return (
        <Stack component="section" className={styles.root}>
            <header className={styles.header}>
                <IncomeInput className={styles.incomeInput} />
                <DistributionReplace />
                <Share />
            </header>
            <Stack component="section" className={styles.distribution}>
                <header className={styles.distributionHeader}>
                    <span className={styles.expensesTitle}>{expensesTitle}</span>
                    <Text
                        className={clsx(
                            styles.distributionStatus,
                            distributionHasOverflow && styles.overflow,
                            distributionIsCompleted && styles.completed,
                        )}
                    >
                        {distributionLabel}
                    </Text>
                    {
                        // TODO: <DistributionToolbar className={styles.distributionToolbar} />
                    }
                </header>
                <ExpensesList />
                {expenseCreationActive ? (
                    <ExpenseForm form={expenses.creation.form} />
                ) : (
                    <Button leftSection={<IconPlus />} variant="transparent" onClick={expenseCreationToggled}>
                        {addMoreButtonLabel}
                    </Button>
                )}
            </Stack>
        </Stack>
    );
};
