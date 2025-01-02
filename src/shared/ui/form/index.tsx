import { FC, FormEventHandler, FormHTMLAttributes } from 'react';

export type FormProps = FormHTMLAttributes<HTMLFormElement>;

export const Form: FC<FormProps> = (props) => {
    const { children, onSubmit: handleSubmit, onReset: handleReset, ...rest } = props;

    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        handleSubmit?.(event);
    };

    const onReset: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        handleReset?.(event);
    };

    return (
        <form {...rest} onSubmit={onSubmit} onReset={onReset}>
            {children}
        </form>
    );
};
