import { z } from 'zod';

import { O, flow } from '~/shared/lib/fp-ts';

export type ExpenseDraft = {
    name: string;
    percent: number | '';
};

export const ExpenseDraftContract = z.object({
    name: z.string().nonempty('Название не может быть пустым'),
    percent: z.number({ message: 'Процент не может быть пустым' }),
});

export type ValidatedExpenseDraft = z.infer<typeof ExpenseDraftContract>;

export type Expense = ValidatedExpenseDraft & {
    id: string;
};

export type CalculatedExpense = Expense & {
    sum?: number;
};

export const foldNumberInputValueToNumber: (value: '' | number) => number = flow(
    O.fromPredicate((value): value is number => value !== ''),
    O.getOrElse(() => 0),
);
