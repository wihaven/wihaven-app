import { NumberInput } from '@mantine/core';

import { useField } from '~/shared/lib/factories/form';

import { distributionModel } from '../../../model/distribution';

const incomeInputLabel = 'Сумма прихода';

export type IncomeInputProps = {
    className?: string;
};

export const IncomeInput = ({ className }: IncomeInputProps) => {
    const incomeField = useField(distributionModel.income.fields.income);

    const onSumInputChanged = ({ floatValue }: { floatValue: number | undefined }) => {
        if (floatValue === undefined) {
            incomeField.onChange('');
        } else {
            incomeField.onChange(floatValue);
        }
    };

    return (
        <NumberInput
            className={className}
            label={incomeInputLabel}
            allowDecimal
            decimalScale={2}
            decimalSeparator=","
            value={incomeField.value}
            onValueChange={onSumInputChanged}
            suffix="₽"
        />
    );
};
