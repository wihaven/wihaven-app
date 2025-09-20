import { Button, Group, Modal, Title } from '@mantine/core';

import { useStoreMap, useUnit } from 'effector-react';

import { distributionModel } from '../../model';

const confirmRemoveButtonLabel = 'Удалить';
const cancelRemoveButtonLabel = 'Отмена';

export const RemoveConfirmation = () => {
    const { isRemoveInProgress, onRemoveConfirmed, onRemoveEndedTransitionStarted, onRemoveEnded } = useUnit({
        isRemoveInProgress: distributionModel.$isRemoveInProgress,
        onRemoveConfirmed: distributionModel.expenseRemoveConfirmed,
        onRemoveEndedTransitionStarted: distributionModel.expenseRemoveEndedTransitionStarted,
        onRemoveEnded: distributionModel.expenseRemoveEnded,
    });

    const confirmRemoveTitle = useStoreMap(distributionModel.$removingExpense, (expense) => `Удалить статью расходов "${expense?.name ?? ''}"?`);

    return (
        <Modal
            title={<Title order={4}>{confirmRemoveTitle}</Title>}
            opened={isRemoveInProgress}
            onClose={onRemoveEndedTransitionStarted}
            onExitTransitionEnd={onRemoveEnded}
            centered
        >
            <Group grow mt="md">
                <Button variant="outline" onClick={onRemoveEndedTransitionStarted}>
                    {cancelRemoveButtonLabel}
                </Button>
                <Button color="red" onClick={onRemoveConfirmed}>
                    {confirmRemoveButtonLabel}
                </Button>
            </Group>
        </Modal>
    );
};
