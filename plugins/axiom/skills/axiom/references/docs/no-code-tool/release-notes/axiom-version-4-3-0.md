---
title: Quick builder, new sidebar, better onboarding, and more
version: "4.3"
date: 2024-07-22
featuredimg: /releases/ax-43.png
video: https://www.youtube.com/embed/8pSPg2LuONU?rel=0&amp
---

::HeroMedia
::

## Quick builder
***

Quickly scaffold a bot by answering a few questions about what you are trying to do, building towards a natural language AI interface for bot building. Give it a try!

<img src="/releases/quickbuilder-new.jpg" alt="New axiom.ai quick builder">

## Quick action sidebar
***

We have introduced a new user interface element - a contextual sidebar with quick actions. This is another area for expansion, with more detailed run reports and other options coming soon. In addition, visuals have been altered to give more room to the debugger and documentation elements, and provide a more comfortable experience.

<img src="/releases/new-sidebar.jpg" alt="New axiom.ai sidebar">

## Basic authentication available for proxies
***

Continuing from the proxy support released in 4.2, we now have enabled basic auth support, as well as IP auth. Look out for proxy rotations coming soon, as we continue to develop this aspect of the tool.

<img src="/releases/proxy-auth.jpg" alt="New axiom.ai proxy authentication">

## New onboarding flow
***

Onboarding slides for new users added going over the basics of axiom automations. You can view them from the menu in the top right of the dashboard!

<img src="/releases/onboarding-flow.jpg" alt="onboaridng flow">

## General improvements to error messaging
***

Error messages across much of the application have been streamlined to be more intuitive and helpful. As well as this, error reporting in loops have been tuned to remove redundant information and to bring them more in line with how other errors are reported. Further work is planned to push this farther, so stay tuned.

## Minor fixes
***

- Fixes to the run viewer step tracker, making it more reliable with large automations.
- Indicate which axiom caused a runtime notification so that re-activating disabled schedules is easier.
- More inuitive data variable naming on loops.
- Fixing text formatting issues when adding a data variable into a URL.
- Fixed an issue with Create Google Sheet preview creating new sheets when it shouldn't.
- Fixed visual issue with empty data variable previews not toggling.
- Corrected broken link to API documentation.
- "Use Element Text" in the selector tool now works properly in conjunction with data variables.
- Fixed display bugs when re-selecting a data variable that's already been set.
