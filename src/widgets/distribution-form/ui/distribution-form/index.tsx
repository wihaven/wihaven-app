import { Button, Fieldset, Stack } from '@mantine/core';

import { IconPlus } from '@tabler/icons-react';
import { useUnit } from 'effector-react';

import { distributionModel } from '../../model';
import { ExpenseCreationForm } from '../expense-creation-form';
import { ExpensesList } from '../expenses-list';
import { IncomeInput } from '../income-input';
import styles from './distribution-form.module.scss';

const expensesFieldsetLegend = 'Статьи расходов';
const addMoreButtonLabel = 'Добавить';

export const DistributionForm = () => {
    const { expenseCreationActive, expenseCreationToggled } = useUnit({
        expenseCreationActive: distributionModel.expenseCreation.$active,
        expenseCreationToggled: distributionModel.expenseCreation.toggle,
    });

    return (
        <Stack>
            <IncomeInput />
            <Fieldset component={Stack} legend={expensesFieldsetLegend} classNames={{ legend: styles.legend }}>
                <ExpensesList />
                {expenseCreationActive ? (
                    <ExpenseCreationForm />
                ) : (
                    <Button leftSection={<IconPlus />} variant="transparent" onClick={expenseCreationToggled}>
                        {addMoreButtonLabel}
                    </Button>
                )}
            </Fieldset>
        </Stack>
    );
};
