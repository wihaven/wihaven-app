import { PropsWithChildren } from 'react';

import { AppShell, Group, Text, Title } from '@mantine/core';

import styles from './app-layout.module.scss';

export type AppLayoutProps = PropsWithChildren<{
    title: string;
}>;

export const AppLayout = (props: AppLayoutProps) => {
    const { title, children } = props;

    return (
        <AppShell header={{ height: 60 }}>
            <AppShell.Header component={Group} className={styles.header}>
                <Text variant="gradient" size="xl" gradient={{ from: 'teal', to: 'violet', deg: 90 }}>
                    wihaven
                </Text>
                <Title order={1} size="h2">
                    {title}
                </Title>
            </AppShell.Header>
            <AppShell.Main className={styles.container}>{children}</AppShell.Main>
        </AppShell>
    );
};
