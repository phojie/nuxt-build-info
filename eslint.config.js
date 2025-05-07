import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  typescript: true,
  rules: {
    'node/prefer-global/process': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'import-x/consistent-type-specifier-style': [
      'error',
      'prefer-top-level',
    ],
  },
})
