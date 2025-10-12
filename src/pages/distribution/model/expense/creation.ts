import { createAction } from 'effector-action';

import { createModal } from '~/shared/lib/factories/modal';

import { CreateExpenseFormParams, createExpenseForm } from './form';

type CreateExpenseCreationModelParams = CreateExpenseFormParams;

export const createExpenseCreationModel = ({ $notDistributedPercent }: CreateExpenseCreationModelParams) => {
    const modal = createModal();
    const form = createExpenseForm({ $notDistributedPercent });

    const reinit = createAction({
        target: {
            formReinit: form.reinit,
            modalClose: modal.close,
        },
        fn: (target) => {
            target.formReinit();
            target.modalClose();
        },
    });

    return {
        modal,
        form: { ...form, reinit },
    };
};
