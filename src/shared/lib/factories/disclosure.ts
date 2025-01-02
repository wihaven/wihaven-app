import { createApi, createStore } from 'effector';
import { readonly } from 'patronum';

import { inverse } from '../boolean';
import { constFalse, constTrue } from '../fp-ts';

export const createDisclosure = (initial: boolean) => {
    const $active = createStore(initial);
    const api = createApi($active, {
        activate: constTrue,
        deactivate: constFalse,
        toggle: inverse,
    });

    return {
        $active: readonly($active),
        ...api,
    };
};
