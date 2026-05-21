---
title: Proxy rotation, AI updates, new run options and more
version: "4.7"
date: 2025-07-07
video: https://www.youtube.com/embed/0VHj5sxmfmQ?si=pUk3YOD1YHT1HNpX?rel=0&amp;
---

::HeroMedia
::

## Run dropdown

***

A new dropdown has been added to the run button to surface some of the more useful runtime settings - cookie storage, scheduling, bot detection bypass and notifications.

<img src="/releases/run-menu.webp" alt="New run menu dropdown in axiom.ai">

## Proxy rotation

***

You can now specify a list of proxies to use; axiom will rotate through them randomly during runs.

<img src="/releases/rotate-proxy.webp" alt="Rotate your proxies in axiom.ai">

## New AI step and new providers

***

We have revamped the AI step to both simplify the UI and to integrate new providers, with model options now provided from Claude.ai, Deepseek and Perplexity. You will need an API key for each of these providers to use these new models.

<img src="/releases/intergrate-ai.webp" alt="Intergrate with any ai">

## Option to automatically re-sync a cookie during axiom runs
***

You can now optionally turn on the ability to automatically re-sync cookies if they change while axiom is running. In some cases this should cut down significantly on the number of manual re-syncs you need to do to keep an automation running.

<img src="/releases/auto-re-sync.webp" alt="re-sync cookies in axiom.ai">

## New API routes

***

We've added some new utility routes to our API: Get remaining runtime, get list of automations, and get last n run reports.

## Optionally block resources

***

A new setting has been added to allow you to specify resource blocking rules for images, files etc. This can be used on heavy pages to speed up runs and reduce memory usage.

<img src="/releases/block-resources.webp" alt="speed up scraping block resources axiom.ai">

## Restart Chromium step

***

On some sites, Chrome can run out of memory during long automations. We've added a step which restarts the tab when triggered, clearing any memory buildup on such sites.

<img src="/releases/restart-browser.webp" alt="restart chromium to prevent running out of memory">

## General performance improvements

***

We've made a number of changes to improve the performance of axiom in certain edge cases. This involves reducing the memory usage of the app during long automations, preventing issues with Chrome crashes when a large number of sites are used in one automations, and significantly improving the performance of the auto-wait functionality on long or complex pages.

## Re-sync cookies from the "Go to page" step

***

We've added a new button so you can re-sync any cloud cookie storage directly from the "Go to page" step, rather than needing to go via the settings.

<img src="/releases/resync-cookies.webp" alt="re-sync cookies in axiom.ai">

## Minor fixes

- Cleaned up some request spam when authenticating a Google account
- Made sure step finder does not open in collapsed state when it shouldn't
- Fixed a bug where the infinite loader on the axiom listing would stop working in some cases
- Added ability to search the run report page by error message
- Removed invisible reCaptchaV3 from list of captchas solved by the captcha solving step
- Fixed an issue with reading from sheets with colons or exclamation marks in their names
- Delete modal now displays the automation name to reduce the chance of deleting the wrong thing
- Hourly intervals in the scheduler now preserve the starting minute, preventing schedules from drifting from their chosen start time
- Downgrading from pro to started now properly disables local schedules
- Fixed an issue where token replacement for javascript if statements inside loops did not replace properly