import { Button, Modal, Text } from '@mantine/core';

import { useUnit } from 'effector-react';

import { distributionModel } from '../../model';
import styles from './distribution-replace-confirmation.module.scss';

const title = 'Использовать новое распределение?';
const confirmButtonLabel = 'Заменить на новое';
const denyButtonLabel = 'Оставить старое';

const model = distributionModel.distributionReplaceConfirmation;

export const DistributionReplaceConfirmation = () => {
    const {
        opened,
        deny: onClose,
        confirm: onConfirm,
        expensesCandidate,
    } = useUnit({
        opened: model.$opened,
        deny: model.deny,
        confirm: model.confirm,
        expensesCandidate: model.$expensesCandidate,
    });
    return (
        <Modal opened={opened} onClose={onClose} title={title} classNames={{ body: styles.body }}>
            <dl className={styles.expenses}>
                {expensesCandidate.map((expense) => (
                    <>
                        <Text component="dt">{expense.name}:</Text>
                        <Text component="dd" className={styles.expensePercent}>
                            {expense.percent}%
                        </Text>
                    </>
                ))}
            </dl>
            <section className={styles.buttons}>
                <Button variant="outline" onClick={onClose} className={styles.button}>
                    {denyButtonLabel}
                </Button>
                <Button onClick={onConfirm} className={styles.button}>
                    {confirmButtonLabel}
                </Button>
            </section>
        </Modal>
    );
};
