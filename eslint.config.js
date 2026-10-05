import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', 'eslint.config.js'],
    languageOptions: {
      globals: {
        // Browser globals for DOM API
        DOMParser: 'readonly',
        XMLDocument: 'readonly',
        Element: 'readonly',
        Node: 'readonly',
        Document: 'readonly',
        // Test globals
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
      parser: typescriptEslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // Base recommended rules
      ...js.configs.recommended.rules,
      
      // TypeScript recommended rules
      ...typescriptEslint.configs.recommended.rules,
      
      // Custom rules (override defaults)
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // Remove type-dependent rules that need special setup
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      
      // General rules
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'no-eq-null': 'error',
      'no-unused-expressions': 'error',
      'no-shadow': 'error',
      'no-param-reassign': 'error',
      'no-return-await': 'error',
      'require-await': 'error',
    },
  },
];