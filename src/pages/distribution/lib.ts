import { Option as O, flow, pipe } from 'effect';
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

export const serializeExpenses = (expenses: readonly Expense[]): string => pipe(expenses, JSON.stringify, btoa);

export const deserializeExpenses = (raw: string): readonly Expense[] => {
    try {
        return pipe(raw, atob, JSON.parse, ExpensesContract.parse);
    } catch {
        return [];
    }
};
