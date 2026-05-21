/** Linting for the skill's own scripts + example JS files. Tests use ts-jest's own checks. */
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    'no-undef': 'error',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prefer-const': 'warn'
  },
  overrides: [
    {
      files: ['skills/axiom/examples/coded/*.js'],
      // The examples are templates Claude reads — they reference process.env and the @axiom_ai/api
      // package without us installing it here. Suppress no-undef for those globals.
      globals: {
        process: 'readonly'
      }
    }
  ]
}
