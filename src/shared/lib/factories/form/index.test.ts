import { allSettled, createStore, fork } from 'effector';
import { readonly } from 'patronum';
import { expect, test } from 'vitest';
import z from 'zod';

import { createForm } from '.';
import { eventWatcher } from '../../tests/event-watcher';

const nameSchema = z.string().nonempty();
const ageSchema = z.number().positive().int();

test('Form value must be up to date with fields values even if they are not valid', async () => {
    const form = createForm({
        name: {
            initialValue: '',
            validation: nameSchema,
        },
        age: {
            initialValue: '' as number | '',
            validation: ageSchema,
        },
    });

    const scope = fork();

    expect(scope.getState(form.fields.name.$value)).toBe('');
    expect(scope.getState(form.fields.age.$value)).toBe('');
    expect(scope.getState(form.$value)).toEqual({ name: '', age: '' });

    await allSettled(form.fields.name.onChange, { params: 'John', scope });

    expect(scope.getState(form.fields.name.$value)).toBe('John');
    expect(scope.getState(form.fields.age.$value)).toBe('');
    expect(scope.getState(form.$value)).toEqual({ name: 'John', age: '' });

    await allSettled(form.fields.age.onChange, { params: 25, scope });

    expect(scope.getState(form.fields.name.$value)).toBe('John');
    expect(scope.getState(form.fields.age.$value)).toBe(25);
    expect(scope.getState(form.$value)).toEqual({ name: 'John', age: 25 });

    await allSettled(form.fields.age.onChange, { params: -10, scope });

    expect(scope.getState(form.fields.name.$value)).toBe('John');
    expect(scope.getState(form.fields.age.$value)).toBe(-10);
    expect(scope.getState(form.$value)).toEqual({ name: 'John', age: -10 });
});

test('Validation must has an ability to pick values from external sources', async () => {
    const $minAllowedAge = readonly(createStore(18));

    const form = createForm({
        name: {
            initialValue: '',
            validation: nameSchema,
        },
        age: {
            initialValue: '' as number | '',
            validation: $minAllowedAge.map((minAllowedAge) => ageSchema.refine((age) => age >= minAllowedAge)),
        },
    });

    const scope = fork();
    const validatedAndSubmittedWatcher = eventWatcher({ event: form.validatedAndSubmitted, scope });

    await allSettled(form.fields.name.onChange, { params: 'John', scope });
    await allSettled(form.fields.age.onChange, { params: 25, scope });
    await allSettled(form.submit, { scope });

    expect(validatedAndSubmittedWatcher.fn).toHaveBeenCalledExactlyOnceWith({ name: 'John', age: 25 });

    validatedAndSubmittedWatcher.fn.mockClear();

    await allSettled(form.fields.age.onChange, { params: 7, scope });
    await allSettled(form.submit, { scope });

    expect(validatedAndSubmittedWatcher.fn).not.toHaveBeenCalled();

    await allSettled(form.fields.age.onChange, { params: 18, scope });
    await allSettled(form.submit, { scope });

    expect(validatedAndSubmittedWatcher.fn).toHaveBeenCalledExactlyOnceWith({ name: 'John', age: 18 });
});

test('If validation fails, form.$isValid must became false', async () => {
    const form = createForm({
        name: {
            initialValue: '',
            validation: nameSchema,
        },
    });

    const scope = fork();

    expect(scope.getState(form.$isValid)).toBe(true);

    await allSettled(form.submit, { scope });

    expect(scope.getState(form.$isValid)).toBe(false);

    await allSettled(form.fields.name.onChange, { params: 'John', scope });

    expect(scope.getState(form.$isValid)).toBe(true);

    await allSettled(form.submit, { scope });

    expect(scope.getState(form.$isValid)).toBe(true);
});
