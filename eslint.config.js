import { FlatCompat } from '@eslint/eslintrc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  {
    ignores: ['.next/**/*', 'node_modules/**/*', '*.config.js', '*.config.ts']
  },
  // Use only the Next.js core-web-vitals config without the problematic typescript config
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    rules: {
      'simple-import-sort/exports': 'warn',
      'react/no-unescaped-entities': 'off',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^react', '^@?\\w'],
            ['^(components|api|lib|services)(/.*|$)'],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.s?css$']
          ]
        }
      ]
    }
  }
];

export default eslintConfig;
