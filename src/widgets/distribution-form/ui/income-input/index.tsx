import { NumberInput } from '@mantine/core';

import { useField } from '@effector-reform/react';

import { distributionModel } from '../../model';

const incomeInputLabel = 'Сумма прихода';

export const IncomeInput = () => {
    const incomeField = useField(distributionModel.incomeField);

    const onSumInputChanged = ({ floatValue }: { floatValue: number | undefined }) => {
        if (floatValue === undefined) {
            incomeField.onChange('');
        } else {
            incomeField.onChange(floatValue);
        }
    };

    return <NumberInput label={incomeInputLabel} value={incomeField.value} onValueChange={onSumInputChanged} suffix="₽" />;
};
