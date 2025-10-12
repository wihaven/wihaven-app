import { Button, Group, Modal, Title } from '@mantine/core';

import { useStoreMap, useUnit } from 'effector-react';

import { distributionModel } from '../../../model/distribution';

const confirmRemoveButtonLabel = 'Удалить';
const cancelRemoveButtonLabel = 'Отмена';

const remove = distributionModel.expenses.remove;
export const RemoveConfirmation = () => {
    const { isRemoveInProgress, onRemoveConfirmed, onRemoveEndedTransitionStarted, onRemoveEndedTransitionEnded } = useUnit({
        isRemoveInProgress: remove.$isRemoveInProgress,
        onRemoveConfirmed: remove.confirm,
        onRemoveEndedTransitionStarted: remove.modal.closeTransitionStarted,
        onRemoveEndedTransitionEnded: remove.modal.closeTransitionEnded,
    });

    const confirmRemoveTitle = useStoreMap(remove.$current, (expense) => `Удалить статью расходов "${expense?.name ?? ''}"?`);

    return (
        <Modal
            title={<Title order={4}>{confirmRemoveTitle}</Title>}
            opened={isRemoveInProgress}
            onClose={onRemoveEndedTransitionStarted}
            onExitTransitionEnd={onRemoveEndedTransitionEnded}
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
