import { ActionIcon, Tooltip } from '@mantine/core';

import { IconDeviceFloppy } from '@tabler/icons-react';

const tooltipLabel = 'Сохранить распределение';

export const SaveDistribution = () => {
    return (
        <Tooltip label={tooltipLabel}>
            <ActionIcon>
                <IconDeviceFloppy />
            </ActionIcon>
        </Tooltip>
    );
};
