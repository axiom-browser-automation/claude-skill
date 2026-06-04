import { AxiomApi } from '@axiom_ai/api'

async function main() {
  const ax = new AxiomApi(process.env.AXIOM_API_KEY)
  await ax.browserOpen()
  await ax.goto('https://example.com')
  await ax.scrape('https://example.com', '.item', null, 10, {})
  // Forgot the try/finally + browserClose. Expect MISSING_LIFECYCLE.
}

await main()
