import { createApi, createStore } from 'effector';
import { readonly } from 'patronum';

import { inverse } from '../boolean';

export const createDisclosure = (initial: boolean) => {
    const $active = createStore(initial);
    const api = createApi($active, {
        activate: () => true,
        deactivate: () => false,
        toggle: inverse,
    });

    return {
        $active: readonly($active),
        ...api,
    };
};
