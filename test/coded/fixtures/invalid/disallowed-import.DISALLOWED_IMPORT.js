import { AxiomApi } from '@axiom_ai/api/internal'   // <-- subpath escape; expect DISALLOWED_IMPORT

const ax = new AxiomApi(process.env.AXIOM_API_KEY)

await ax.browserOpen()
try {
  await ax.goto('https://example.com')
} finally {
  await ax.browserClose()
}
