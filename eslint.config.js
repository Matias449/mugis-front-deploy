import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      'eslint.config.js',
      'vite.config.js',
      'vite.config.js.timestamp-*',
    ],
  },
  ...compat.extends('eslint-config-airbnb', 'eslint-config-airbnb/hooks'),
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'no-unused-vars': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/jsx-one-expression-per-line': 'off',
      'max-len': ['warn', { code: 150 }],
      'import/extensions': 'off',
      'no-plusplus': 'off',
      'react/button-has-type': 'off',
      'react/prop-types': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
