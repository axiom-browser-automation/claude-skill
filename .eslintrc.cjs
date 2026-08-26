/** Linting for the skill's own scripts + example JS files. Tests use ts-jest's own checks. */
module.exports = {
  root: true,
  // The generated esbuild bundles carry a DO-NOT-EDIT banner; their real sources
  // live in scripts/_src/ and are linted there. Linting the bundled UMD output
  // (ajv etc.) just yields spurious no-undef/unknown-rule errors, so skip them.
  ignorePatterns: [
    'node_modules/',
    'plugins/**/skills/**/scripts/validate-no-code.js',
    'plugins/**/skills/**/scripts/validate-coded.js'
  ],
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
