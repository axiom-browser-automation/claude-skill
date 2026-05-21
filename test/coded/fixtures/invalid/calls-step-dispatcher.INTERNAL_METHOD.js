import { AxiomApi } from '@axiom_ai/api'

const ax = new AxiomApi(process.env.AXIOM_API_KEY)

await ax.browserOpen()
try {
  // step() is the internal dispatcher — Claude must emit a named method (goto, click, …) instead.
  await ax.step('driver', 'click', ['.button'])
} finally {
  await ax.browserClose()
}
