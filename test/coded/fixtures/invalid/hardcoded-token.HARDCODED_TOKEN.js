import { AxiomApi } from '@axiom_ai/api'

// Literal token passed directly — expect HARDCODED_TOKEN.
const ax = new AxiomApi('npm_abcdefghijklmnopqrstuvwxyz0123456789')

await ax.browserOpen()
try {
  await ax.goto('https://example.com')
} finally {
  await ax.browserClose()
}
