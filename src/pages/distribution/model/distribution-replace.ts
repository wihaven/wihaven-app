import { createStore } from 'effector';
import { createAction } from 'effector-action';
import { readonly } from 'patronum';

import { createDisclosure } from '~/shared/lib/factories';
import { sharedDistributionRoute } from '~/shared/routing';

export const createDistributionReplaceModel = () => {
    const disclosure = createDisclosure(false);

    const $distributionCode = createStore<string>('');

    const distributionCodeChanged = createAction({
        target: $distributionCode,
        fn: (target, code: string) => target(code),
    });

    const distributionCodeSubmitted = createAction({
        source: $distributionCode,
        target: {
            close: disclosure.close,
            $distributionCode,
            navigate: sharedDistributionRoute.open,
        },
        fn: (target, distribution) => {
            target.close();
            target.$distributionCode.reinit();
            target.navigate({ distribution });
        },
    });

    return {
        $opened: readonly(disclosure.$isOpen),
        open: disclosure.open,
        close: disclosure.close,

        $distributionCode,
        distributionCodeChanged,
        distributionCodeSubmitted,
    };
};
