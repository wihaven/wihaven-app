import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';

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
        <>
            <ColorSchemeScript defaultColorScheme="auto" />
            <MantineProvider theme={theme} defaultColorScheme="auto">
                <RouterProvider router={router}>
                    <Routes />
                </RouterProvider>
            </MantineProvider>
        </>
    );
}

export default App;
