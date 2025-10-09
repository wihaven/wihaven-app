import { Option as O, flow, pipe } from 'effect';
import { z } from 'zod';

import { decode, encode } from '~/shared/lib/base64';

export type ExpenseDraft = {
    name: string;
    percent: number | '';
};

export const ExpenseDraftNameContract = z.string().nonempty('Название не может быть пустым');
export const ExpenseDraftPercentContract = z.number({ message: 'Процент не может быть пустым' });

export const ExpenseDraftContract = z.object({
    name: ExpenseDraftNameContract,
    percent: ExpenseDraftPercentContract,
});

export type ValidatedExpenseDraft = z.infer<typeof ExpenseDraftContract>;

export const ExpenseContract = ExpenseDraftContract.extend({
    id: z.string(),
});
export type Expense = z.infer<typeof ExpenseContract>;

export const ExpensesContract = z.array(ExpenseContract);

export type CalculatedExpense = Expense & {
    sum?: number;
};

export const foldNumberInputValueToNumber: (value: '' | number) => number = flow(
    O.liftPredicate((value): value is number => value !== ''),
    O.getOrElse(() => 0),
);

export const serializeExpenses = (expenses: readonly Expense[]): string => pipe(expenses, JSON.stringify, encode);

export const deserializeExpenses = (raw: string): readonly Expense[] => {
    try {
        return pipe(raw, decode, JSON.parse, ExpensesContract.parse);
    } catch {
        return [];
    }
};
