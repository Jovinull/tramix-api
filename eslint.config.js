import { configApp } from '@adonisjs/eslint-config';
import prettier from 'eslint-config-prettier';

export default [
  ...configApp(),
  {
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  prettier,
];
