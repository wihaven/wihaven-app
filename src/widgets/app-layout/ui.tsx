import { AppShell, Container, Group, Text, Title } from '@mantine/core';

import styles from './app-layout.module.scss';

export type AppLayoutProps = {
    title: string;
    children: React.ReactNode;
};

export const AppLayout = (props: AppLayoutProps) => {
    const { title, children } = props;

    return (
        <AppShell header={{ height: 60 }}>
            <AppShell.Header component={Group} className={styles.header}>
                <Text variant="gradient" size="xl" gradient={{ from: 'teal', to: 'violet', deg: 90 }}>
                    nestwise
                </Text>
                <Title order={1} size="h2">
                    {title}
                </Title>
            </AppShell.Header>
            <AppShell.Main component={Container} className={styles.main}>
                {children}
            </AppShell.Main>
        </AppShell>
    );
};
