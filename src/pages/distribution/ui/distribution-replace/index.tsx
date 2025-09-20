import { ChangeEvent } from 'react';

import { ActionIcon, Button, Modal, Textarea } from '@mantine/core';

import { IconClipboard } from '@tabler/icons-react';
import { useUnit } from 'effector-react';

import { Form } from '~/shared/ui/form';

import { distributionModel } from '../../model';
import styles from './distribution-replace.module.scss';

const title = 'Вставьте код распределения ниже';
const textAreaPlaceholder = 'Код распределения...';
const submitButtonLabel = 'Применить';

const model = distributionModel.distributionReplace;

export const DistributionReplace = () => {
    const { opened, close, open, distributionCode, distributionCodeChanged, distributionCodeSubmitted } = useUnit({
        opened: model.$opened,
        open: model.open,
        close: model.close,
        distributionCode: model.$distributionCode,
        distributionCodeChanged: model.distributionCodeChanged,
        distributionCodeSubmitted: model.distributionCodeSubmitted,
    });

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        distributionCodeChanged(event.target.value);
    };

    return (
        <>
            <ActionIcon size="lg" color="gray" onClick={open}>
                <IconClipboard />
            </ActionIcon>
            <Modal title={title} opened={opened} onClose={close}>
                <Form onSubmit={distributionCodeSubmitted} className={styles.form}>
                    <Textarea placeholder={textAreaPlaceholder} rows={5} value={distributionCode} onChange={onChange} />
                    <Button type="submit" disabled={distributionCode.length === 0}>
                        {submitButtonLabel}
                    </Button>
                </Form>
            </Modal>
        </>
    );
};
