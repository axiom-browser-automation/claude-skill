---
title: Get clipboard contents
metaTitle: Read the cloud browser's clipboard in an axiom.ai session
description: Read the contents of the cloud browser's clipboard, useful for pages that put their copy output on the clipboard rather than in the DOM.
order: 14
---

`axiom.getClipboardContents()` returns the current contents of the cloud browser's clipboard as a string. Use it to retrieve data from pages that respond to a "copy" button by putting the result on the clipboard rather than rendering it into the DOM.

## Signature
***

```javascript
const text = await axiom.getClipboardContents();
```

No parameters. Returns the clipboard contents as a string.

## Example
***

Trigger a page's "copy share link" button and read the link off the clipboard:

```javascript
await axiom.click("button.copy-share-link");
const shareLink = await axiom.getClipboardContents();
console.log(shareLink);
```

## Notes
***

- The clipboard belongs to the cloud browser session, not your local machine. Reading the clipboard from your machine after the session finishes is a separate problem (use a sheet, an HTTP call, or any other output channel from your code).
- The clipboard is shared across all tabs in the session. Successive clicks that each copy to the clipboard will overwrite each other — read between clicks.
- Returns an empty string when the clipboard is empty.

## Related
***

- [Click](/docs/developer-hub/api/step-functions/click)
- [Scrape](/docs/developer-hub/api/step-functions/scrape)
