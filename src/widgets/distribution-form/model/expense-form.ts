import { ErrorsSchemaPayload, FormValues, UserFormSchema, createForm } from '@effector-reform/core';
import { Store, attach } from 'effector';
import { ZodError } from 'zod';

import { O, RA, pipe } from '~/shared/lib/fp-ts';

import { ExpenseDraft, ExpenseDraftContract, ValidatedExpenseDraft } from '../lib';

export type CreateExpenseFormParams = {
    $notDistributedPercent: Store<number>;
};

export const createExpenseForm = ({ $notDistributedPercent }: CreateExpenseFormParams) => {
    const validateExpenseFx = attach({
        source: $notDistributedPercent,
        effect: async (notDistributedPercent, draft: FormValues<UserFormSchema<ExpenseDraft>>): Promise<ErrorsSchemaPayload | null> => {
            try {
                const result = await ExpenseDraftContract.parseAsync(draft);

                return pipe(
                    notDistributedPercent,
                    (percent) => percent - result.percent,
                    O.fromPredicate((percent) => percent >= 0),
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

    const expenseForm = createForm<ExpenseDraft>({
        schema: {
            name: '',
            percent: '',
        },
        validation: validateExpenseFx,
        validationStrategies: ['submit'],
    });

    return {
        name: expenseForm.fields.name,
        percent: expenseForm.fields.percent,
        submit: expenseForm.submit,
        reset: expenseForm.reset,
        validatedAndSubmitted: expenseForm.validatedAndSubmitted.map((draft) => draft as ValidatedExpenseDraft),
    };
};

export type ExpenseFormModel = ReturnType<typeof createExpenseForm>;
export type ExpenseFormViewModel = Omit<ExpenseFormModel, 'validatedAndSubmitted'>;
