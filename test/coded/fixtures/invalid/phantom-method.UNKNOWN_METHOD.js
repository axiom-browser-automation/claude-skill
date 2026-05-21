import { AxiomApi } from '@axiom_ai/api'

const ax = new AxiomApi(process.env.AXIOM_API_KEY)

await ax.browserOpen()
try {
  await ax.goto('https://example.com')
  await ax.scrapeAll('.foo')   // <-- not a real method; expect UNKNOWN_METHOD
} finally {
  await ax.browserClose()
}
