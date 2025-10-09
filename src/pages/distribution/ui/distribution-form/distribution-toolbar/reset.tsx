import { ActionIcon, Tooltip } from '@mantine/core';

import { IconTrash } from '@tabler/icons-react';

const tooltipLabel = 'Отчистить распределение';

export const ResetDistribution = () => {
    return (
        <Tooltip label={tooltipLabel}>
            <ActionIcon color="red">
                <IconTrash />
            </ActionIcon>
        </Tooltip>
    );
};
