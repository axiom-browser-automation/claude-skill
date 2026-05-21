---
title: Selector overhaul, drag to reorder steps, new templates, and more
version: 3.14
date: 2022-11-29
video: https://www.youtube.com/embed/gMi8T54ETCU?rel=0&amp
---

::HeroMedia
::

## New custom selector interface
***

This one has been in the works for quite some time, but we're pleased to anounce the new custom selector interface is here. Let us know if you have any feedback! 

The new interface hugely improves the experience of adding and editing custom selectors, allowing the following features:

- Custom selectors can be set per column in scrapes
- Easily mix custom selectors with ones that have been automatically selected
- Set selectors from previous data without having to manually edit JSON
- See live previews of your custom selectors
- Select by text
- Get helpful suggestions for refining a selector which can help with automation accuracy

<img src="/releases/select-text.gif"/>

To learn more about the new custom selector tool [click here.](/docs/no-code-tool/the-builder/selector-tool/single)
## Select, copy and move steps
***
This feature has been in demand for a while, and we're pleased to announce it has now been released in axiom 3.14.

By clicking on the step number of a step, or selecting "Select" from the step menu, you can now select one or more steps. Once selected, these can either be copied or moved to a new place, making fixing your bots much easier!

<img src="/releases/draganddrop.gif"/>

## Expanded file download system
***

For new bots, a new file download system has been created that prefers direct downloads from the Axiom application directly. This should significantly improve speed and consistency for many use cases, and the system still falls back to the previous browser-based method when the file cannot be located in this way.

Additionally we have provided a proxy to force downloads that are otherwise not possible to determine automatically.

Old bots will still use the previous method, so anything working should remain as it was.

## Overhauled template system
***

We're delighted to announce that we have replaced our recipe system, which was getting a little long in the tooth. We have now added a set of fresh new templates with much improved user experience and design, and we hope to continue adding more in the upcoming releases.

<img src="/releases/template.gif"/>

## Expanded iframe support
***

Iframe support in Axiom was limited and had some issues. These issues have now been fixed; all interact steps should now be compatible with iframes.

## Error messages now point to the step that caused the error
***

In long or complex bots, it can be difficult to work out where an error is being generated from. To help with this, whenever a runtime error is generated we now highlight the step that caused the error in red, and additionally scroll the builder down to focus on it.

## UI design cleanup
***

We've been working to improve the design language across the board in the axiom builder, with our focus being on consistency. We hope you like it! This general work is ongoing and will continue over the next few releases. Dropdowns, tables and buttons were all covered in this release.

## Minor fixes
***

- Improved select list accuracy when whitespace was present in the option text
- Fixes to infinite hanging issues in the scraper on one website
- Removed desktop only warning for Captcha; you can now use it in the cloud without any issues
- Simplified handling of unicode characters
- Removed misleading output warning from gmail steps
