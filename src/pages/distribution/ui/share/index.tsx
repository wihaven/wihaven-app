import { ActionIcon, Affix, Notification, Transition } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';

import { IconShare } from '@tabler/icons-react';
import { useUnit } from 'effector-react';

import { serializeExpenses } from '../../lib';
import { distributionModel } from '../../model';

const successNotificationTitle = 'Отлично!';
const successNotificationMessage = 'Ссылка на распределение скопирована';

export const Share = () => {
    const clipboard = useClipboard({ timeout: 1000 });
    const expenses = useUnit(distributionModel.$expenses);

    const onShare = () => {
        const url = window.location.href + serializeExpenses(expenses);
        clipboard.copy(url);
    };

    return (
        <>
            <ActionIcon onClick={onShare} size="lg">
                <IconShare />
            </ActionIcon>
            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" duration={200} mounted={clipboard.copied}>
                    {(transitionStyles) => (
                        <Notification style={transitionStyles} title={successNotificationTitle}>
                            {successNotificationMessage}
                        </Notification>
                    )}
                </Transition>
            </Affix>
        </>
    );
};
