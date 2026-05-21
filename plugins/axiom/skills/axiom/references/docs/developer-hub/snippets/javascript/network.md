---
title: Network snippets
metaTitle: JavaScript snippets for capturing network requests
description: JavaScript snippets for inspecting and capturing network activity in axiom.ai automations using the Performance API.
order: 4
---

Network snippets help you inspect, log, and react to the requests a page makes during a run.

## Capture network requests
***

Capture every network request a page has made using the [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance). Add this snippet after a [**Go to page**](/docs/no-code-tool/reference/steps/go-to-page) step:

```js
var resources = [];
const entries = window.performance.getEntriesByType('resource');

entries.forEach(entry => {
    resources.push([entry.entryType, entry.name]);
});

return resources;
```

The list of resources is available in the `code-data` token for use in later steps.