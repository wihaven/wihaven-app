import { createAction } from 'effector-action';

import { createForm } from '~/shared/lib/factories/form';
import { createModal } from '~/shared/lib/factories/modal';
import { sharedDistributionRoute } from '~/shared/routing';

export const createDistributionReplaceModel = () => {
    const modal = createModal();
    const form = createForm({
        distribution: {
            initialValue: '',
        },
    });

    createAction(form.validatedAndSubmitted, {
        target: {
            modalClose: modal.close,
            formReinit: form.reinit,
            navigate: sharedDistributionRoute.open,
        },
        fn: (target, params) => {
            target.modalClose();
            target.formReinit();
            target.navigate(params);
        },
    });

    return { modal, form };
};
