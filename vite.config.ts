/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import path from 'node:path';
import process from 'node:process';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "${path.join(process.cwd(), 'src/shared/ui/styles/_mantine.scss').replace(/\\/g, '/')}" as mantine;`,
            },
        },
        modules: {
            generateScopedName: '[name]__[local]___[hash:base64:5]',
            localsConvention: 'camelCaseOnly',
        },
    },
    resolve: {
        alias: {
            '~': '/src',
        },
    },
    test: {
        typecheck: {
            enabled: true,
            tsconfig: './tsconfig.app.json',
        },
    },
});
