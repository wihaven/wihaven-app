import { createForm } from '@effector-reform/core';
import { zodAdapter } from '@effector-reform/zod';
import { z } from 'zod';

export type IncomeDraft = {
    income: number | '';
};

export const IncomeContract = z.object({
    income: z.number().min(0),
});

export type ValidatedIncomeDraft = z.infer<typeof IncomeContract>;

export const createIncomeForm = () => {
    return createForm<IncomeDraft>({
        schema: {
            income: '',
        },
        validation: zodAdapter(IncomeContract),
    });
};
