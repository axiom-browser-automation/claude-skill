import { AxiomApi } from '@axiom_ai/api'

const ax = new AxiomApi(process.env.AXIOM_API_KEY)

await ax.browserOpen()
try {
  await ax._pollStepResult('foo')   // <-- private; expect PRIVATE_METHOD
} finally {
  await ax.browserClose()
}
