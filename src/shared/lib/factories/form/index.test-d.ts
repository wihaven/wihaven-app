import { Event, Store } from 'effector';
import { expectTypeOf, test } from 'vitest';
import z from 'zod';

import { Field, createForm } from '.';

test('Form return types without validation', () => {
    const form = createForm({
        name: {
            initialValue: '',
        },
        age: {
            initialValue: '' as number | '',
        },
    });

    expectTypeOf(form.fields.name).toEqualTypeOf<Field<string, string>>();
    expectTypeOf(form.fields.age).toEqualTypeOf<Field<number | '', number | ''>>();
    expectTypeOf(form.$value).toEqualTypeOf<Store<{ name: string; age: number | '' }>>();
    expectTypeOf(form.validatedAndSubmitted).toEqualTypeOf<Event<{ name: string; age: number | '' }>>();
});

test('Form return types with partial validation', () => {
    const form = createForm({
        name: {
            initialValue: '',
        },
        age: {
            initialValue: '' as number | '',
            validation: z.number(),
        },
    });

    expectTypeOf(form.fields.name).toEqualTypeOf<Field<string, string>>();
    expectTypeOf(form.fields.age).toEqualTypeOf<Field<number | '', number>>();
    expectTypeOf(form.$value).toEqualTypeOf<Store<{ name: string; age: number | '' }>>();
    expectTypeOf(form.validatedAndSubmitted).toEqualTypeOf<Event<{ name: string; age: number }>>();
});

test('Form return types with full fields validation and transformation', () => {
    const form = createForm({
        name: {
            initialValue: '',
            validation: z.string().transform((name) => name.length),
        },
        age: {
            initialValue: '' as number | '',
            validation: z.number(),
        },
    });

    expectTypeOf(form.fields.name).toEqualTypeOf<Field<string, number>>();
    expectTypeOf(form.fields.age).toEqualTypeOf<Field<number | '', number>>();
    expectTypeOf(form.$value).toEqualTypeOf<Store<{ name: string; age: number | '' }>>();
    expectTypeOf(form.validatedAndSubmitted).toEqualTypeOf<Event<{ name: number; age: number }>>();
});
