import jseslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier/flat';
import effector from 'eslint-plugin-effector';
import progress from 'eslint-plugin-file-progress';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const unusedImportsConfig = defineConfig({
    name: 'unused-imports/config',
    plugins: {
        'unused-imports': unusedImports,
    },
    rules: {
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            },
        ],
    },
});

export default defineConfig(
    { name: 'ingores', ignores: ['dist', 'postcss.config.cjs'] },
    progress.configs['recommended-ci'],
    tseslint.configs.recommended,
    { name: 'js/recommended', ...jseslint.configs.recommended, languageOptions: { ecmaVersion: 2020, globals: globals.browser } },
    {
        name: 'effector/config',
        plugins: { effector },
        ...effector.configs.future,
        ...effector.configs.react,
        ...effector.configs.patronum,
    },
    {
        name: 'react-hooks/config',
        plugins: {
            'react-hooks': reactHooks,
        },
        extends: ['react-hooks/recommended'],
    },
    reactRefresh.configs['vite'],
    unusedImportsConfig,
    prettierConfig,
    prettierPlugin,
);
