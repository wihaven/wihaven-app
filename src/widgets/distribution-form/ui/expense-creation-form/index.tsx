import { ChangeEventHandler, FormEventHandler } from 'react';

import { ActionIcon, NumberInput, Paper, TextInput, Tooltip } from '@mantine/core';

import { useField } from '@effector-reform/react';
import { IconDeviceFloppy, IconX } from '@tabler/icons-react';

import { Form } from '~/shared/ui/form';

import { distributionModel } from '../../model';
import styles from './expense-creation-form.module.scss';

const nameInputLabel = 'Название';
const percentInputLabel = 'Процент';
const resetButtonLabel = 'Отменить создание статьи расходов';
const submitButtonLabel = 'Создать статью расходов';

export const ExpenseCreationForm = () => {
    const expenseNameField = useField(distributionModel.expenseNameField);
    const expensePercentField = useField(distributionModel.expensePercentField);

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

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        distributionModel.expenseDraftSubmitted();
    };

    const onReset: FormEventHandler = (e) => {
        e.preventDefault();
        distributionModel.expenseCreationReset();
    };

    return (
        <Paper component={Form} className={styles.form} onSubmit={onSubmit} onReset={onReset}>
            <TextInput
                label={nameInputLabel}
                className={styles.nameInput}
                value={expenseNameField.value}
                onChange={onExpenseNameInputChanged}
                error={expenseNameField.error}
            />
            <NumberInput
                suffix="%"
                allowNegative={false}
                clampBehavior="strict"
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
