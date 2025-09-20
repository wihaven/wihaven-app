import { createStore } from 'effector';
import { createAction } from 'effector-action';
import { readonly } from 'patronum';

import { createDisclosure } from '~/shared/lib/factories';
import { sharedDistributionRoute } from '~/shared/routing';

export const createDistributionReplaceModel = () => {
    const { activate, deactivate, $active } = createDisclosure(false);

    const open = createAction({
        target: { activate },
        fn: (target) => target.activate(),
    });

    const close = createAction({
        target: { deactivate },
        fn: (target) => target.deactivate(),
    });

    const $distributionCode = createStore<string>('');

    const distributionCodeChanged = createAction({
        target: $distributionCode,
        fn: (target, code: string) => target(code),
    });

    const distributionCodeSubmitted = createAction({
        source: $distributionCode,
        target: {
            deactivate,
            $distributionCode,
            navigate: sharedDistributionRoute.open,
        },
        fn: (target, distribution) => {
            target.deactivate();
            target.$distributionCode.reinit();
            target.navigate({ distribution });
        },
    });

    return {
        $opened: readonly($active),
        open,
        close,

        $distributionCode,
        distributionCodeChanged,
        distributionCodeSubmitted,
    };
};
