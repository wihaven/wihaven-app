import { Option as O, flow } from 'effect';
import { z } from 'zod';

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
    O.liftPredicate((value): value is number => value !== ''),
    O.getOrElse(() => 0),
);
