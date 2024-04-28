import globals from 'globals';
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
    },
  },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    rules: {
      'no-console': 0,
      'react/prop-types': 0,
      'no-unused-vars': 0,
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }]
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
    ],
  },
];
