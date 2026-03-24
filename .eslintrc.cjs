module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true, // Ajoutez l'environnement Node.js
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:react/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-hooks',
    'react-refresh',
    '@typescript-eslint',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Ajoutez d'autres règles personnalisées ici
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'],
      parser: '@typescript-eslint/parser',
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
