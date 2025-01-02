import { ErrorsSchemaPayload, FormValues, UserFormSchema, createForm } from '@effector-reform/core';
import { Store, attach } from 'effector';
import { ZodError } from 'zod';

import { createDisclosure } from '~/shared/lib/factories';
import { O, RA, pipe } from '~/shared/lib/fp-ts';

import { Expense, ExpenseDraft, ExpenseDraftContract } from '../lib';

export type CreateExpenseFormParams = {
    $expenses: Store<readonly Expense[]>;
};

export const createExpenseCreationModel = ({ $expenses }: CreateExpenseFormParams) => {
    const validateExpenseFx = attach({
        source: $expenses,
        effect: async (expenses, draft: FormValues<UserFormSchema<ExpenseDraft>>): Promise<ErrorsSchemaPayload | null> => {
            try {
                const result = await ExpenseDraftContract.parseAsync(draft);

                return pipe(
                    expenses,
                    RA.reduce(0, (acc, expense) => acc + expense.percent),
                    (percent) => percent + result.percent,
                    O.fromPredicate((percent) => percent <= 100),
                    O.fold(
                        () => ({ percent: 'Сумма всех процентов не может превышать 100%' }),
                        () => null,
                    ),
                );
            } catch (e) {
                return pipe(
                    e,
                    O.fromPredicate((e) => e instanceof ZodError),
                    O.map(({ errors }) =>
                        pipe(
                            errors,
                            RA.reduce({}, (acc: ErrorsSchemaPayload, error) => {
                                if (acc[error.path.join('.')]) {
                                    return acc;
                                }

                                acc[error.path.join('.')] = error.message;

                                return acc;
                            }),
                        ),
                    ),
                    O.toNullable,
                );
            }
        },
    });

    const expenseCreation = createDisclosure(false);

    const expenseForm = createForm<ExpenseDraft>({
        schema: {
            name: '',
            percent: '',
        },
        validation: validateExpenseFx,
        validationStrategies: ['submit'],
    });

    return {
        expenseForm,
        expenseCreation,
    };
};
