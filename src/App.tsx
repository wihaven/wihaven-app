import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

import { RouterProvider } from 'atomic-router-react';

import { router } from '~/shared/routing';

import { Routes } from './pages';

const theme = createTheme({
    primaryColor: 'teal',
    components: {
        NumberInput: {
            defaultProps: {
                allowNegative: false,
                allowDecimal: false,
                hideControls: true,
                clampBehavior: 'strict',
                thousandSeparator: '\xa0',
            },
        },
    },
});

function App() {
    return (
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <RouterProvider router={router}>
                <Routes />
            </RouterProvider>
        </MantineProvider>
    );
}

export default App;
