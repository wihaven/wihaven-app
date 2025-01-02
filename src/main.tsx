import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { appStarted } from '~/shared/init';

import App from './App.tsx';

appStarted();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
