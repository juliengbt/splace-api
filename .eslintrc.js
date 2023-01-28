module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    '@darraghor/nestjs-typed',
    'sonarjs',
    'import',
    'unicorn',
    'no-secrets'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:@darraghor/nestjs-typed/recommended',
    'plugin:sonarjs/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:unicorn/recommended'
  ],
  overrides: [
    {
      files: ['test/**'],
      plugins: ['jest'],
      extends: ['plugin:jest/all'],
      rules: {
        'jest/no-hooks': 0,
        'jest/prefer-expect-assertions': 0,
        'jest/max-expects': 0
      }
    }
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 1,
    '@darraghor/nestjs-typed/api-property-matches-property-optionality': 0,
    '@darraghor/nestjs-typed/all-properties-have-explicit-defined': 0,
    'sonarjs/no-duplicate-string': 0,
    'unicorn/prevent-abbreviations': 0,
    'unicorn/no-array-method-this-argument': 0,
    'unicorn/no-null': 0,
    'unicorn/no-array-reduce': 0,
    'no-secrets/no-secrets': 2
  },
  settings: {
    'import/resolver': {
      typescript: {} // this loads <rootdir>/tsconfig.json to eslint
    }
  }
};
