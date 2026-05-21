/**
 * Single AJV instance compiled against the vendored AutomationTemplate schema.
 * Re-exports `validateAutomationTemplate()` from the production validator so tests use
 * the exact same code path Claude runs.
 */

// @ts-expect-error — pure-JS module, no .d.ts. Test code just uses the runtime function.
import {validateAutomationTemplate} from '../../plugins/axiom/skills/axiom/scripts/validate-no-code.js'

export {validateAutomationTemplate}
