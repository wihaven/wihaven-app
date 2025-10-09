import { ChangeEventHandler } from 'react';

import { ActionIcon, NumberInput, Paper, TextInput, Tooltip } from '@mantine/core';

import { IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useUnit } from 'effector-react';

import { useField } from '~/shared/lib/factories/form';
import { Form } from '~/shared/ui/form';

import { ExpenseFormViewModel } from '../../model/expense-form';
import styles from './expense-form.module.scss';

const nameInputLabel = 'Название';
const percentInputLabel = 'Процент';
const resetButtonLabel = 'Отменить создание статьи расходов';
const submitButtonLabel = 'Создать статью расходов';

export type ExpenseFormProps = {
    form: ExpenseFormViewModel;
};

export const ExpenseForm = ({ form }: ExpenseFormProps) => {
    const expenseNameField = useField(form.name);
    const expensePercentField = useField(form.percent);
    const { onSubmit, onReset } = useUnit({
        onSubmit: form.submit,
        onReset: form.reset,
    });

    const onExpenseNameInputChanged: ChangeEventHandler<HTMLInputElement> = (event) => {
        expenseNameField.onChange(event.target.value);
    };

    const onExpensePercentInputChanged = ({ floatValue }: { floatValue: number | undefined }) => {
        if (floatValue === undefined) {
            expensePercentField.onChange('');
        } else {
            expensePercentField.onChange(floatValue);
        }
    };

    return (
        <Paper component={Form} className={styles.form} onSubmit={onSubmit} onReset={onReset}>
            <TextInput
                label={nameInputLabel}
                className={styles.nameInput}
                value={expenseNameField.value}
                onChange={onExpenseNameInputChanged}
                error={expenseNameField.error}
                autoFocus
            />
            <NumberInput
                suffix="%"
                allowDecimal
                min={0.01}
                max={100}
                label={percentInputLabel}
                className={styles.percentInput}
                value={expensePercentField.value}
                onValueChange={onExpensePercentInputChanged}
                error={expensePercentField.error}
            />
            <Tooltip label={resetButtonLabel}>
                <ActionIcon className={styles.reset} type="reset" color="gray">
                    <IconX />
                </ActionIcon>
            </Tooltip>
            <Tooltip label={submitButtonLabel}>
                <ActionIcon className={styles.submit} type="submit">
                    <IconDeviceFloppy />
                </ActionIcon>
            </Tooltip>
        </Paper>
    );
};
