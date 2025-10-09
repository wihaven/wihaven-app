import { Record } from 'effect';
import { Event, createStore } from 'effector';
import { createAction } from 'effector-action';
import { persist } from 'effector-storage/local';
import { nanoid } from 'nanoid';
import { readonly } from 'patronum';
import z from 'zod';

import { createDisclosure } from '~/shared/lib/factories';
import { createForm } from '~/shared/lib/factories/form';

import { Expense, ExpenseContract } from '../lib';

export type Distribution = Readonly<{
    name: string;
    expenses: readonly Expense[];
}>;

export const createDistributionPersistConfirmation = () => {
    const disclosure = createDisclosure(false);

    const form = createForm({
        name: { initialValue: '', validation: z.string().nonempty() },
        expenses: { initialValue: [] as Expense[], validation: z.array(ExpenseContract).nonempty() },
    });

    const open = createAction({
        target: {
            open: disclosure.open,
            expenses: form.fields.expenses.onChange,
        },
        fn: (target, expenses: Expense[]) => {
            target.open();
            target.expenses(expenses);
        },
    });

    const confirm = createAction({
        target: {
            validate: form.submit,
            close: disclosure.close,
        },
        fn: (target) => {
            target.validate();
            target.close();
        },
    });

    const confirmed: Event<Distribution> = form.validatedAndSubmitted;

    return {
        nameField: form.fields.name,
        open,
        close: disclosure.close,
        confirm,
        confirmed,
    };
};

export const createDistributionsPersist = () => {
    const $distributions = createStore<Record.ReadonlyRecord<string, Distribution>>({});

    const push = createAction({
        target: $distributions,
        fn: (target, distribution: Distribution) => {
            target(Record.set(nanoid(), distribution));
        },
    });

    persist({
        key: 'distributions',
        store: $distributions,
    });

    return {
        $distributions: readonly($distributions),
        push,
    };
};
