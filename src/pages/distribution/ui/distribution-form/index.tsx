import { Button, Stack, Text } from '@mantine/core';

import { IconPlus } from '@tabler/icons-react';
import clsx from 'clsx';
import { useUnit } from 'effector-react';

import { distributionModel } from '../../model';
import { DistributionReplace } from '../distribution-replace';
import { ExpenseForm } from '../expense-form';
import { ExpensesList } from '../expenses-list';
import { IncomeInput } from '../income-input';
import { RemoveConfirmation } from '../remove-confirmation';
import { Share } from '../share';
import styles from './distribution-form.module.scss';
import { DistributionToolbar } from './distribution-toolbar';

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

export const DistributionForm = () => {
    const { expenseCreationActive, notDistributedPercent, expenseCreationToggled } = useUnit({
        expenseCreationActive: distributionModel.expenseCreation.$isOpen,
        notDistributedPercent: distributionModel.$notDistributedPercent,

        expenseCreationToggled: distributionModel.expenseCreation.toggle,
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
                    <DistributionToolbar className={styles.distributionToolbar} />
                </header>
                <ExpensesList />
                {expenseCreationActive ? (
                    <ExpenseForm form={distributionModel.expenseCreationForm} />
                ) : (
                    <Button leftSection={<IconPlus />} variant="transparent" onClick={expenseCreationToggled}>
                        {addMoreButtonLabel}
                    </Button>
                )}
            </Stack>
            <RemoveConfirmation />
        </Stack>
    );
};
