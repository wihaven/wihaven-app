import { z } from 'zod';

import { createForm } from '~/shared/lib/factories/form';

export type IncomeDraft = {
    income: number | '';
};

export const IncomeContract = z.object({
    income: z.number().min(0),
});

export type ValidatedIncomeDraft = z.infer<typeof IncomeContract>;

export const createIncomeForm = () => {
    return createForm({
        income: { initialValue: '' as number | '', validation: IncomeContract },
    });
};
