---
title: Chromium
metaTitle: How Chromium works and how axiom.ai uses it
description: A deep dive into Chromium, how its multi-process architecture and V8 engine affect performance, and how axiom.ai uses Chromium to run automations.
order: 1
---

Chromium is the open-source browser project that axiom.ai uses to run every automation. This page covers what Chromium is, how axiom.ai relies on it, and the architectural decisions that affect performance and memory usage during runs.

## Introduction
***

Chromium is an open-source web browser project developed and maintained by the Chromium Project, primarily backed by Google. It's the foundation for Google Chrome, Microsoft Edge, Brave, and many other popular browsers. Chromium provides a fast, lightweight, and secure browsing experience with a minimal interface and full support for modern web standards. Unlike Chrome, it has no proprietary additions: no automatic updates, no built-in media codecs, and no Google services integration. Developers and tech enthusiasts often use Chromium directly for its transparency, flexibility, and customisation potential [^1] [^2].

According to StatCounter, at the time of publishing, 72.28% of browser market share belonged to Chromium-based browsers, with Chrome leading the pack [^3]. Because of this dominance, Chromium remains an important platform for any tool that automates the browser, including axiom.ai.

## How axiom.ai uses Chromium
***

axiom.ai ships with a bundled version of Chromium and runs every automation inside it. Local runs open a Chromium window on your computer; cloud runs open a Chromium window on axiom.ai's infrastructure. Either way, the automation executes inside that Chromium instance.

Building on Chromium gives axiom.ai a few baseline advantages:

- Compatibility with most Chromium-based browsers.
- Faster pages without Google service integrations.
- A high level of customisation through Chromium's APIs.

These translate into specific axiom.ai features:

- Setting a [custom Chromium profile](/docs/no-code-tool/reference/settings/chrome/profile) to handle authentication or carry over browser settings.
- Routing traffic through a [proxy server](/docs/no-code-tool/reference/settings/run-options/proxy).
- [Storing cookies and local storage](/docs/no-code-tool/reference/settings/run-options/store-cookies) for use across runs.

These are a handful of examples; many other features depend on Chromium under the hood.

## Puppeteer and Chromium
***

[Puppeteer](https://pptr.dev) is a JavaScript library that provides a high-level API to control Chromium over the DevTools Protocol and WebDriver BiDi [^4]. It uses Chromium's built-in APIs to expose a clean automation interface, and axiom.ai uses Puppeteer internally. You can also call Puppeteer directly from a [**Write javascript**](/docs/no-code-tool/reference/steps/write-javascript) step using the [Puppeteer snippets](/docs/developer-hub/snippets/puppeteer).

Puppeteer is developed by Google, so its primary target is Chromium, though a Firefox build is also available. The integration with Chromium gives Puppeteer the ability to:

- Use the DevTools Protocol to render pages, [take screenshots](/docs/no-code-tool/reference/steps/save-screenshot-locally), [automate form submissions](/docs/tutorials/webforms), and [capture network requests](/docs/developer-hub/snippets/javascript/network#capture-network-requests).
- Ship with a stable Chrome version, giving developers a consistent runtime.
- Run in [headless mode](/docs/no-code-tool/reference/settings/run-options/headless), without a graphical interface, for faster automations.
- Support every major operating system.

## Chromium architecture
***

Chromium's architecture prioritises user experience, often at the cost of memory. That trade-off explains why Chromium-based browsers are often associated with high RAM usage. It's a sensible trade for an everyday browser, but it has implications for automation. Here are the main architectural decisions:

- **Multi-process architecture.** Each tab and extension (including axiom.ai) runs in a separate process. This isolates crashes and improves security but uses more RAM. To see the impact on your machine, open Task Manager (Windows) or Activity Monitor (macOS) and count the Chromium processes.
- **Preloading and caching.** Chromium aggressively caches content and preloads pages to keep things responsive.
- **JavaScript and rendering engine.** Chromium uses the V8 JavaScript engine and Blink rendering engine, which compile and execute JavaScript efficiently.
- **Tab and session management.** Recently improved with **Memory Saver** (formerly Data Saver), which puts inactive tabs to sleep. Without that feature on, Chromium keeps inactive tabs in memory so you can switch back instantly without a reload.
- **Garbage collection.** V8 uses aggressive garbage collection to manage memory but sometimes retains unused memory to speed up future tasks.

Each of these decisions improves the user experience at the cost of memory.

### V8 JavaScript engine

A big chunk of Chromium's speed comes from the V8 JavaScript engine, which compiles JavaScript Just-In-Time (JIT). V8 is written in C++, runs on every major operating system, and implements ECMAScript and WebAssembly [^5]. SpiderMonkey, Firefox's engine, also uses a C++ JIT compiler with overlapping optimisations [^6].

V8 has seen significant advances over the past few years: a new optimising compiler called Maglev (which sits between Sparkplug and TurboFan), a redesigned TurboFan architecture, a faster HTML parser, and improved DOM allocations [^7]. Garbage collection improvements have added further performance gains.

For axiom.ai, this matters because Puppeteer runs inside Chromium and benefits from every V8 improvement. Each release makes the platform a little bit faster and more reliable for automation.

### Process model

As mentioned, Chromium isolates each tab and extension into its own process. This stops a single bad tab from taking down the browser and improves security between tabs. Each rendered page runs in its own process with a `RenderProcess` object that communicates with the parent browser process. The browser keeps a `RenderProcessHost` for each renderer, which manages browser-side state and communication [^8].

When a new tab or window opens, Chromium creates a new process and a single `RenderFrame` that uses Mojo (an IPC service) to talk to the corresponding `RenderFrameHost` in the browser process. The `RenderFrame` represents a page, including any iframes inside it. Some windows opened with `window.open` share a `RenderFrame` with the page that opened them. To rein in process counts, Chromium can also adopt existing tabs into another tab's `RenderFrame` once the total number of tabs hits a limit.

This has direct implications for automation. When you run an automation, Chromium loads the page, all its resources, and the resources axiom.ai needs to drive it. axiom.ai's own footprint is small, but on heavy pages Chromium can hit the memory limit of the tab's process. When that happens, the tab crashes but the rest of the browser doesn't. Long-running browser sessions with long-running automations can run into the same issue. Reloading the page usually clears it.

### Security model

Chromium uses a sandbox to protect against vulnerabilities in the rendering engine. The sandbox blocks the rendering engine from making system calls that could exploit a vulnerability, and uses security tokens to make sure a compromised renderer can't reach the host operating system [^9]. The sandbox pairs with the multi-process model: encapsulated processes plus restricted system access. Think of the sandbox as a sealed box where error-prone work happens.

The Chromium team runs an active vulnerability management process:

- Vulnerabilities are found through [automated fuzzing](https://en.wikipedia.org/wiki/Fuzzing), security audits, and external reports.
- A public bug tracker documents security issues.
- Patches are developed, tested, and shipped on the schedule defined by the security risk mitigation plan.

Chromium uses ClusterFuzz to run fuzzing infrastructure that continuously tests for crashes and vulnerabilities. AddressSanitizer and UndefinedBehaviorSanitizer detect memory corruption and undefined behaviour during development, and Syzkaller handles kernel fuzzing for sandboxed processes [^10].

Chromium ships security updates on a fast release cadence, and most Chromium-based browsers (including Chrome) auto-update so users get the patches as soon as they're available. Updates are tracked publicly on Google's [Chrome Releases blog](https://chromereleases.googleblog.com).

## References
***

[^1]: Chromium Project, [Home](https://www.chromium.org/Home/).
[^2]: Chromium Project, [Core Principles](https://www.chromium.org/developer-hub/core-principles/).
[^3]: StatCounter, [Browser Market Share](https://gs.statcounter.com/browser-market-share).
[^4]: Puppeteer, [What is Puppeteer?](https://pptr.dev/guides/what-is-puppeteer).
[^5]: V8, [v8.dev](https://v8.dev/).
[^6]: SpiderMonkey, [spidermonkey.dev](https://spidermonkey.dev/).
[^7]: V8, ["V8 is Faster and Safer than Ever!"](https://v8.dev/blog/holiday-season-2023).
[^8]: Chromium, ["Multi-process Architecture"](https://www.chromium.org/developer-hub/design-documents/multi-process-architecture/).
[^9]: Adam Barth, Collin Jackson, Charles Reis, and the Google Chrome Team, ["The Security Architecture of the Chromium Browser"](https://seclab.stanford.edu/websec/chromium/chromium-security-architecture.pdf), 2008.
[^10]: Chromium, [libfuzzer documentation](https://chromium.googlesource.com/chromium/src/+/main/testing/libfuzzer/README.md).