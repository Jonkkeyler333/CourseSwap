import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
      '@stylistic': stylistic,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect', // Detecta automáticamente la versión de React
      },
    },
    rules: {
      // Reglas recomendadas de React
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules, // Evita pedir "import React" en cada archivo JSX

      // Reglas de Indentación y Estilo
      '@stylistic/indent': ['error', 2], // Indentación de 2 espacios
      // '@stylistic/jsx-indent': ['error', 2], // Indentación de 2 espacios dentro del JSX
      '@stylistic/quotes': ['error', 'single'], // Uso obligatorio de comillas simples
      '@stylistic/semi': ['error', 'never'], // Sin punto y coma al final de las líneas
      'react/prop-types': 'off',
      '@stylistic/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ], // Quita llaves innecesarias en props ej: id={"1"} -> id="1"
    },
  },
])