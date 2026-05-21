/**
 * Re-exports the coded validator so test code uses the exact same path Claude runs.
 */

// @ts-expect-error — pure-JS module, no .d.ts.
import {validateCodedScript} from '../../plugins/axiom/skills/axiom/scripts/validate-coded.js'

export {validateCodedScript}
