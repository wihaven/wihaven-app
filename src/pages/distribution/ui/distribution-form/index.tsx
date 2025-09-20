import { Button, Fieldset, Stack, Text } from '@mantine/core';

import { IconPlus } from '@tabler/icons-react';
import clsx from 'clsx';
import { useUnit } from 'effector-react';

import { distributionModel } from '../../model';
import { ExpenseForm } from '../expense-form';
import { ExpensesList } from '../expenses-list';
import { IncomeInput } from '../income-input';
import { RemoveConfirmation } from '../remove-confirmation';
import { Share } from '../share';
import styles from './distribution-form.module.scss';

const expensesFieldsetLegend = 'Статьи расходов';
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
        expenseCreationActive: distributionModel.expenseCreation.$active,
        notDistributedPercent: distributionModel.$notDistributedPercent,

        expenseCreationToggled: distributionModel.expenseCreation.toggle,
    });

    const distributionLabel = foldNotDistributedPercentToLabel(notDistributedPercent);
    const distributionHasOverflow = notDistributedPercent < 0;
    const distributionIsCompleted = notDistributedPercent === 0;

    return (
        <Stack className={styles.root}>
            <header className={styles.header}>
                <IncomeInput className={styles.incomeInput} />
                <Share />
            </header>
            <Fieldset
                component={Stack}
                legend={
                    <>
                        {expensesFieldsetLegend}
                        <Text className={clsx(distributionHasOverflow && styles.overflow, distributionIsCompleted && styles.completed)}>
                            {distributionLabel}
                        </Text>
                    </>
                }
                classNames={{ legend: styles.legend }}
            >
                <ExpensesList />
                {expenseCreationActive ? (
                    <ExpenseForm form={distributionModel.expenseCreationForm} />
                ) : (
                    <Button leftSection={<IconPlus />} variant="transparent" onClick={expenseCreationToggled}>
                        {addMoreButtonLabel}
                    </Button>
                )}
            </Fieldset>
            <RemoveConfirmation />
        </Stack>
    );
};
