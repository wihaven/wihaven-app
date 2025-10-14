/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import path from 'node:path';
import process from 'node:process';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                skipWaiting: true,
            },
            includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
            manifest: {
                name: 'wihaven',
                short_name: 'wihaven',
                description: 'Tool to distribute income between expenses',
                theme_color: '#242424',
                icons: [
                    {
                        src: '/android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
        }),
        react(),
    ],
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
