import { Record } from 'effect';
import { Event, EventCallable, Store, StoreWritable, attach, combine, createEffect, createEvent, createStore, is, merge, sample } from 'effector';
import { createAction } from 'effector-action';
import { useUnit } from 'effector-react';
import { combineEvents, readonly } from 'patronum';
import z, { ZodError, ZodType } from 'zod';

type Validation<Raw, Validated> = Store<ZodType<Validated, Raw>> | ZodType<Validated, Raw>;
type ValidationOutput<V extends Validation<unknown, unknown> | undefined, In> = V extends Validation<unknown, infer Out> ? Out : In;

export type InternalField<Raw, Validated = Raw> = {
    $value: Store<Raw>;
    $error: StoreWritable<string | null>;
    reinit: EventCallable<void>;
    onChange: EventCallable<Raw>;
    validate: EventCallable<void>;
    validated: Event<Validated>;
};

export type Field<Raw, Validated = Raw> = Omit<InternalField<Raw, Validated>, 'validate' | 'validated' | '$error'> & {
    $error: Store<string | null>;
};

type FieldDeclaration<Raw, Validated> = {
    initialValue: Raw;
    validation?: Validation<Raw, Validated>;
};

function createField<Raw, Validated = Raw>({ initialValue, validation }: FieldDeclaration<Raw, Validated>): InternalField<Raw, Validated> {
    const $value = createStore<Raw>(initialValue);
    const $error = createStore<string | null>(null);

    const onChange = createAction({
        target: { value: $value, error: $error },
        fn: (target, value: Raw) => {
            target.value(value);
            target.error(null);
        },
    });

    const reinit = createAction({
        target: { reinitValue: $value.reinit, reinitError: $error.reinit },
        fn: (target) => {
            target.reinitValue();
            target.reinitError();
        },
    });

    const validate = createEvent();
    const validated = createEvent<Validated>();

    const resolvedValidation = validation === undefined ? z.any() : validation;
    const $validation = is.store(resolvedValidation) ? resolvedValidation : readonly(createStore(resolvedValidation));

    const validateFx = createEffect<{ validation: ZodType<Validated, Raw>; value: Raw }, Validated, ZodError<Validated>>(async (params) => {
        const result = await params.validation.safeParseAsync(params.value);

        if (result.success) {
            return result.data;
        }

        throw result.error;
    });

    sample({
        clock: validate,
        target: attach({
            source: { validation: $validation, value: $value },
            effect: validateFx,
        }),
    });

    sample({ clock: validateFx.doneData, target: validated });
    createAction(validateFx.failData, {
        target: $error,
        fn: (target, error) => target(error.issues[0].message),
    });
    return {
        $value: readonly($value),
        $error,
        reinit,
        onChange,
        validate,
        validated,
    };
}

const internalFieldToField = <Raw, Validated = Raw>(field: Field<Raw, Validated>): Field<Raw, Validated> => {
    return {
        $value: field.$value,
        $error: readonly(field.$error),
        reinit: field.reinit,
        onChange: field.onChange,
    };
};

type ValidatedData<Schema extends Record<string, FieldDeclaration<unknown, unknown>>> = {
    [K in keyof Schema]: ValidationOutput<Schema[K]['validation'], Schema[K]['initialValue']>;
};

type CreateFormParams<Schema extends Record<string, FieldDeclaration<unknown, unknown>>> = Schema;

const createForm = <Schema extends Record<string, FieldDeclaration<unknown, unknown>>>(schema: CreateFormParams<Schema>) => {
    type SchemaFieldInitialValue<K extends keyof Schema> = Schema[K]['initialValue'];
    type SchemaFieldValidationOutput<K extends keyof Schema> = ValidationOutput<Schema[K]['validation'], SchemaFieldInitialValue<K>>;

    const internalFields = Object.keys(schema).reduce(
        (acc, key: keyof Schema) => {
            type K = keyof Schema;
            acc[key] = createField(schema[key]) as InternalField<SchemaFieldInitialValue<K>, SchemaFieldValidationOutput<K>>;
            return acc;
        },
        {} as { [K in keyof Schema]: InternalField<SchemaFieldInitialValue<K>, SchemaFieldValidationOutput<K>> },
    );

    const fields = Object.keys(internalFields).reduce(
        (acc, key: keyof Schema) => {
            acc[key] = internalFieldToField(internalFields[key]);
            return acc;
        },
        {} as { [K in keyof Schema]: Field<SchemaFieldInitialValue<K>, SchemaFieldValidationOutput<K>> },
    );

    const reinit = createEvent();
    const validate = createEvent();

    const $value = combine(
        Object.keys(internalFields).reduce(
            (acc, key: keyof Schema) => {
                acc[key] = internalFields[key].$value;
                return acc;
            },
            {} as { [K in keyof Schema]: Store<SchemaFieldInitialValue<K>> },
        ),
    );

    const $errors = combine(
        Object.keys(internalFields).reduce(
            (acc, key: keyof Schema) => {
                acc[key] = internalFields[key].$error;
                return acc;
            },
            {} as { [K in keyof Schema]: StoreWritable<string | null> },
        ),
        (errors) =>
            Object.keys(errors).reduce(
                (acc, key: keyof Schema) => {
                    const error = errors[key];
                    if (error === null) return acc;
                    acc[key] = error as string;
                    return acc;
                },
                {} as { [K in keyof Schema]+?: string },
            ),
    );

    const $isValid = $errors.map((errors) => Object.keys(errors).length === 0);

    Object.keys(internalFields).forEach((key: keyof Schema) => {
        sample({
            clock: reinit,
            target: internalFields[key].reinit,
        });

        sample({
            clock: validate,
            target: internalFields[key].validate,
        });
    });

    const submit = createAction({
        target: validate,
        fn: (target) => target(),
    });

    const validated = combineEvents<ValidatedData<Schema>>({
        events: Object.keys(internalFields).reduce(
            (acc, key: keyof Schema) => {
                acc[key] = internalFields[key].validated;
                return acc;
            },
            {} as { [K in keyof Schema]: Event<SchemaFieldValidationOutput<K>> },
        ),
        reset: merge([reinit, validate]),
    });

    const validatedAndSubmitted = sample({ clock: combineEvents([validated, submit]), fn: ([validatedValue]) => validatedValue });

    return {
        fields,
        $value,
        $isValid,
        $errors,
        submit,
        validate,
        validatedAndSubmitted,
        reinit,
    };
};

const useField = <Raw, Validated = Raw>(field: Field<Raw, Validated>) => {
    return useUnit({
        value: field.$value,
        error: field.$error,
        onChange: field.onChange,
    });
};

export { createForm, useField };
