# `@axiom_ai/api` method surface

Authoritative list of methods Claude may emit when producing a coded axiom. Anything not in the allowlist below will fail `validate-coded.mjs`. Source of truth: [`axiom-api/src/axiom-api.js`](../../../../axiom-api/src/axiom-api.js) on the published `@axiom_ai/api` package.

## Lifecycle (always pair these)

| Method | Signature | Notes |
|---|---|---|
| `browserOpen()` | `async browserOpen(): Promise<string>` | Opens a cloud browser session. Returns the CDP endpoint and caches it on the instance as `axiom.cdpLink`. |
| `browserClose(cdpLink?)` | `async browserClose(cdpLink?: string): Promise<string>` | Closes the session. Pass `cdpLink` only if you're closing a session from a different instance (rare). |

Every coded axiom must wrap step calls in `try { … } finally { await axiom.browserClose() }` — the validator enforces this.

## Navigation

| Method | Signature |
|---|---|
| `goto(url, doNotShareLocalstorage?, openInNewTab?)` | URL navigation. Third arg `true` opens a new tab. |
| `switchBrowserTab(selectTab)` | Switch focus to a tab by name/URL substring. |

## Interaction

| Method | Signature |
|---|---|
| `click(select, leftClickRightClick?, optionalClick?)` | Single click. `optionalClick: true` makes the step a no-op when the selector matches nothing. |
| `clickMultiple(select, leftClickRightClick?, maxClicks?)` | Click every match up to `maxClicks`. |
| `clickEngagementButton(select, setValueToCheck)` | Idempotent like/follow/subscribe toggle. |
| `hover(select)` | Mouse-over an element. |
| `clickAndDrag(startCoordinates, endCoordinates)` | Mouse-down at one point, release at another. Coordinates are `{scrollX, scrollY, clientX, clientY}`. |
| `enterText(selectTextField, text, delay?, appendExisting?, customLineBreak?, optionalText?)` | Type text into an input. |
| `pressKeys(key, delimiter?, delay?)` | Fire keyboard events (Enter, Tab, arrow keys, modifier combinations). |
| `selectList(select, text)` | Pick an option in a native `<select>` by visible text. |
| `datePicker(selectMonth, selectMonthChangeButton, changeMonthTo, changeDayOfMonthTo)` | Navigate a calendar widget. |

## Data

| Method | Signature |
|---|---|
| `scrape(url, selector, pager, max_results, settings)` | Smart-scrape rows. Pass `null` for `url` to scrape the current page. |
| `scrapeMetadata(metadata)` | Extract structured page-level fields (title, OG tags, schema.org blocks). |
| `getClipboardContents()` | Read the cloud browser's clipboard (after a copy step). |

## AI and utility

| Method | Signature |
|---|---|
| `integrateAI(aiOptions)` | Inline LLM call (extract or generate). `aiOptions: {aiFunction, key?, model?, prompt?, extractData?, promptExtract?}`. |
| `solveCaptcha(apiKey?)` | Hand current page's captcha to a third-party solver. Omit `apiKey` to use the one stored on the account. |
| `wait(time)` | Pause on the pod (keeps the session alive) for `time` ms. |
| `restartBrowser()` | Restart Chrome within the same session. |

## Forbidden

- `step()` — internal dispatcher. Emit a named method like `goto()` or `click()` instead.
- Any underscore-prefixed name (`_sleep`, `_pollStepResult`, `_shouldFallBackToPolling`) — private implementation.
- Imports from any path other than `'@axiom_ai/api'`.

## Always

- Import as `import { AxiomApi } from '@axiom_ai/api'`.
- Read the API key from `process.env.<NAME>`, never inline a literal.
- Wrap step calls in `try { … } finally { await axiom.browserClose() }`.
