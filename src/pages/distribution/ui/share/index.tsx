import { ActionIcon, Affix, Notification, Tooltip, Transition } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';

import { IconShare } from '@tabler/icons-react';
import { useUnit } from 'effector-react';

import { serializeExpenses } from '../../lib';
import { distributionModel } from '../../model/distribution';

const successNotificationTitle = 'Отлично!';
const successNotificationMessage = 'Код распределения скопирован';

const tooltipLabel = 'Поделиться кодом распределения';

export const Share = () => {
    const clipboard = useClipboard({ timeout: 1000 });
    const expenses = useUnit(distributionModel.expenses.$items);

    const onShare = () => {
        clipboard.copy(serializeExpenses(expenses));
    };

    return (
        <>
            <Tooltip label={tooltipLabel}>
                <ActionIcon onClick={onShare} size="lg">
                    <IconShare />
                </ActionIcon>
            </Tooltip>
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
