module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021, // Suporta features modernas do JS
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Para reconhecer JSX
    },
    project: './tsconfig.json', // importante para regras do TS
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect', // Detecta versão do React automaticamente
    },
  },
  rules: {
    // Aqui você pode customizar regras, por exemplo:
    'react/react-in-jsx-scope': 'off', // no React 17+ não precisa importar React em cada arquivo
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
