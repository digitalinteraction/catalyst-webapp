module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'standard',
    '@vue/prettier'
  ],
  // plugins: ['standard', 'prettier'],
  rules: {
    'prettier/prettier': 'warn',
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': 'warn'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
